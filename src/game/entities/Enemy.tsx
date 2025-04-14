import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Group } from "three";

import { EnemyState } from "../types/enemy";

interface EnemyProps {
  enemy: EnemyState;
}

export const Enemy = ({ enemy }: EnemyProps) => {
  const groupRef = useRef<Group>(null);

  // Update position and rotation in each frame
  useFrame(() => {
    if (!groupRef.current) return;

    // Actualizar posición y rotación de manera más directa
    groupRef.current.position.set(
      enemy.position.x,
      enemy.position.y,
      enemy.position.z
    );
    
    // Asegurar que la rotación se actualice correctamente
    groupRef.current.rotation.set(0, enemy.rotation.y, 0);
  });

  return (
    <group ref={groupRef} name={`enemy-${enemy.id}`}>
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
