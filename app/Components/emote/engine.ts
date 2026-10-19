// E-mote pose renderer for the unpacked .emtbytes JSON (chuni-parsing-library chuni/emote, docs/emote_format.md).
// Not a full runtime: no mesh deformation (mesh.bp), stencil masks, physics or blend modes.

type Matrix = [number, number, number, number]; // x' = m0 x + m1 y, y' = m2 x + m3 y

interface Frame {
  time: number;
  type: number; // 0 end, 1 single, 2 continuous (hold), 3 tween
  content?: Record<string, unknown> | null;
}
interface Layer {
  label: string;
  frameList: Frame[];
  children: Layer[];
  parameterize: number | null;
  transformOrder?: number[];
  exportSelf?: number;
}
interface Parameter {
  id: string;
  rangeBegin: number;
  rangeEnd: number;
  division: number;
}
interface Motion {
  layer: Layer[];
  parameter?: Parameter[];
}
interface Icon {
  left: number;
  top: number;
  width: number;
  height: number;
  originX: number;
  originY: number;
  resolution?: number;
}
export interface Timeline {
  label: string;
  diff: number;
  loopBegin: number;
  loopEnd: number;
  variableList: { label: string; frameList: Frame[] }[];
}
export interface EmoteJson {
  metadata: {
    variableList: { label: string }[];
    selectorControl: { label: string; enabled?: number; optionList: { label: string; onValue: number; offValue: number }[] }[];
    timelineControl: Timeline[];
    charaProfile: { pixelMarker: { top: number; bottom: number; boundsLeft: number; boundsRight: number } };
  };
  object: Record<string, { motion: Record<string, Motion> }>;
  source: { tex: { icon: Record<string, Icon> } };
}

const DEFAULTS: Record<string, number | number[]> = {
  coord: [0, 0, 0], angle: 0, opa: 255, zx: 1, zy: 1, ox: 0, oy: 0, sx: 0, sy: 0, fx: 0, fy: 0,
};
type Content = Record<string, unknown>;

const lerp = (a: number | number[], b: number | number[], t: number): number | number[] =>
  Array.isArray(a) ? a.map((x, i) => x + ((b as number[])[i] - x) * t) : a + ((b as number) - a) * t;

// the frame in force at `t`; tween frames blend towards the next one (absent properties mean their default)
const contentAt = (frames: Frame[], t: number): Content | null => {
  let idx = -1;
  for (let i = 0; i < frames.length && frames[i].time <= t; i++) idx = i;
  if (idx < 0) return null;
  const f = frames[idx];
  if (f.type === 0 || !f.content) return null;
  if (f.type === 1 && Math.abs(f.time - t) > 1e-3) return null;
  const c: Content = { ...f.content };
  const n = frames[idx + 1];
  if (f.type === 3 && n && n.type !== 0 && n.content && n.time > f.time) {
    const u = (t - f.time) / (n.time - f.time);
    for (const k of Object.keys(DEFAULTS)) {
      if (!(k in c || k in n.content)) continue;
      const from = (c[k] ?? DEFAULTS[k]) as number, to = (n.content[k] ?? DEFAULTS[k]) as number;
      // angles are stored mod 360 (355 means -5): turn the short way round instead of sweeping through 180
      c[k] = k === "angle" ? from + (((((to - from) % 360) + 540) % 360) - 180) * u : lerp(from, to, u);
    }
  }
  return c;
};

const mul = (a: Matrix, b: Matrix): Matrix => [
  a[0] * b[0] + a[1] * b[2], a[0] * b[1] + a[1] * b[3],
  a[2] * b[0] + a[3] * b[2], a[2] * b[1] + a[3] * b[3],
];

// transformOrder: 0 flip, 1 angle, 2 zoom, 3 slant (applied in list order)
const localMatrix = (order: number[], c: Record<string, number | number[]>): Matrix => {
  let m: Matrix = [1, 0, 0, 1];
  for (const t of order) {
    if (t === 0) {
      if (c.fx) m = [-m[0], -m[1], m[2], m[3]];
      if (c.fy) m = [m[0], m[1], -m[2], -m[3]];
    } else if (t === 2) {
      m = [m[0] * (c.zx as number), m[1] * (c.zx as number), m[2] * (c.zy as number), m[3] * (c.zy as number)];
    } else if (t === 1 && Math.abs(c.angle as number) > 1e-4) {
      const r = ((c.angle as number) * Math.PI) / 180;
      const co = Math.cos(r), si = Math.sin(r);
      m = [co * m[0] - si * m[2], co * m[1] - si * m[3], si * m[0] + co * m[2], si * m[1] + co * m[3]];
    } else if (t === 3 && (Math.abs(c.sx as number) > 1e-4 || Math.abs(c.sy as number) > 1e-4)) {
      const sx = c.sx as number, sy = c.sy as number;
      m = [m[0] + sx * m[2], m[1] + sx * m[3], sy * m[0] + m[2], sy * m[1] + m[3]];
    }
  }
  return m;
};

interface Ctx { x: number; y: number; z: number; m: Matrix; opa: number }
interface Draw { ctx: Ctx; icon: Icon; ox: number; oy: number }

const sampleVariable = (frames: Frame[], t: number): number => {
  const ks = frames.filter((f) => f.type !== 0 && f.content).map((f) => [f.time, (f.content as { value: number }).value]);
  if (ks.length === 0) return 0;
  if (t <= ks[0][0]) return ks[0][1];
  for (let i = 0; i + 1 < ks.length; i++) {
    if (t >= ks[i][0] && t < ks[i + 1][0]) return ks[i][1] + ((ks[i + 1][1] - ks[i][1]) * (t - ks[i][0])) / (ks[i + 1][0] - ks[i][0]);
  }
  return ks[ks.length - 1][1];
};

