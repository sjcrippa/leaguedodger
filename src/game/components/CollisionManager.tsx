import { useEffect } from "react";
import { useThree } from "@react-three/fiber";

import { usePlayerStore } from "../stores/playerStore";
import { useAbilitiesStore } from "../stores/abilitiesStore";
import { useEnemyStore } from "../stores/enemyStore";
import { DEFAULT_GAME_CONFIG } from "../constants/gameConfig";

export const CollisionManager = () => {
  const { scene } = useThree();
  const projectiles = useAbilitiesStore(state => state.projectiles);
  const removeProjectile = useAbilitiesStore(state => state.removeProjectile);
  const playerState = usePlayerStore(state => state.state);
  const enemies = useEnemyStore(state => state.enemies);
  const removeEnemy = useEnemyStore(state => state.removeEnemy);
  const takeDamage = usePlayerStore(state => state.takeDamage);

  // Check collisions on each frame
  useEffect(() => {
    let frameId: number;

    const checkCollisions = () => {
      if (!playerState.isAlive) return;

      const player = scene.getObjectByName("player");
      if (!player) return;

      projectiles.forEach(projectile => {
        const distance = player.position.distanceTo(projectile.position);
        
        // Debug: Mostrar información de colisiones
        if (distance < DEFAULT_GAME_CONFIG.collision.minCollisionDistance * 2) {
          console.log('Proyectil cerca:', {
            source: projectile.source,
            distance,
            minDistance: DEFAULT_GAME_CONFIG.collision.minCollisionDistance,
            playerPos: player.position.toArray(),
            projectilePos: projectile.position.toArray(),
            isInvulnerable: playerState.isInvulnerable
          });
        }

        // Colisión de proyectil enemigo con jugador
        if (projectile.source === "enemy" && 
            distance < DEFAULT_GAME_CONFIG.collision.minCollisionDistance &&
            !playerState.isInvulnerable) {
          console.log("¡Colisión detectada con jugador!");
          removeProjectile(projectile.id);
          takeDamage();
          console.log("¡Jugador golpeado!");
        }

        // Colisión de proyectil del jugador con enemigos
        if (projectile.source === "player") {
          enemies.forEach(enemy => {
            if (!enemy.isAlive) return;
            
            const enemyObj = scene.getObjectByName(`enemy-${enemy.id}`);
            if (!enemyObj) return;

            const distanceToEnemy = enemyObj.position.distanceTo(projectile.position);
            if (distanceToEnemy < DEFAULT_GAME_CONFIG.collision.minCollisionDistance) {
              console.log("¡Colisión detectada con enemigo!");
              removeProjectile(projectile.id);
              removeEnemy(enemy.id);
              console.log("¡Enemigo eliminado!");
            }
          });
        }
      });

      frameId = requestAnimationFrame(checkCollisions);
    };

    frameId = requestAnimationFrame(checkCollisions);
    return () => cancelAnimationFrame(frameId);
  }, [scene, projectiles, playerState, enemies, removeProjectile, removeEnemy, takeDamage]);

  return null;
};
