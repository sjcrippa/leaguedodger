import { useRef, useEffect } from "react";
import { Mesh, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
import { useGameStore } from "../stores/gameStore";
import { usePlayerControls } from "../hooks/usePlayerControls";
import { usePlayerStore } from "../stores/playerStore";

export const Player = () => {
  const meshRef = useRef<Mesh>(null);
  const isGameOver = useGameStore(state => state.isGameOver);
  const controls = usePlayerControls(meshRef);
  const updatePosition = usePlayerStore(state => state.updatePosition);

  // Update player position in store
  useEffect(() => {
    if (meshRef.current) {
      updatePosition(meshRef.current.position);
    }
  }, []);

  // Handle movement in animation frame
  useFrame(() => {
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
  });

  return (
    <mesh
      ref={meshRef}
      position={[0, 2.5, 0]}
      castShadow
      name="player"
    >
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
  );
};
