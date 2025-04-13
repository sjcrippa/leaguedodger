import { useRef } from "react";
import { Mesh, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";

interface ProjectileProps {
  position: Vector3;
  direction: Vector3;
  speed?: number;
  onDestroy?: () => void;
}

export const Projectile = ({ position, direction, speed = 0.5, onDestroy }: ProjectileProps) => {
  const meshRef = useRef<Mesh>(null);
  const lifetime = useRef(0);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    // Move projectile
    const movement = direction.clone().multiplyScalar(speed);
    meshRef.current.position.add(movement);

    // Log movement for debugging
    if (lifetime.current === 0) {
      console.log("Projectile initial state:", {
        position: meshRef.current.position.toArray(),
        movement: movement.toArray(),
        direction: direction.toArray(),
        speed,
      });
    }

    // Update lifetime
    lifetime.current += delta;

    // Destroy after 3 seconds
    if (lifetime.current > 3) {
      onDestroy?.();
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial
        color="red"
        emissive="red"
        emissiveIntensity={0.5}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
};
