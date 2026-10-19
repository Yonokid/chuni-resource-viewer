import * as THREE from "three";
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";

/** SglBasicParticle emitter as exported by stage3d.py (node extras.particles); times are 60 fps frames. */
export interface ParticleDef {
  shape: number; // 2/11/12 box (full size), 3 disc (radius size[0]), else sphere (radius size[0])
  size: number[];
  count: number; // live cap: min(max particles, emission rate × life)
  emit?: number; // particles emitted per frame (huge when everything spawns at once)
  life: number;
  startSize: number[];
  endSize: number[]; // [-1, -1] = keep the start size
  velocity: number[][]; // [min, max] per frame
  acceleration: number[][];
  colors: number[][]; // [frame, r, g, b, a] over life; empty = fade in/out
  scales: number[][]; // [frame, multiplier] over life
  cols: number;
  rows: number;
  frames: number;
  frameTime: number;
  texture: number;
  additive?: boolean;
  rate?: number; // SglTimeRate above the emitter
  tint?: { keys: number[][] } | null;
}

const MAX_PARTICLES = 3000;
const MAX_POINT_SIZE = 64; // D3DRS_POINTSIZE_MAX default, in 1080p pixels

const vertexShader = `
  attribute float aSize;
  attribute vec4 aColor;
  attribute float aFrame;
  uniform float scale;
  uniform float maxSize;
  varying vec4 vColor;
  varying float vFrame;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    // sea draws D3D9 point sprites: perspective size, clamped to D3DRS_POINTSIZE_MAX (64 px by default), which keeps
    // emitters right in front of the camera (World's End's bubbles and noise grid) from filling the screen
    gl_PointSize = min(aSize * scale / max(-mv.z, 0.001), maxSize);
    gl_Position = projectionMatrix * mv;
    vColor = aColor;
    vFrame = aFrame;
  }`;
const fragmentShader = `
  uniform sampler2D map;
  uniform vec2 grid;
  uniform vec4 tint;
  uniform float aspect; // cell width / height: AIR's 8x128 and 1024x16 streaks stay thin instead of square
  varying vec4 vColor;
  varying float vFrame;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    uv = (aspect < 1.0 ? vec2(uv.x / aspect, uv.y) : vec2(uv.x, uv.y * aspect)) + 0.5;
    if (any(lessThan(uv, vec2(0.0))) || any(greaterThan(uv, vec2(1.0)))) discard;
    vec2 cell = vec2(mod(vFrame, grid.x), floor(vFrame / grid.x));
    vec4 c = texture2D(map, (cell + uv) / grid) * vColor * tint;
    if (c.a < 0.004) discard;
    gl_FragColor = c;
  }`;

const lerpKeys = (keys: number[][], t: number): number[] => {
  if (t <= keys[0][0]) return keys[0].slice(1);
  for (let i = 1; i < keys.length; i++)
    if (t <= keys[i][0]) {
      const [t0, ...a] = keys[i - 1];
      const [t1, ...b] = keys[i];
      return a.map((v, j) => v + (b[j] - v) * (t1 > t0 ? (t - t0) / (t1 - t0) : 1));
    }
  return keys[keys.length - 1].slice(1);
};
const between = (lo: number, hi: number) => lo + (hi - lo) * Math.random();

export class Emitter {
  readonly points: THREE.Points;
  private readonly def: ParticleDef;
  private readonly n: number;
  private readonly pos: Float32Array;
  private readonly vel: Float32Array;
  private readonly acc: Float32Array;
  private readonly age: Float32Array;
  private readonly size0: Float32Array;
  private readonly size1: Float32Array;
  private readonly colors: number[][];
  private readonly scales: number[][];
  private readonly frameCount: number;
  private readonly frameTime: number;
  private spawnDebt = 0;
  private next = 0;

