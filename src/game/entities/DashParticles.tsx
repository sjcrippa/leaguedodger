import { Line } from "@react-three/drei";
import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Points, BufferGeometry, Float32BufferAttribute, Vector3, Color } from "three";

import { usePlayerStore } from "../stores/playerStore";

interface DashParticlesProps {
  isActive: boolean;
  position: Vector3;
}

export const DashParticles = ({ isActive, position }: DashParticlesProps) => {
  const particlesRef = useRef<Points>(null);
  const trailPositions = useRef<Vector3[]>([]);
  const updateDashParticles = usePlayerStore(state => state.updateDashParticles);
  const dashParticles = usePlayerStore(state => state.state.dashParticles);

  // Actualizar geometría de partículas y estela
  useEffect(() => {
    if (!particlesRef.current || !dashParticles?.positions?.length) return;

    // Actualizar partículas
    const geometry = new BufferGeometry();
    const positions = new Float32Array(dashParticles.positions.length * 3);
    const colors = new Float32Array(dashParticles.positions.length * 3);

    dashParticles.positions.forEach((particle: Vector3, i: number) => {
      // Posicionar las partículas relativas al jugador
      const pos = particle.clone().add(position);
      positions[i * 3] = pos.x;
      positions[i * 3 + 1] = pos.y;
      positions[i * 3 + 2] = pos.z;

      // Gradiente de color desde dorado a naranja
      const progress = dashParticles.lifetimes[i] / dashParticles.maxLifetime;
      const color = new Color().setHSL(0.1, 1, 0.5 + progress * 0.3); // Dorado más brillante
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
    dashParticles?.positions,
    position,
    isActive,
    dashParticles?.maxLifetime,
    dashParticles?.lifetimes,
  ]);

  useFrame((_, delta) => {
    if (isActive) {
      updateDashParticles(delta);
    } else {
      trailPositions.current = [];
    }
  });

  if (!isActive || !dashParticles) return null;

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
          color="#ffd700"
          lineWidth={3}
          transparent
          opacity={0.6}
        />
      )}
    </group>
  );
};
