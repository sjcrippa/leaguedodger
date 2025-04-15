import { Mesh, Vector3 } from "three";
import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";

import { DashParticles } from "./DashParticles";
import { useGameStore } from "../stores/gameStore";
import { usePlayerStore } from "../stores/playerStore";
import { usePlayerControls } from "../hooks/usePlayerControls";

export const Player = () => {
  const meshRef = useRef<Mesh>(null);
  const shieldRef = useRef<Mesh>(null);
  const isGameOver = useGameStore(state => state.isGameOver);
  const controls = usePlayerControls(meshRef);
  const updatePosition = usePlayerStore(state => state.updatePosition);
  const playerPosition = usePlayerStore(state => state.state.position);
  const isShielded = usePlayerStore(state => state.state.isShielded);
  const isDashing = usePlayerStore(state => state.state.isDashing);
  const isFlashing = usePlayerStore(state => state.state.isFlashing);

  // Set initial position when component mounts and sync with store position changes
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.position.copy(playerPosition);
    }
  }, [playerPosition]);

  // Handle movement in animation frame
  useFrame((_, delta) => {
    if (!meshRef.current || isGameOver) return;

    // If dashing or flashing, do not allow normal movement
    if (isDashing || isFlashing) {
      // Update mesh position directly
      meshRef.current.position.copy(playerPosition);
      return;
    }

    if (controls.isMoving) {
      const currentPos = meshRef.current.position;
      const distance = currentPos.distanceTo(controls.targetPosition);

      if (distance > 0.1) {
        // Calculate movement direction
        const direction = new Vector3().subVectors(controls.targetPosition, currentPos).normalize();

        // Apply smooth movement
        currentPos.add(direction.multiplyScalar(controls.moveSpeed));
        updatePosition(currentPos);
      } else {
        controls.isMoving = false;
      }
    }

    // Animate the shield if it is active
    if (shieldRef.current && isShielded) {
      // Update shield position to follow the player
      shieldRef.current.position.copy(meshRef.current.position);

      // Shield rotation and scale
      shieldRef.current.rotation.y += delta * 2; // Constant rotation
      shieldRef.current.scale.set(
        1 + Math.sin(Date.now() * 0.005) * 0.1, // Pulsación suave
        1 + Math.sin(Date.now() * 0.005) * 0.1,
        1 + Math.sin(Date.now() * 0.005) * 0.1
      );
    }
  });

  return (
    <group>
      <mesh ref={meshRef} castShadow name="player">
        {/* Main body */}
        <boxGeometry args={[1.5, 4, 1.5]} />
        <meshStandardMaterial 
          color="blue" 
          transparent={isFlashing}
          opacity={isFlashing ? 0.5 : 1}
          emissive={isFlashing ? "#00ffff" : "#000000"}
          emissiveIntensity={isFlashing ? 1 : 0}
        />

        {/* Eyes (optional decorative elements) */}
        <group position={[0, 1.5, 0.9]}>
          {/* Right eye */}
          <mesh position={[0.2, 0, 0]}>
            <boxGeometry args={[0.2, 0.2, 0.1]} />
            <meshStandardMaterial 
              color="white" 
              transparent={isFlashing}
              opacity={isFlashing ? 0.5 : 1}
              emissive={isFlashing ? "#00ffff" : "#000000"}
              emissiveIntensity={isFlashing ? 1 : 0}
            />
          </mesh>
          {/* Left eye */}
          <mesh position={[-0.2, 0, 0]}>
            <boxGeometry args={[0.2, 0.2, 0.1]} />
            <meshStandardMaterial 
              color="white" 
              transparent={isFlashing}
              opacity={isFlashing ? 0.5 : 1}
              emissive={isFlashing ? "#00ffff" : "#000000"}
              emissiveIntensity={isFlashing ? 1 : 0}
            />
          </mesh>
        </group>
      </mesh>

      {/* Shield effect */}
      {isShielded && (
        <mesh ref={shieldRef} castShadow>
          <boxGeometry args={[3, 5, 3]} />
          <meshStandardMaterial
            color="#ffd700"
            transparent
            opacity={0.3}
            emissive="#ffd700"
            emissiveIntensity={0.5}
          />
        </mesh>
      )}

      <DashParticles isActive={isDashing} position={playerPosition} />
    </group>
  );
};