  constructor(def: ParticleDef, map: THREE.Texture) {
    this.def = def;
    this.n = Math.min(Math.max(def.count, 1), MAX_PARTICLES);
    this.pos = new Float32Array(this.n * 3);
    this.vel = new Float32Array(this.n * 3);
    this.acc = new Float32Array(this.n * 3);
    this.age = new Float32Array(this.n).fill(Infinity); // dead until spawned
    this.size0 = new Float32Array(this.n);
    this.size1 = new Float32Array(this.n);
    this.colors = [...def.colors].sort((a, b) => a[0] - b[0]);
    this.scales = [...def.scales].sort((a, b) => a[0] - b[0]);
    const rows = def.rows > 0 ? def.rows : def.cols;
    this.frameCount = def.frames > 0 ? def.frames : def.cols * rows;
    this.frameTime = def.frameTime > 0 ? def.frameTime : def.life / this.frameCount;
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(this.pos, 3));
    geometry.setAttribute("aColor", new THREE.BufferAttribute(new Float32Array(this.n * 4), 4));
    geometry.setAttribute("aSize", new THREE.BufferAttribute(new Float32Array(this.n), 1));
    geometry.setAttribute("aFrame", new THREE.BufferAttribute(new Float32Array(this.n), 1));
    const t = def.tint?.keys?.[0]?.slice(1) ?? [1, 1, 1, 1];
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        map: { value: map },
        grid: { value: new THREE.Vector2(def.cols, rows) },
        aspect: { value: map.image ? ((map.image as { width: number; height: number }).width / def.cols) / ((map.image as { width: number; height: number }).height / rows) : 1 },
        tint: { value: new THREE.Vector4(t[0], t[1], t[2], t[3]) },
        scale: { value: 500 },
        maxSize: { value: 64 },
      },
      transparent: true,
      depthWrite: false,
      blending: def.additive ? THREE.AdditiveBlending : THREE.NormalBlending,
    });
    this.points = new THREE.Points(geometry, material);
    this.points.frustumCulled = false;
    for (let f = 0; f < def.life; f++) this.step(1 / (def.rate || 1)); // pre-warm: start with a full field
  }

  private spawn(i: number) {
    const { shape, size, velocity: v, acceleration: a } = this.def;
    let x = 0, y = 0, z = 0;
    if (shape === 2 || shape === 11 || shape === 12) {
      x = (Math.random() - 0.5) * size[0];
      y = (Math.random() - 0.5) * size[1];
      z = (Math.random() - 0.5) * size[2];
    } else if (shape === 3) {
      const r = Math.sqrt(Math.random()) * size[0], th = Math.random() * Math.PI * 2;
      x = r * Math.cos(th);
      z = r * Math.sin(th);
    } else if (size[0] > 0) {
      const r = Math.cbrt(Math.random()) * size[0], th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1);
      x = r * Math.sin(ph) * Math.cos(th);
      y = r * Math.cos(ph);
      z = r * Math.sin(ph) * Math.sin(th);
    }
    this.pos.set([x, y, z], i * 3);
    this.vel.set([0, 1, 2].map((k) => between(v[0][k], v[1][k])), i * 3);
    this.acc.set([0, 1, 2].map((k) => between(a[0][k], a[1][k])), i * 3);
    this.age[i] = 0;
    this.size0[i] = between(this.def.startSize[0], this.def.startSize[1]);
    this.size1[i] = this.def.endSize[0] < 0 ? this.size0[i] : between(this.def.endSize[0], this.def.endSize[1]);
  }

  /** Advance `frames` (60 fps units) and refresh the GPU attributes. */
  step(frames: number) {
    frames *= this.def.rate ?? 1;
    const { life } = this.def;
    // the steady state keeps n alive; a slower emitter (the World's End bubbles: 2 every 200 frames) keeps fewer
    this.spawnDebt += Math.min(this.def.emit ?? Infinity, this.n / Math.max(life, 1)) * frames;
    while (this.spawnDebt >= 1) {
      this.spawn(this.next);
      this.next = (this.next + 1) % this.n;
      this.spawnDebt -= 1;
    }
    const geo = this.points.geometry;
    const color = geo.getAttribute("aColor") as THREE.BufferAttribute;
    const sizeAttr = geo.getAttribute("aSize") as THREE.BufferAttribute;
    const frameAttr = geo.getAttribute("aFrame") as THREE.BufferAttribute;
    for (let i = 0; i < this.n; i++) {
      if (this.age[i] >= life) {
        color.setW(i, 0);
        continue;
      }
      for (let k = 0; k < 3; k++) {
        this.vel[i * 3 + k] += this.acc[i * 3 + k] * frames;
        this.pos[i * 3 + k] += this.vel[i * 3 + k] * frames;
      }
      this.age[i] += frames;
      const t = this.age[i];
      const rgba = this.colors.length
        ? lerpKeys(this.colors, t)
        : [1, 1, 1, Math.max(0, Math.min(1, t / (life * 0.2), (life - t) / (life * 0.2)))];
      color.setXYZW(i, rgba[0], rgba[1], rgba[2], rgba[3]);
      const mult = this.scales.length ? lerpKeys(this.scales, t)[0] : 1;
      sizeAttr.setX(i, (this.size0[i] + (this.size1[i] - this.size0[i]) * (t / life)) * mult);
      frameAttr.setX(i, Math.floor(t / this.frameTime) % this.frameCount);
    }
    (geo.getAttribute("position") as THREE.BufferAttribute).needsUpdate = true;
    color.needsUpdate = sizeAttr.needsUpdate = frameAttr.needsUpdate = true;
  }

  /** Pixels per world unit at distance 1, and canvas pixels per game pixel (the game renders 1920x1080). */
  setScale(pixelsPerUnitAtOne: number, pixelsPerGamePixel: number) {
    const u = (this.points.material as THREE.ShaderMaterial).uniforms;
    u.scale.value = pixelsPerUnitAtOne;
    u.maxSize.value = MAX_POINT_SIZE * pixelsPerGamePixel;
  }
}

/** Builds an Emitter for every node with extras.particles and parents its Points under that node. */
export const collectEmitters = async (gltf: GLTF): Promise<Emitter[]> => {
  const nodes: THREE.Object3D[] = [];
  gltf.scene.traverse((o) => {
    if (o.userData.particles) nodes.push(o);
  });
  return Promise.all(
    nodes.map(async (o) => {
      const def = o.userData.particles as ParticleDef;
      const map = (await gltf.parser.getDependency("texture", def.texture)) as THREE.Texture;
      const emitter = new Emitter(def, map);
      o.add(emitter.points);
      return emitter;
    }),
  );
};