/** Maps a clock (frames) onto a timeline, looping inside loopBegin..loopEnd once it gets there. */
export const timelineTime = (tl: Timeline, t: number) =>
  tl.loopBegin >= 0 && tl.loopEnd > tl.loopBegin && t > tl.loopEnd
    ? tl.loopBegin + ((t - tl.loopBegin) % (tl.loopEnd - tl.loopBegin))
    : t;

export class EmoteRenderer {
  private variables = new Map<string, number>();
  private draws: Draw[] = [];

  constructor(private model: EmoteJson, private atlas: CanvasImageSource) {}

  timelines() {
    return this.model.metadata.timelineControl;
  }

  /** Sets the variables from the given timelines (main first, then diff overlays) at clock `t`. */
  private setVariables(active: Timeline[], t: number) {
    const md = this.model.metadata;
    this.variables.clear();
    md.variableList.forEach((v) => this.variables.set(v.label, 0));
    for (const tl of active) {
      const at = timelineTime(tl, t);
      tl.variableList.forEach((v) => this.variables.set(v.label, sampleVariable(v.frameList, at)));
    }
    for (const s of md.selectorControl) {
      if (s.enabled === 0) continue;
      const idx = Math.trunc(this.variables.get(s.label) ?? 0);
      s.optionList.forEach((o, i) => this.variables.set(o.label, i === idx ? o.onValue : o.offValue));
    }
  }

  private layerTime(m: Motion, layer: Layer): number {
    const p = layer.parameterize != null ? m.parameter?.[layer.parameterize] : undefined;
    if (!p || p.rangeEnd === p.rangeBegin) return 0;
    const lo = Math.min(p.rangeBegin, p.rangeEnd), hi = Math.max(p.rangeBegin, p.rangeEnd);
    const v = Math.min(Math.max(this.variables.get(p.id) ?? 0, lo), hi);
    return ((v - p.rangeBegin) / (p.rangeEnd - p.rangeBegin)) * p.division;
  }

  private walk(layer: Layer, m: Motion, ctx: Ctx, stack: Set<string>) {
    const c = contentAt(layer.frameList, this.layerTime(m, layer));
    let cur = ctx;
    if (c) {
      const cc: Record<string, number | number[]> = {};
      for (const k of Object.keys(DEFAULTS)) cc[k] = (c[k] ?? DEFAULTS[k]) as number | number[];
      const co = cc.coord as number[];
      cur = {
        x: ctx.x + ctx.m[0] * co[0] + ctx.m[1] * co[1],
        y: ctx.y + ctx.m[2] * co[0] + ctx.m[3] * co[1],
        z: ctx.z + co[2],
        m: mul(ctx.m, localMatrix(layer.transformOrder ?? [0, 3, 2, 1], cc)),
        opa: Math.round((ctx.opa * (cc.opa as number)) / 255),
      };
      const src = c.src as string | undefined, icon = c.icon as string | undefined;
      if (src === "tex" && icon && this.model.source.tex.icon[icon]) {
        this.draws.push({ ctx: cur, icon: this.model.source.tex.icon[icon], ox: cc.ox as number, oy: cc.oy as number });
      } else if (src && icon && this.model.object[src]?.motion[icon] && !stack.has(`${src}/${icon}`)) {
        const sub = this.model.object[src].motion[icon];
        const next = new Set(stack).add(`${src}/${icon}`);
        for (const l of sub.layer) this.walk(l, sub, cur, next);
      }
    }
    if (layer.exportSelf !== 0) for (const ch of layer.children) this.walk(ch, m, cur, stack);
  }

  /** Draws the pose of `active` timelines at clock `t` (frames) into a canvas, framed on the character's bounds. */
  draw(g: CanvasRenderingContext2D, width: number, height: number, active: Timeline[], t: number) {
    this.setVariables(active, t);
    this.draws = [];
    const root = this.model.object.all_parts.motion["全体構造"];
    for (const l of root.layer) this.walk(l, root, { x: 0, y: 0, z: 0, m: [1, 0, 0, 1], opa: 255 }, new Set());
    this.draws = this.draws.filter((d) => d.ctx.opa > 0).sort((a, b) => a.ctx.z - b.ctx.z);

    const pm = this.model.metadata.charaProfile.pixelMarker;
    const scale = (height * 0.96) / (pm.bottom - pm.top);
    const cy = (pm.top + pm.bottom) / 2;
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.clearRect(0, 0, width, height);
    g.imageSmoothingQuality = "high";
    for (const { ctx, icon, ox, oy } of this.draws) {
      const res = icon.resolution || 1;
      const ow = ox + icon.originX, oh = oy + icon.originY;
      const s = scale / res;
      g.setTransform(
        ctx.m[0] * s, ctx.m[2] * s, ctx.m[1] * s, ctx.m[3] * s,
        scale * (ctx.x - (ctx.m[0] * ow + ctx.m[1] * oh)) + width / 2,
        scale * (ctx.y - (ctx.m[2] * ow + ctx.m[3] * oh)) + height / 2 - scale * cy,
      );
      g.globalAlpha = ctx.opa / 255;
      const cw = Math.ceil(icon.width * res), ch = Math.ceil(icon.height * res);
      g.drawImage(this.atlas, icon.left, icon.top, cw, ch, 0, 0, cw, ch);
    }
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.globalAlpha = 1;
  }
}
