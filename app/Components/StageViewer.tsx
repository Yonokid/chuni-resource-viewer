"use client";
import { useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import * as THREE from "three";
import { GLTFLoader, GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { collectEmitters, Emitter } from "./stageParticles";

// The game's fixed play camera (acroarts/nf_gamecamera.afb): vertical FOV 27.5°, near 1, far 1500.
const EYE = new THREE.Vector3(0, 57, 44);
const TARGET = new THREE.Vector3(0, 3, -146.5);

const makeScene = () => {
  const scene = new THREE.Scene();
  const defaults = new THREE.Group(); // replaced by the stage's own lights when it has any
  defaults.name = "default lights";
  defaults.add(new THREE.AmbientLight(0xffffff, 1.5));
  const sun = new THREE.DirectionalLight(0xffffff, 2);
  sun.position.set(0.3, 1, 0.5);
  defaults.add(sun);
  scene.add(defaults);
  return scene;
};

interface Filter {
  kind: "bloom" | "bloom2" | "color";
  loop: boolean;
  params: string[];
  keys: number[][]; // [seconds, ...values in `params` order], sampled like tints
}
interface StageExtras {
  ambient?: [number, number, number, number]; // rgb + intensity (the ARGB alpha)
  fog?: { color: [number, number, number]; near: number; far: number; max: number };
  filters?: Filter[];
}

// sea FilterColor2 (shaderParam0 = rgb, saturation; shaderParam1 = brightness - 0.5, contrast, gamma, power).
// ponytail: the game's shader isn't recovered; this is the usual tone / saturate / contrast-around-0.5 / gamma
// chain, applied in gamma space.
const ColorShader = {
  uniforms: {
    tDiffuse: { value: null },
    color: { value: new THREE.Vector3(1, 1, 1) },
    saturation: { value: 1 },
    brightness: { value: 0 },
    contrast: { value: 1 },
    gamma: { value: 1 },
    power: { value: 1 },
  },
  vertexShader: `varying vec2 vUv;
    void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  fragmentShader: `uniform sampler2D tDiffuse;
    uniform vec3 color;
    uniform float saturation, brightness, contrast, gamma, power;
    varying vec2 vUv;
    void main() {
      vec4 t = texture2D(tDiffuse, vUv);
      vec3 c = pow(max(t.rgb, 0.0), vec3(1.0 / 2.2));
      c = mix(dot(c, vec3(0.299, 0.587, 0.114)) * color, c, saturation); // colour tones the grey part
      c = (c + brightness - 0.5) * contrast + 0.5;
      c = pow(max(c, 0.0), vec3(gamma)) * power;
      gl_FragColor = vec4(pow(c, vec3(2.2)), t.a);
    }`,
};

/**
 * Sgl2DPrimitive quads (extras.screen = origin mode) move into 1920x1080 pixel layers, in tree order. Mode 0
 * (centred, y up) quads are backdrops behind the 3D background (skies, gradients); mode 2 (top-left, y down) quads
 * go in front (the Band audience). ponytail: the layer split by mode is inferred from what the textures show.
 */
const collectScreen = (gltf: GLTF, back: THREE.Scene, front: THREE.Scene) => {
  const quads: THREE.Object3D[] = [];
  gltf.scene.traverse((o) => {
    if (o.userData.screen !== undefined) quads.push(o);
  });
  gltf.scene.updateMatrixWorld();
  quads.forEach((o, i) => {
    const layer = o.userData.screen === 2 ? front : back;
    layer.attach(o);
    if (layer === front) o.position.set(o.position.x - 960, 540 - o.position.y, o.position.z);
    o.traverse((c) => {
      const mesh = c as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.renderOrder = i;
      for (const m of [mesh.material].flat()) m.depthTest = m.depthWrite = false;
    });
  });
};

// UnrealBloomPass mip weights at radius 0.4: 0.2·f + 0.48 for f = 1, 0.8, 0.6, 0.4, 0.2.
const BLOOM_GAIN = 3;

/** Post filters of the background scene; returns a per-frame updater for animated parameters. */
const addFilters = (composer: EffectComposer, filters: Filter[]) => {
  const updates = filters.map((f) => {
    const pass =
      f.kind === "color"
        ? new ShaderPass(ColorShader)
        : new UnrealBloomPass(new THREE.Vector2(256, 256), 1, 0.4, 0.8);
    composer.insertPass(pass, composer.passes.length - 1); // before the OutputPass
    return (time: number) => {
      const v = Object.fromEntries(sampleTint(f, time).map((x, i) => [f.params[i], x]));
      if (pass instanceof UnrealBloomPass) {
        // ponytail: BloomRange is subtracted from the colour (FilterBloom 0x5f1c50), so it's the threshold; Bloom2
        // passes it with its RetinaRatio, guessed here as range / ratio. Intensity is the total glow added (FilterBloom's
        // is ~3x FilterBloom2's); three's five mips sum to ~3x `strength` at radius 0.4, hence BLOOM_GAIN.
        // Attenuation, stars and Bloom2's tone mapping are ignored.
        pass.threshold = f.kind === "bloom2" ? Math.min(v.threshold / (v.retina || 1), 1) : v.threshold;
        pass.strength = (f.kind === "bloom" ? v.intensity / 3 : v.intensity) / BLOOM_GAIN;
      } else {
        const u = (pass as ShaderPass).uniforms;
        u.color.value.set(v["color.r"], v["color.g"], v["color.b"]);
        for (const k of ["saturation", "brightness", "contrast", "gamma", "power"]) u[k].value = v[k];
      }
    };
  });
  return (time: number) => updates.forEach((u) => u(time));
};

/**
 * Applies the stage's lights (stage3d.py): KHR_lights_punctual parallel/point lights, ambient and fog from the
 * scene extras. Intensities are scaled by π for three's physically based lights; point lights get a hard range
 * cutoff instead of inverse-square falloff. Fog is linear and never exceeds `max` (the colour's alpha).
 */
const applyEnvironment = (gltf: GLTF, scene: THREE.Scene) => {
  const extras = (gltf.scene.userData ?? {}) as StageExtras;
  let lit = false;
  gltf.scene.traverse((o) => {
    const light = o as THREE.Light;
    if (!light.isLight) return;
    lit = true;
    light.intensity *= Math.PI;
    if ((light as THREE.PointLight).isPointLight) (light as THREE.PointLight).decay = 0;
  });
  if (extras.ambient) {
    const [r, g, b, a] = extras.ambient;
    scene.add(new THREE.AmbientLight(new THREE.Color(r, g, b), a * Math.PI));
    lit = true;
  }
  if (lit) scene.getObjectByName("default lights")?.removeFromParent();
  const fog = extras.fog;
  if (!fog) return;
  scene.fog = new THREE.Fog(new THREE.Color(...fog.color), fog.near, fog.far);
  gltf.scene.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;
    for (const m of [mesh.material].flat() as THREE.Material[]) m.userData.fogMax = fog.max;
  });
};

interface Tint {
  keys: number[][]; // [seconds, r, g, b, a]: reached at that time, linear in between
  loop: boolean;
}
interface TintTarget {
  tint: Tint;
  rate: number; // SglTimeRate of the node (extras.rate)
  mats: { m: THREE.MeshStandardMaterial; color: THREE.Color; opacity: number }[];
}

/** MomMaterial colour multipliers (node extras.tint): clone the materials under each node so they tint alone. */
const collectTints = (gltf: GLTF): TintTarget[] => {
  const out: TintTarget[] = [];
  gltf.scene.traverse((o) => {
    const tint = o.userData.tint as Tint | undefined;
    if (!tint?.keys?.length) return;
    const target: TintTarget = { tint, rate: o.userData.rate ?? 1, mats: [] };
    const fades = tint.keys.some((k) => k[4] < 1);
    o.traverse((c) => {
      const mesh = c as THREE.Mesh;
      if (!mesh.isMesh) return;
      const clone = (m: THREE.Material) => {
        const copy = (m.userData.owned ? m : m.clone()) as THREE.MeshStandardMaterial;
        copy.onBeforeCompile = m.onBeforeCompile;
        copy.userData.owned = true;
        if (fades) copy.transparent = true;
        target.mats.push({ m: copy, color: copy.color.clone(), opacity: copy.opacity });
        return copy;
      };
      mesh.material = Array.isArray(mesh.material) ? mesh.material.map(clone) : clone(mesh.material);
    });
    out.push(target);
  });
  return out;
};

type UvModule =
  | { kind: "keys"; set: number; loop: boolean; keys: number[][] } // .uvc UV offset: [seconds, u, v]
  | { kind: "scroll"; mode: number; set: number; interval: number; phase: number; speed: number[]; end: number[] }
  | { kind: "rect"; set: number; mode: number; rect: number[]; velocity: number[]; relative: number }
  | {
      kind: "flip"; images: number[]; randomImage: boolean; order: number; cols: number; rows: number;
      interval: number; cells: number[]; direction: number; start: number; loop: boolean; set: number;
      rects: number[][];
    };
interface UvTarget {
  modules: UvModule[];
  maps: { tex: THREE.Texture; set: number }[];
  mats: THREE.MeshStandardMaterial[];
  images: THREE.Texture[];
  seed: number;
  rate: number;
}
const MAP_SLOTS = ["map", "aoMap", "normalMap", "specularColorMap", "alphaMap", "emissiveMap"] as const;

// Deterministic stand-in for the engine's random picks (flipbook direction 2 / random images).
const hash = (a: number, b: number) => {
  let h = (a * 374761393 + b * 668265263) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};

/** UV modules (node extras.uv; stage3d.py uv_modules): clone the materials/textures under each node. */
const collectUvs = async (gltf: GLTF): Promise<UvTarget[]> => {
  const out: UvTarget[] = [];
  const pending: Promise<void>[] = [];
  const nodes: THREE.Object3D[] = [];
  gltf.scene.traverse((o) => {
    if ((o.userData.uv as UvModule[] | undefined)?.length) nodes.push(o);
  });
  for (const o of nodes) {
    const target: UvTarget = {
      modules: o.userData.uv, maps: [], mats: [], images: [], seed: o.id, rate: o.userData.rate ?? 1,
    };
    let imageIndices: number[] | undefined;
    o.traverse((c) => {
      if (c.userData.images) imageIndices = c.userData.images;
      const mesh = c as THREE.Mesh;
      if (!mesh.isMesh) return;
      const clone = (m: THREE.Material) => {
        const copy = (m.userData.owned ? m : m.clone()) as THREE.MeshPhysicalMaterial;
        copy.onBeforeCompile = m.onBeforeCompile;
        copy.userData.owned = true;
        for (const slot of MAP_SLOTS) {
          const tex = copy[slot] as THREE.Texture | null | undefined;
          if (!tex) continue;
          const own = tex.clone();
          own.wrapS = own.wrapT = THREE.RepeatWrapping;
          (copy[slot] as THREE.Texture) = own;
          target.maps.push({ tex: own, set: own.channel });
        }
        target.mats.push(copy);
        return copy;
      };
      mesh.material = Array.isArray(mesh.material) ? mesh.material.map(clone) : clone(mesh.material);
    });
    if (imageIndices) // loaded after the loop: every node is walked synchronously, before collectScreen moves any
      pending.push(
        Promise.all(imageIndices.map((i) => gltf.parser.getDependency("texture", i) as Promise<THREE.Texture>)).then(
          (images) => void (target.images = images),
        ),
      );
    out.push(target);
  }
  await Promise.all(pending);
  return out;
};

/** UV transform per set at `frames` (60 fps): [offsetU, offsetV, repeatU, repeatV] plus a flipbook image. */
const applyUv = (target: UvTarget, frames: number) => {
  const xf = [0, 1, 2].map(() => [0, 0, 1, 1]);
  const sets = (set: number) => (set >= 0 && set <= 2 ? [set] : [0, 1, 2]);
  let image = -1;
  for (const m of target.modules) {
    if (m.kind === "rect") {
      let [u0, v0, u1, v1] = m.rect;
      if (m.relative & 1) u1 += u0;
      if (m.relative & 2) v1 += v0;
      const du = m.mode === 1 ? m.velocity[0] * frames : 0;
      const dv = m.mode === 1 ? m.velocity[1] * frames : 0;
      for (const i of sets(m.set)) xf[i] = [u0 + du, v0 + dv, u1 - u0, v1 - v0];
    } else if (m.kind === "keys") {
      const [du, dv] = sampleTint({ keys: m.keys, loop: m.loop }, frames / 60);
      for (const i of sets(m.set)) {
        xf[i][0] += du;
        xf[i][1] += dv;
      }
    } else if (m.kind === "flip") {
      const count = Math.max(m.cells[1] - m.cells[0] + 1, 1);
      // a negative start cell means "random": give each node its own phase so they don't switch in sync
      const phase = m.start < 0 ? hash(target.seed, 7) * count * Math.max(m.interval, 1) : 0;
      const step = Math.floor((frames + phase) / Math.max(m.interval, 1));
      const n = step + Math.max(m.start, 0);
      let cell =
        m.direction === 2 ? Math.floor(hash(target.seed, step) * count)
        : m.loop ? n % count : Math.min(n, count - 1);
      if (m.direction === 1) cell = count - 1 - cell;
      cell += m.cells[0];
      let rect: number[];
      if (m.order === 2 && m.rects.length) rect = m.rects[Math.min(cell, m.rects.length - 1)];
      else {
        const col = m.order === 1 ? Math.floor(cell / m.rows) : cell % m.cols;
        const row = m.order === 1 ? cell % m.rows : Math.floor(cell / m.cols);
        rect = [col / m.cols, row / m.rows, (col + 1) / m.cols, (row + 1) / m.rows];
      }
      for (const i of sets(m.set)) xf[i] = [rect[0], rect[1], rect[2] - rect[0], rect[3] - rect[1]];
      if (target.images.length) {
        const cycle = Math.floor(n / count);
        const span = Math.max(m.images[1] - m.images[0] + 1, 1);
        image = m.randomImage
          ? Math.floor(hash(target.seed + 1, cycle) * target.images.length)
          : (m.images[0] + (cycle % span)) % target.images.length;
      }
    } else {
      let du = 0, dv = 0;
      if (m.mode === 0 || m.mode === 3) [du, dv] = m.speed;
      else if (m.mode === 1) {
        const k = m.interval > 0 ? Math.floor(frames / (m.interval + 1)) : frames;
        [du, dv] = [m.speed[0] * k, m.speed[1] * k];
      } else if (m.mode === 2) {
        const a = Math.sin(((360 / Math.max(m.interval, 1e-3)) * frames + m.phase) * (Math.PI / 180));
        du = (m.end[0] + m.speed[0]) / 2 + ((m.end[0] - m.speed[0]) / 2) * a;
        dv = (m.end[1] + m.speed[1]) / 2 + ((m.end[1] - m.speed[1]) / 2) * a;
      } else if (m.mode === 4) [du, dv] = [m.speed[0] * frames, m.speed[1] * frames];
      for (const i of sets(m.set)) {
        xf[i][0] += du;
        xf[i][1] += dv;
      }
    }
  }
  for (const { tex, set } of target.maps) {
    const [ou, ov, ru, rv] = xf[set >= 0 && set <= 2 ? set : 0];
    tex.offset.set(ou, ov);
    tex.repeat.set(ru, rv);
  }
  if (image >= 0)
    for (const m of target.mats) {
      const img = target.images[image];
      if (m.map && img && m.map.source !== img.source) {
        m.map.source = img.source;
        m.map.needsUpdate = true;
      }
    }
};

const sampleTint = ({ keys, loop }: Tint, time: number): number[] => {
  const end = keys[keys.length - 1][0];
  const t = loop && end > 0 ? time % end : time;
  if (t <= keys[0][0]) return keys[0].slice(1);
  for (let i = 1; i < keys.length; i++) {
    const [t0, ...a] = keys[i - 1];
    const [t1, ...b] = keys[i];
    if (t <= t1) return a.map((v, j) => v + (b[j] - v) * (t1 > t0 ? (t - t0) / (t1 - t0) : 1));
  }
  return keys[keys.length - 1].slice(1);
};

/**
 * Per-material shader tweaks: the game multiplies its uv1 "_oc" layer into the whole colour, but three's aoMap
 * only darkens indirect light, so direct diffuse is multiplied too; stage fog is linear and capped at
 * userData.fogMax (set by applyEnvironment before the first render).
 */
const patchShader = (m: THREE.Material) => {
  m.onBeforeCompile = (shader) => {
    if ((m as THREE.MeshStandardMaterial).aoMap)
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <aomap_fragment>",
        "#include <aomap_fragment>\n#ifdef USE_AOMAP\nreflectedLight.directDiffuse *= ambientOcclusion;\n#endif",
      );
    if (m.userData.fogMax !== undefined) {
      shader.uniforms.fogMax = { value: m.userData.fogMax };
      shader.fragmentShader = shader.fragmentShader
        .replace("#include <fog_pars_fragment>", "#include <fog_pars_fragment>\nuniform float fogMax;")
        .replace(
          "#include <fog_fragment>",
          `#ifdef USE_FOG
            float fogFactor = clamp((vFogDepth - fogNear) / (fogFar - fogNear), 0.0, 1.0) * fogMax;
            gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor, fogFactor);
          #endif`,
        );
    }
  };
};

