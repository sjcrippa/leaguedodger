import { Line } from "@react-three/drei";
import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Points, BufferGeometry, Float32BufferAttribute, Vector3, Color } from "three";

import { usePlayerStore } from "../stores/playerStore";

interface FlashParticlesProps {
  isActive: boolean;
  position: Vector3;
}

export const FlashParticles = ({ isActive, position }: FlashParticlesProps) => {
  const particlesRef = useRef<Points>(null);
  const trailPositions = useRef<Vector3[]>([]);
  const updateFlashParticles = usePlayerStore(state => state.updateFlashParticles);
  const flashParticles = usePlayerStore(state => state.state.flashParticles);

  // Actualizar geometría de partículas y estela
  useEffect(() => {
    if (!particlesRef.current || !flashParticles?.positions?.length) return;

    // Actualizar partículas
    const geometry = new BufferGeometry();
    const positions = new Float32Array(flashParticles.positions.length * 3);
    const colors = new Float32Array(flashParticles.positions.length * 3);

    flashParticles.positions.forEach((particle: Vector3, i: number) => {
      // Posicionar las partículas relativas al jugador
      const pos = particle.clone().add(position);
      positions[i * 3] = pos.x;
      positions[i * 3 + 1] = pos.y;
      positions[i * 3 + 2] = pos.z;

      // Gradiente de color desde azul a blanco
      const progress = flashParticles.lifetimes[i] / flashParticles.maxLifetime;
      const color = new Color().setHSL(0.6, 1, 0.5 + progress * 0.3); // Azul más brillante
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    });

    geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
    geometry.setAttribute("color", new Float32BufferAttribute(colors, 3));
    particlesRef.current.geometry = geometry;

    // Actualizar estela
    if (isActive) {
      trailPositions.current.push(position.clone());
      if (trailPositions.current.length > 15) {
        trailPositions.current.shift();
      }
    }
  }, [
    flashParticles?.positions,
    position,
    isActive,
    flashParticles?.maxLifetime,
    flashParticles?.lifetimes,
  ]);

  useFrame((_, delta) => {
    if (isActive) {
      updateFlashParticles(delta);
    } else {
      trailPositions.current = [];
    }
  });

  if (!isActive || !flashParticles) return null;

  return (
    <group>
      <points ref={particlesRef}>
        <pointsMaterial
          size={0.4}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation={true}
          blending={2}
        />
      </points>
      {trailPositions.current.length > 1 && (
        <Line
          points={trailPositions.current.map(p => [p.x, p.y, p.z])}
          color="#00ffff"
          lineWidth={3}
          transparent
          opacity={0.6}
        />
      )}
    </group>
  );
};
