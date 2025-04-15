import { Mesh, Vector3 } from "three";
import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";

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

  // Set initial position when component mounts and sync with store position changes
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.position.copy(playerPosition);
    }
  }, [playerPosition]);

  // Handle movement in animation frame
  useFrame((_, delta) => {
    if (!meshRef.current || isGameOver) return;

    if (controls.isMoving) {
      const currentPos = meshRef.current.position;
      const distance = currentPos.distanceTo(controls.targetPosition);

      if (distance > 0.1) {
        // Calcular dirección del movimiento
        const direction = new Vector3().subVectors(controls.targetPosition, currentPos).normalize();

        // Aplicar movimiento suave
        currentPos.add(direction.multiplyScalar(controls.moveSpeed));
        updatePosition(currentPos);
      } else {
        controls.isMoving = false;
      }
    }

    // Animar el escudo si está activo
    if (shieldRef.current && isShielded) {
      // Actualizar posición del escudo para que siga al jugador
      shieldRef.current.position.copy(meshRef.current.position);
      
      // Rotación y escala del escudo
      shieldRef.current.rotation.y += delta * 2; // Rotación constante
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
        <meshStandardMaterial color="blue" />

        {/* Eyes (optional decorative elements) */}
        <group position={[0, 1.5, 0.9]}>
          {/* Right eye */}
          <mesh position={[0.2, 0, 0]}>
            <boxGeometry args={[0.2, 0.2, 0.1]} />
            <meshStandardMaterial color="white" />
          </mesh>
          {/* Left eye */}
          <mesh position={[-0.2, 0, 0]}>
            <boxGeometry args={[0.2, 0.2, 0.1]} />
            <meshStandardMaterial color="white" />
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
    </group>
  );
};
