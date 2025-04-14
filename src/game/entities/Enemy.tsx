import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

import { EnemyState } from "../types/enemy";

interface EnemyProps {
  enemy: EnemyState;
}

export const Enemy = ({ enemy }: EnemyProps) => {
  const groupRef = useRef<THREE.Group>(null);

  // Update position and rotation in each frame
  useFrame(() => {
    if (!groupRef.current) return;

    // Update position
    groupRef.current.position.copy(enemy.position);

    // Update rotation
    groupRef.current.rotation.y = enemy.rotation.y;
  });

  return (
    <group ref={groupRef} position={enemy.position} name={`enemy-${enemy.id}`}>
      <mesh castShadow>
        {/* Main body */}
        <boxGeometry args={[2, 4, 2]} />
        <meshStandardMaterial color="purple" />
      </mesh>

      {/* Eyes */}
      <group position={[0, 1, 1.01]}>
        {/* Right eye */}
        <mesh position={[0.4, 0, 0]}>
          <boxGeometry args={[0.4, 0.4, 0.1]} />
          <meshStandardMaterial color="red" />
        </mesh>
        {/* Left eye */}
        <mesh position={[-0.4, 0, 0]}>
          <boxGeometry args={[0.4, 0.4, 0.1]} />
          <meshStandardMaterial color="red" />
        </mesh>
      </group>
    </group>
  );
};
