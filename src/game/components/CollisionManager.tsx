import { useEffect } from "react";
import { useThree } from "@react-three/fiber";

import { usePlayerStore } from "../stores/playerStore";
import { useAbilitiesStore } from "../stores/abilitiesStore";
import { DEFAULT_GAME_CONFIG } from "../constants/gameConfig";

export const CollisionManager = () => {
  const { scene } = useThree();
  const projectiles = useAbilitiesStore(state => state.projectiles);
  const removeProjectile = useAbilitiesStore(state => state.removeProjectile);
  const isAlive = usePlayerStore(state => state.state.isAlive);

  // Check collisions on each frame
  useEffect(() => {
    let frameId: number;

    const checkCollisions = () => {
      if (!isAlive) return;

      const player = scene.getObjectByName("player");
      if (!player) return;

      projectiles.forEach(projectile => {
        const distance = player.position.distanceTo(projectile.position);
        // Remove projectile if it's too close to the player
        if (distance < DEFAULT_GAME_CONFIG.collision.minCollisionDistance) {
          removeProjectile(projectile.id);
        }
      });

      frameId = requestAnimationFrame(checkCollisions);
    };

    frameId = requestAnimationFrame(checkCollisions);
    return () => cancelAnimationFrame(frameId);
  }, [scene, projectiles, isAlive, removeProjectile]);

  return null;
};
