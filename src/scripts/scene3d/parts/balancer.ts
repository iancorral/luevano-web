import * as THREE from 'three';
import { MATERIALS } from '../materials';
import { smoothstep, type Piece } from '../types';
import { createWheel } from './wheel';

// La llanta en la balanceadora: tiembla, se le pone la pesa y queda pareja.
export function createWheelBalancer(fontFamily: string): Piece {
  const object = new THREE.Group();
  const wheel = createWheel({ withWeight: true, fontFamily });

  const shaft = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.06, 1.6, 24).rotateX(Math.PI / 2),
    MATERIALS.chrome,
  );
  shaft.position.z = -0.5;
  const housing = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.9, 0.7), MATERIALS.matteBlack);
  housing.position.set(0, -0.2, -1.35);

  object.add(housing, shaft, wheel.root);
  object.rotation.set(0.12, 0.55, 0);

  const update = (time: number, delta: number) => {
    const phase = (time % 6) / 6;
    const wobble = phase < 0.55 ? 1 : phase < 0.72 ? 1 - smoothstep((phase - 0.55) / 0.17) : 0;
    wheel.spinner.rotation.z -= delta * 7;
    wheel.root.rotation.x = Math.sin(time * 38) * 0.035 * wobble;
    wheel.root.rotation.y = Math.cos(time * 38) * 0.035 * wobble;
    const weightScale = phase < 0.5 ? 0 : phase < 0.58 ? smoothstep((phase - 0.5) / 0.08) : 1;
    wheel.weight?.scale.setScalar(Math.max(0.001, weightScale));
  };

  return { object, update };
}
