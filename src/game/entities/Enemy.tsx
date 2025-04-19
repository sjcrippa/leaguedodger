import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Group, Mesh } from "three";

import { EnemyState } from "../types/enemy";

interface EnemyProps {
  enemy: EnemyState;
  isHovered: boolean;
}

export const Enemy = ({ enemy, isHovered }: EnemyProps) => {
  const groupRef = useRef<Group>(null);
  const bodyRef = useRef<Mesh>(null);

  // Update position and rotation in each frame
  useFrame(() => {
    if (!groupRef.current) return;

    groupRef.current.position.set(
      enemy.position.x,
      enemy.position.y,
      enemy.position.z
    );
    
    groupRef.current.rotation.set(0, enemy.rotation.y, 0);
  });

  return (
    <group ref={groupRef} name={`enemy-${enemy.id}`}>
      {/* Hover effect */}
      {isHovered && (
        <mesh>
          <boxGeometry args={[2.5, 4.5, 2.5]} />
          <meshStandardMaterial
            color="#ffff00"
            transparent
            opacity={0.5}
            emissive="#ffff00"
            emissiveIntensity={1}
          />
        </mesh>
      )}

      {/* Main body */}
      <mesh ref={bodyRef} castShadow>
        <boxGeometry args={[2, 4, 2]} />
        <meshStandardMaterial 
          color={isHovered ? "#ff0000" : "purple"}
          emissive={isHovered ? "#ffff00" : "#000000"}
          emissiveIntensity={isHovered ? 0.5 : 0}
        />
      </mesh>

      {/* Eyes */}
      <group position={[0, 1, 1.01]}>
        {/* Right eye */}
        <mesh position={[0.4, 0, 0]}>
          <boxGeometry args={[0.4, 0.4, 0.1]} />
          <meshStandardMaterial 
            color={isHovered ? "#ffff00" : "red"}
            emissive={isHovered ? "#ffff00" : "#000000"}
            emissiveIntensity={isHovered ? 0.5 : 0}
          />
        </mesh>
        {/* Left eye */}
        <mesh position={[-0.4, 0, 0]}>
          <boxGeometry args={[0.4, 0.4, 0.1]} />
          <meshStandardMaterial 
            color={isHovered ? "#ffff00" : "red"}
            emissive={isHovered ? "#ffff00" : "#000000"}
            emissiveIntensity={isHovered ? 0.5 : 0}
          />
        </mesh>
      </group>
    </group>
  );
};
