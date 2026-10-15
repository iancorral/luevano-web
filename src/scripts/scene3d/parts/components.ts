import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { MATERIALS } from '../materials';
import type { Piece } from '../types';

class Helix extends THREE.Curve<THREE.Vector3> {
  constructor() {
    super();
  }

  override getPoint(t: number, target = new THREE.Vector3()): THREE.Vector3 {
    const angle = t * Math.PI * 2 * 6.5;
    return target.set(Math.cos(angle) * 0.36, -0.95 + t * 1.9, Math.sin(angle) * 0.36);
  }
}

export function createSuspension(): Piece {
  const pose = new THREE.Group();
  const strut = new THREE.Group();
  pose.add(strut);

  const spring = new THREE.Mesh(new THREE.TubeGeometry(new Helix(), 420, 0.055, 16, false), MATERIALS.accent);
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 1.15, 48), MATERIALS.matteBlack);
  body.position.y = -0.38;
  const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1, 32), MATERIALS.chrome);
  rod.position.y = 0.55;
  const topPlate = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 0.05, 64), MATERIALS.rimDark);
  topPlate.position.y = 1;
  const bottomPlate = topPlate.clone();
  bottomPlate.position.y = -0.98;
  const eye = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.045, 16, 48), MATERIALS.matteBlack);
  eye.position.y = -1.08;

  strut.add(spring, body, rod, topPlate, bottomPlate, eye);
  pose.rotation.set(0.15, 0, 0.3);

  return {
    object: pose,
    update: (time, delta) => {
      strut.rotation.y += delta * 0.35;
      spring.scale.y = 1 - Math.abs(Math.sin(time * 0.9)) * 0.06;
    },
  };
}

export function createSteeringWheel(): Piece {
  const pose = new THREE.Group();
  const wheel = new THREE.Group();
  pose.add(wheel);

  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.82, 0.1, 24, 128), MATERIALS.matteBlack);
  const stitching = new THREE.Mesh(
    new THREE.TorusGeometry(0.82, 0.103, 8, 128, Math.PI * 0.28),
    MATERIALS.accent,
  );
  stitching.rotation.z = Math.PI / 2 - Math.PI * 0.14;
  const hub = new THREE.Mesh(
    new THREE.CylinderGeometry(0.26, 0.3, 0.16, 48).rotateX(Math.PI / 2),
    MATERIALS.matteBlack,
  );
  const badge = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.12, 0.02, 48).rotateX(Math.PI / 2),
    MATERIALS.accent,
  );
  badge.position.z = 0.09;
  wheel.add(rim, stitching, hub, badge);

  const lowerSpoke = new THREE.Mesh(new RoundedBoxGeometry(0.22, 0.6, 0.08, 2, 0.03), MATERIALS.rimDark);
  lowerSpoke.position.set(0, -0.52, 0);
  wheel.add(lowerSpoke);
  for (const side of [-1, 1]) {
    const spoke = new THREE.Mesh(new RoundedBoxGeometry(0.6, 0.18, 0.08, 2, 0.03), MATERIALS.rimDark);
    spoke.position.set(side * 0.87 * 0.52, -0.06, 0);
    spoke.rotation.z = side > 0 ? -0.22 : 0.22;
    wheel.add(spoke);
  }
  pose.rotation.x = -0.35;

  return {
    object: pose,
    update: (time) => {
      wheel.rotation.z = Math.sin(time * 0.6) * 0.3;
    },
  };
}

export function createBrake(): Piece {
  const pose = new THREE.Group();
  const shape = new THREE.Shape();
  shape.absarc(0, 0, 0.9, 0, Math.PI * 2, false);
  const center = new THREE.Path();
  center.absarc(0, 0, 0.36, 0, Math.PI * 2, true);
  shape.holes.push(center);
  for (let i = 0; i < 30; i++) {
    const angle = (i / 30) * Math.PI * 2;
    const radius = [0.55, 0.66, 0.77][i % 3]!;
    const hole = new THREE.Path();
    hole.absarc(Math.cos(angle) * radius, Math.sin(angle) * radius, 0.028, 0, Math.PI * 2, true);
    shape.holes.push(hole);
  }
  const disc = new THREE.Mesh(
    new THREE.ExtrudeGeometry(shape, {
      depth: 0.12,
      bevelEnabled: true,
      bevelThickness: 0.01,
      bevelSize: 0.01,
      curveSegments: 64,
    }),
    MATERIALS.disc,
  );
  disc.position.z = -0.06;
  const hat = new THREE.Mesh(
    new THREE.CylinderGeometry(0.38, 0.38, 0.22, 64).rotateX(Math.PI / 2),
    MATERIALS.rimDark,
  );
  hat.position.z = 0.08;

  const spinner = new THREE.Group();
  spinner.add(disc, hat);
  const studGeometry = new THREE.CylinderGeometry(0.035, 0.035, 0.14, 12).rotateX(Math.PI / 2);
  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2;
    const stud = new THREE.Mesh(studGeometry, MATERIALS.chrome);
    stud.position.set(Math.cos(angle) * 0.2, Math.sin(angle) * 0.2, 0.22);
    spinner.add(stud);
  }

  const caliper = new THREE.Mesh(new RoundedBoxGeometry(0.38, 0.7, 0.36, 4, 0.08), MATERIALS.accent);
  caliper.position.set(0.62, 0.42, 0);
  caliper.rotation.z = -0.6;

  pose.add(spinner, caliper);
  pose.rotation.set(0.12, -0.5, 0);

  return {
    object: pose,
    update: (_time, delta) => {
      spinner.rotation.z -= delta * 0.6;
    },
  };
}

export function createWrench(): Piece {
  const shape = new THREE.Shape();
  const headX = -1.2;
  const headRadius = 0.29;
  shape.moveTo(-0.95, -0.09);
  shape.lineTo(0.95, -0.09);
  shape.absarc(1.12, 0, 0.24, Math.PI + 0.38, Math.PI - 0.38, false);
  shape.lineTo(-0.95, 0.09);
  shape.absarc(headX, 0, headRadius, 0.32, Math.PI - 0.62, false);
  shape.lineTo(headX - 0.3, 0.115);
  shape.lineTo(headX - 0.02, 0.115);
  shape.absarc(headX - 0.02, 0, 0.115, Math.PI / 2, -Math.PI / 2, true);
  shape.lineTo(headX - 0.3, -0.115);
  shape.absarc(headX, 0, headRadius, Math.PI + 0.62, Math.PI * 2 - 0.32, false);
  shape.lineTo(-0.95, -0.09);
  const ring = new THREE.Path();
  ring.absarc(1.12, 0, 0.13, 0, Math.PI * 2, true);
  shape.holes.push(ring);

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.08,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.025,
    bevelSegments: 4,
    curveSegments: 48,
  });
  geometry.center();
  const material = MATERIALS.chrome.clone();
  material.roughness = 0.16;

  const spinner = new THREE.Group();
  const nut = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.2, 0.16, 6).rotateX(Math.PI / 2),
    MATERIALS.accent,
  );
  nut.position.set(0.7, -0.55, 0.1);
  spinner.add(new THREE.Mesh(geometry, material), nut);

  const pose = new THREE.Group();
  pose.add(spinner);
  pose.rotation.set(0.45, -0.25, 0.5);

  return {
    object: pose,
    update: (_time, delta) => {
      spinner.rotation.y += delta * 0.3;
      nut.rotation.z -= delta * 0.6;
    },
  };
}
