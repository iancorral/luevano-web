// Escenario 3D de servicios: un canvas dentro del panel, una pieza por servicio.
// La pieza actual sale primero y luego entra la nueva (sin traslape).
// Solo dibuja mientras el panel está en pantalla.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import type { ServicePiece } from '@/data/services';
import type { Piece } from './types';
import { createAlignmentAxle } from './parts/alignment';
import { createWheelBalancer } from './parts/balancer';
import { createBrake, createSteeringWheel, createSuspension, createWrench } from './parts/components';

interface StageOptions {
  container: HTMLElement;
  getActive: () => ServicePiece;
  reducedMotion: boolean;
  fontFamily: string;
}

interface Slot {
  piece: Piece;
  holder: THREE.Group;
  baseScale: number;
  presence: number;
}

const FOV = 30;
const FILL = 1.06; // margen alrededor de la pieza (1 = toca los bordes)

// Distancia del origen al vértice más lejano: la pieza cabe en cualquier ángulo de giro.
function measureRadius(piece: Piece): number {
  const excluded = new Set(piece.excludeFromFit);
  const vertex = new THREE.Vector3();
  let radius = 0;
  piece.object.updateMatrixWorld(true);

  const visit = (object: THREE.Object3D) => {
    if (excluded.has(object)) return;
    if (object instanceof THREE.Mesh && !(object instanceof THREE.InstancedMesh)) {
      const position = (object.geometry as THREE.BufferGeometry).attributes.position;
      if (position) {
        for (let i = 0; i < position.count; i++) {
          vertex.fromBufferAttribute(position, i).applyMatrix4(object.matrixWorld);
          radius = Math.max(radius, vertex.length());
        }
      }
    }
    object.children.forEach(visit);
  };
  visit(piece.object);
  return radius || 1;
}

export function mountServiceStage({ container, getActive, reducedMotion, fontFamily }: StageOptions) {
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  container.append(canvas);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();

  const keyLight = new THREE.DirectionalLight(0xffffff, 1.6);
  keyLight.position.set(3, 4, 5);
  const rimLight = new THREE.DirectionalLight(0x9dbbff, 2.2);
  rimLight.position.set(-4, 1.5, -3);
  scene.add(keyLight, rimLight);

  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 50);

  const pieces: Record<ServicePiece, Piece> = {
    alignment: createAlignmentAxle(fontFamily),
    suspension: createSuspension(),
    balancing: createWheelBalancer(fontFamily),
    steering: createSteeringWheel(),
    brakes: createBrake(),
    repairs: createWrench(),
  };

  const slots = new Map<ServicePiece, Slot>();
  for (const [key, piece] of Object.entries(pieces) as [ServicePiece, Piece][]) {
    piece.update(0, 0);
    const holder = new THREE.Group();
    holder.add(piece.object);
    holder.visible = false;
    scene.add(holder);
    slots.set(key, { piece, holder, baseScale: 1 / measureRadius(piece), presence: 0 });
  }

  function resize() {
    const width = container.clientWidth;
    const height = container.clientHeight;
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    // Encuadra una esfera de radio 1 en el lado más angosto.
    const vertical = (FOV * Math.PI) / 180;
    const horizontal = 2 * Math.atan(Math.tan(vertical / 2) * camera.aspect);
    camera.position.set(0, 0, (1 / Math.sin(Math.min(vertical, horizontal) / 2)) * FILL);
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(container);
  resize();

  let shown = getActive();
  let elapsed = 0;
  let last = performance.now();

  function render(now: number) {
    const delta = Math.min((now - last) / 1000, 0.05);
    last = now;
    elapsed += delta;

    const target = getActive();
    const speed = reducedMotion ? 1 : Math.min(1, delta * 9);
    const current = slots.get(shown)!;
    if (target !== shown) {
      current.presence += (0 - current.presence) * speed;
      if (current.presence < 0.03) {
        current.presence = 0;
        shown = target;
      }
    } else {
      current.presence += (1 - current.presence) * speed;
    }

    const time = reducedMotion ? 5 : elapsed;
    const step = reducedMotion ? 0 : delta;
    for (const slot of slots.values()) {
      const k = slot.presence;
      slot.holder.visible = k > 0.01;
      if (!slot.holder.visible) continue;
      slot.holder.scale.setScalar(slot.baseScale * (0.75 + 0.25 * k));
      slot.holder.position.y = (1 - k) * -0.35;
      slot.piece.update(time, step);
    }
    renderer.render(scene, camera);
  }

  let frameId = 0;
  let onScreen = false;
  const loop = (now: number) => {
    render(now);
    frameId = requestAnimationFrame(loop);
  };
  const sync = () => {
    const shouldRun = onScreen && !document.hidden;
    if (shouldRun && !frameId) {
      last = performance.now();
      frameId = requestAnimationFrame(loop);
    } else if (!shouldRun && frameId) {
      cancelAnimationFrame(frameId);
      frameId = 0;
    }
  };

  new IntersectionObserver(([entry]) => {
    onScreen = entry?.isIntersecting ?? false;
    sync();
  }).observe(container);
  document.addEventListener('visibilitychange', sync);
}
