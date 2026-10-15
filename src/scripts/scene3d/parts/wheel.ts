import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { MATERIALS } from '../materials';

export interface Wheel {
  root: THREE.Group;
  spinner: THREE.Group; // lo que rueda
  weight: THREE.Mesh | null;
}

interface WheelOptions {
  sidewallText?: string;
  darkRim?: boolean;
  withWeight?: boolean;
  fontFamily?: string;
}

const HALF_WIDTH = 0.34;

function createSidewallTexture(text: string, fontFamily: string): THREE.CanvasTexture {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.translate(size / 2, size / 2);
  ctx.fillStyle = '#7f838a';
  ctx.font = `700 46px ${fontFamily}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const radius = (size / 2) * (0.835 / 0.95);
  const chars = [...text];
  const step = (Math.PI * 2) / chars.length;
  chars.forEach((char, i) => {
    ctx.save();
    ctx.rotate(i * step);
    ctx.translate(0, -radius);
    ctx.fillText(char, 0, 0);
    ctx.restore();
  });

  ctx.strokeStyle = 'rgba(127,131,138,.5)';
  ctx.lineWidth = 3;
  for (const r of [0.905, 0.765]) {
    ctx.beginPath();
    ctx.arc(0, 0, (size / 2) * (r / 0.95), 0, Math.PI * 2);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

function createTire(): THREE.Mesh {
  const W = HALF_WIDTH;
  const profile: [number, number][] = [
    [0.64, -W + 0.03],
    [0.7, -W],
    [0.8, -W - 0.008],
    [0.9, -W + 0.004],
    [0.955, -W + 0.03],
    [0.985, -W + 0.07],
    [0.995, -W + 0.12],
    [0.998, 0],
    [0.995, W - 0.12],
    [0.985, W - 0.07],
    [0.955, W - 0.03],
    [0.9, W - 0.004],
    [0.8, W + 0.008],
    [0.7, W],
    [0.64, W - 0.03],
  ];
  const geometry = new THREE.LatheGeometry(
    profile.map(([r, y]) => new THREE.Vector2(r, y)),
    128,
  );
  geometry.rotateX(Math.PI / 2);
  return new THREE.Mesh(geometry, MATERIALS.rubber);
}

function createTread(): THREE.InstancedMesh {
  const blocksPerRow = 72;
  const tread = new THREE.InstancedMesh(
    new RoundedBoxGeometry(0.075, 0.05, 0.2, 2, 0.016),
    MATERIALS.tread,
    blocksPerRow * 2,
  );
  const matrix = new THREE.Matrix4();
  const rotation = new THREE.Quaternion();
  const tilt = new THREE.Quaternion();
  const euler = new THREE.Euler();
  const position = new THREE.Vector3();
  const scale = new THREE.Vector3(1, 1, 1);
  const xAxis = new THREE.Vector3(1, 0, 0);
  let index = 0;

  for (let i = 0; i < blocksPerRow; i++) {
    for (const side of [-1, 1]) {
      const angle = (i / blocksPerRow) * Math.PI * 2 + (side > 0 ? Math.PI / blocksPerRow : 0);
      position.set(Math.cos(angle) * 0.99, Math.sin(angle) * 0.99, side * 0.135);
      rotation.setFromEuler(euler.set(0, 0, angle + Math.PI / 2));
      rotation.multiply(tilt.setFromAxisAngle(xAxis, side * 0.5));
      tread.setMatrixAt(index++, matrix.compose(position, rotation, scale));
    }
  }
  return tread;
}

function createSidewallLettering(text: string, fontFamily: string): THREE.Mesh[] {
  const material = new THREE.MeshStandardMaterial({
    map: createSidewallTexture(text, fontFamily),
    transparent: true,
    roughness: 0.7,
    metalness: 0,
    depthWrite: false,
  });
  const ring = new THREE.RingGeometry(0.66, 0.95, 128, 1);
  const uv = ring.attributes.uv!;
  const position = ring.attributes.position!;
  for (let i = 0; i < uv.count; i++) {
    uv.setXY(i, position.getX(i) / 1.9 + 0.5, position.getY(i) / 1.9 + 0.5);
  }
  const front = new THREE.Mesh(ring, material);
  front.position.z = HALF_WIDTH + 0.012;
  const back = front.clone();
  back.rotation.y = Math.PI;
  back.position.z = -HALF_WIDTH - 0.012;
  return [front, back];
}

function createRimFace(material: THREE.Material): THREE.Mesh {
  const face = new THREE.Shape();
  face.absarc(0, 0, 0.635, 0, Math.PI * 2, false);
  const spokes = 5;
  const inner = 0.24;
  const outer = 0.56;
  for (let i = 0; i < spokes; i++) {
    const a0 = (i / spokes) * Math.PI * 2 + 0.24;
    const a1 = ((i + 1) / spokes) * Math.PI * 2 - 0.24;
    const hole = new THREE.Path();
    hole.moveTo(Math.cos(a0 + 0.1) * inner, Math.sin(a0 + 0.1) * inner);
    hole.lineTo(Math.cos(a0) * outer, Math.sin(a0) * outer);
    hole.absarc(0, 0, outer, a0, a1, false);
    hole.lineTo(Math.cos(a1 - 0.1) * inner, Math.sin(a1 - 0.1) * inner);
    hole.absarc(0, 0, inner, a1 - 0.1, a0 + 0.1, true);
    face.holes.push(hole);
  }
  const hub = new THREE.Path();
  hub.absarc(0, 0, 0.075, 0, Math.PI * 2, true);
  face.holes.push(hub);

  const mesh = new THREE.Mesh(
    new THREE.ExtrudeGeometry(face, {
      depth: 0.05,
      bevelEnabled: true,
      bevelThickness: 0.025,
      bevelSize: 0.018,
      bevelSegments: 4,
      curveSegments: 48,
    }),
    material,
  );
  mesh.position.z = 0.16;
  return mesh;
}

function createBrakeDisc(): THREE.Mesh {
  const shape = new THREE.Shape();
  shape.absarc(0, 0, 0.5, 0, Math.PI * 2, false);
  const center = new THREE.Path();
  center.absarc(0, 0, 0.2, 0, Math.PI * 2, true);
  shape.holes.push(center);
  for (let i = 0; i < 24; i++) {
    const angle = (i / 24) * Math.PI * 2;
    const radius = i % 2 ? 0.34 : 0.41;
    const vent = new THREE.Path();
    vent.absarc(Math.cos(angle) * radius, Math.sin(angle) * radius, 0.016, 0, Math.PI * 2, true);
    shape.holes.push(vent);
  }
  const disc = new THREE.Mesh(
    new THREE.ExtrudeGeometry(shape, { depth: 0.07, bevelEnabled: false, curveSegments: 48 }),
    MATERIALS.disc,
  );
  disc.position.z = -0.02;
  return disc;
}

export function createWheel({
  sidewallText = 'LUEVANO · ALINEACIÓN Y BALANCEO · CHIHUAHUA · ',
  darkRim = false,
  withWeight = false,
  fontFamily = 'sans-serif',
}: WheelOptions = {}): Wheel {
  const root = new THREE.Group();
  const spinner = new THREE.Group();
  root.add(spinner);

  const rimMaterial = darkRim ? MATERIALS.rimDark : MATERIALS.rim;

  const barrel = new THREE.Mesh(
    new THREE.CylinderGeometry(0.64, 0.64, 0.56, 96, 1, true),
    MATERIALS.rimBarrel,
  );
  barrel.rotation.x = Math.PI / 2;

  const lip = new THREE.Mesh(new THREE.TorusGeometry(0.635, 0.022, 16, 128), rimMaterial);
  lip.position.z = 0.235;

  const cap = new THREE.Mesh(
    new THREE.CylinderGeometry(0.07, 0.075, 0.05, 48).rotateX(Math.PI / 2),
    MATERIALS.accent,
  );
  cap.position.z = 0.26;

  spinner.add(
    createTire(),
    createTread(),
    ...createSidewallLettering(sidewallText, fontFamily),
    barrel,
    createRimFace(rimMaterial),
    lip,
    cap,
    createBrakeDisc(),
  );

  const lugGeometry = new THREE.CylinderGeometry(0.028, 0.028, 0.06, 6).rotateX(Math.PI / 2);
  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2 + Math.PI / 5;
    const lug = new THREE.Mesh(lugGeometry, MATERIALS.chrome);
    lug.position.set(Math.cos(angle) * 0.15, Math.sin(angle) * 0.15, 0.255);
    spinner.add(lug);
  }

  const caliper = new THREE.Mesh(new RoundedBoxGeometry(0.2, 0.36, 0.2, 3, 0.05), MATERIALS.accent);
  caliper.position.set(0.37, 0.24, 0.02);
  caliper.rotation.z = -0.58;
  root.add(caliper);

  let weight: THREE.Mesh | null = null;
  if (withWeight) {
    weight = new THREE.Mesh(new RoundedBoxGeometry(0.1, 0.05, 0.05, 2, 0.012), MATERIALS.chrome);
    weight.position.set(0, 0.6, 0.22);
    spinner.add(weight);
  }

  return { root, spinner, weight };
}
