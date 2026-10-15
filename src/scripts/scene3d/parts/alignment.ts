import * as THREE from 'three';
import { COLORS, MATERIALS } from '../materials';
import { DEG, smoothstep, type Piece } from '../types';
import { createWheel } from './wheel';

function createLaser(length: number) {
  const make = (width: number, opacity: number) =>
    new THREE.Mesh(
      new THREE.PlaneGeometry(width, length),
      new THREE.MeshBasicMaterial({
        color: COLORS.laserRed.clone(),
        transparent: true,
        opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
  const beam = make(0.018, 0.95);
  const glow = make(0.12, 0.1);
  const group = new THREE.Group();
  group.add(glow, beam);
  const setColor = (color: THREE.Color) => {
    beam.material.color.copy(color);
    glow.material.color.copy(color);
  };
  return { group, setColor };
}

// Eje delantero visto desde arriba: las llantas llegan abiertas y quedan derechas.
export function createAlignmentAxle(fontFamily: string): Piece {
  const object = new THREE.Group();
  const left = createWheel({ darkRim: true, fontFamily });
  const right = createWheel({ darkRim: true, fontFamily });
  [left, right].forEach((wheel, i) => {
    wheel.root.scale.setScalar(0.5);
    wheel.root.position.x = i ? 1.15 : -1.15;
    object.add(wheel.root);
  });

  const tieRod = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 2, 20), MATERIALS.rimDark);
  tieRod.rotation.z = Math.PI / 2;
  object.add(tieRod);

  const lasers = [createLaser(3.4), createLaser(3.4)];
  lasers.forEach(({ group }) => {
    group.rotation.x = -Math.PI / 2;
    object.add(group);
  });

  const floor = new THREE.GridHelper(6, 12, 0x2c3f7a, 0x1a2552);
  floor.position.y = -0.52;
  object.add(floor);
  object.rotation.x = 0.85;

  const color = new THREE.Color();
  const update = (time: number, delta: number) => {
    const phase = (time % 6) / 6;
    const progress = phase < 0.3 ? 0 : phase < 0.62 ? smoothstep((phase - 0.3) / 0.32) : 1;
    const toe = (1 - progress) * 10 * DEG;
    left.root.rotation.y = -Math.PI / 2 - toe;
    right.root.rotation.y = Math.PI / 2 + toe;
    left.spinner.rotation.z -= delta * 1.2;
    right.spinner.rotation.z -= delta * 1.2;

    const [laserLeft, laserRight] = lasers as [
      ReturnType<typeof createLaser>,
      ReturnType<typeof createLaser>,
    ];
    laserLeft.group.rotation.z = toe;
    laserRight.group.rotation.z = -toe;
    laserLeft.group.position.set(-1.15 - Math.sin(toe) * 1.7, 0.36, -1.7);
    laserRight.group.position.set(1.15 + Math.sin(toe) * 1.7, 0.36, -1.7);
    color.copy(COLORS.laserRed).lerp(COLORS.laserGreen, progress);
    laserLeft.setColor(color);
    laserRight.setColor(color);
  };

  return { object, update, excludeFromFit: [floor, ...lasers.map((l) => l.group)] };
}