const fixMaterials = (gltf: GLTF) =>
  gltf.scene.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;
    for (const m of [mesh.material].flat() as THREE.Material[]) {
      if (m.userData.additive) {
        m.blending = THREE.AdditiveBlending;
        m.depthWrite = false;
      }
      patchShader(m);
    }
  });

/**
 * Renders a stage like the game: the background (st_*.glb) through its own (animated) camera, then the notes
 * field (nf_*.glb) on top through the play camera. All baked clips loop. Orbiting moves the play camera and
 * applies the same offset to the background camera.
 */
const StageViewer = ({ background, lane }: { background?: string; lane?: string }) => {
  const mount = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const el = mount.current;
    if (!el) return;
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.autoClear = false;
    renderer.setClearColor(0x101018);
    el.appendChild(renderer.domElement);

    const bgScene = makeScene();
    const laneScene = makeScene();
    // background through the composer (stage filters live in the st scene), the notes field drawn on top
    const composer = new EffectComposer(
      renderer,
      new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: 4 }),
    );
    let updateFilters = (_time: number) => {};
    const camera = new THREE.PerspectiveCamera(27.5, 16 / 9, 1, 1500);
    camera.position.copy(EYE);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.copy(TARGET);
    controls.update();
    camera.updateMatrixWorld();
    const defaultView = camera.matrixWorld.clone();
    const defaultInverse = defaultView.clone().invert();
    const bgView = camera.clone(); // background camera: stage FOV/near/far
    // Sgl2DPrimitive layers in 1920x1080 pixels around the screen centre: backdrop, 3D background, front
    const screenView = new THREE.OrthographicCamera(-960, 960, 540, -540, -1e5, 1e5);
    const backdrop = new THREE.Scene();
    const front = new THREE.Scene();
    composer.addPass(new RenderPass(backdrop, screenView));
    for (const [scene, view] of [[bgScene, bgView], [front, screenView]] as const) {
      const pass = new RenderPass(scene, view);
      pass.clear = false;
      composer.addPass(pass);
    }
    composer.addPass(new OutputPass());
    let stageCamera: THREE.Object3D | null = null;
    const mixers: THREE.AnimationMixer[] = [];
    const tints: TintTarget[] = [];
    const uvs: UvTarget[] = [];
    const emitters: Emitter[] = [];
    let elapsed = 0;
    const clock = new THREE.Clock();
    const play = (gltf: GLTF) => {
      if (!gltf.animations.length) return;
      const mixer = new THREE.AnimationMixer(gltf.scene);
      gltf.animations.forEach((clip) => mixer.clipAction(clip).play());
      mixers.push(mixer);
    };

    const loader = new GLTFLoader();
    const load = (url: string, onLoad: (gltf: GLTF) => void) =>
      loader.load(url, onLoad, undefined, () => setError(`Failed to load ${url}`));
    if (background)
      load(background, (gltf) => {
        fixMaterials(gltf);
        applyEnvironment(gltf, bgScene);
        updateFilters = addFilters(composer, (gltf.scene.userData as StageExtras).filters ?? []);
        tints.push(...collectTints(gltf));
        collectUvs(gltf).then((u) => uvs.push(...u));
        collectEmitters(gltf).then((e) => emitters.push(...e));
        collectScreen(gltf, backdrop, front); // after the collectors above have walked the scene
        bgScene.add(gltf.scene);
        play(gltf);
        const cam = gltf.cameras[0] as THREE.PerspectiveCamera | undefined;
        if (!cam) return;
        bgView.fov = cam.fov;
        bgView.near = cam.near;
        bgView.far = cam.far;
        bgView.updateProjectionMatrix();
        stageCamera = cam;
      });
    if (lane)
      load(lane, (gltf) => {
        fixMaterials(gltf);
        applyEnvironment(gltf, laneScene);
        tints.push(...collectTints(gltf));
        collectUvs(gltf).then((u) => uvs.push(...u));
        collectEmitters(gltf).then((e) => emitters.push(...e));
        laneScene.add(gltf.scene);
        play(gltf);
      });

    const resize = () => {
      const w = el.clientWidth;
      const h = Math.round((w * 9) / 16);
      renderer.setSize(w, h);
      composer.setPixelRatio(window.devicePixelRatio);
      composer.setSize(w, h);
      for (const c of [camera, bgView]) {
        c.aspect = w / h;
        c.updateProjectionMatrix();
      }
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(el);

    const view = new THREE.Matrix4();
    renderer.setAnimationLoop(() => {
      const dt = clock.getDelta();
      elapsed += dt;
      mixers.forEach((m) => m.update(dt));
      for (const target of uvs) applyUv(target, elapsed * 60 * target.rate);
      // point sprites: pixels per world unit at distance 1 for the background camera
      const pxScale = renderer.domElement.height / (2 * Math.tan((bgView.fov * Math.PI) / 360));
      for (const e of emitters) {
        e.setScale(pxScale);
        e.step(Math.min(dt * 60, 4));
      }
      for (const { tint, rate, mats } of tints) {
        const [r, g, b, a] = sampleTint(tint, elapsed * rate);
        for (const { m, color, opacity } of mats) {
          m.color.setRGB(color.r * r, color.g * g, color.b * b);
          m.opacity = opacity * a;
        }
      }
      bgScene.updateMatrixWorld();
      camera.updateMatrixWorld();
      view.multiplyMatrices(camera.matrixWorld, defaultInverse); // orbit offset from the default play view
      view.multiply(stageCamera ? stageCamera.matrixWorld : defaultView);
      view.decompose(bgView.position, bgView.quaternion, bgView.scale);
      updateFilters(elapsed);
      composer.render();
      renderer.clearDepth();
      renderer.render(laneScene, camera);
    });

    return () => {
      renderer.setAnimationLoop(null);
      observer.disconnect();
      controls.dispose();
      for (const scene of [bgScene, laneScene])
        scene.traverse((o) => {
          const mesh = o as THREE.Mesh;
          if (!mesh.isMesh) return;
          mesh.geometry.dispose();
          for (const m of [mesh.material].flat() as THREE.MeshStandardMaterial[]) {
            m.map?.dispose();
            m.normalMap?.dispose();
            m.aoMap?.dispose();
            m.dispose();
          }
        });
      composer.dispose();
      renderer.dispose();
      el.removeChild(renderer.domElement);
    };
  }, [background, lane]);

  return (
    <Box sx={{ maxWidth: 1200 }}>
      <div ref={mount} style={{ width: "100%" }} />
      {error && <Typography color="error">{error}</Typography>}
    </Box>
  );
};

export default StageViewer;
