import { Line } from "@react-three/drei";
import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";

import { usePlayerStore } from "../stores/playerStore";

interface DashTrailProps {
  isActive: boolean;
  position: Vector3;
}

export const DashTrail = ({ isActive, position }: DashTrailProps) => {
  const updateDashTrail = usePlayerStore(state => state.updateDashTrail);
  const dashTrail = usePlayerStore(state => state.state.dashTrail);

  useFrame(() => {
    if (isActive) {
      updateDashTrail(position);
    }
  });

  if (!isActive || !dashTrail || dashTrail.positions.length < 2) return null;

  return (
    <Line
      points={dashTrail.positions.map(p => [p.x, p.y, p.z])}
      color="#ffd700"
      lineWidth={3}
      transparent
      opacity={0.6}
    />
  );
}; 