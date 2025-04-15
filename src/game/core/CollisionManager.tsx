import { useEffect } from "react";
import { useThree } from "@react-three/fiber";

import { usePlayerStore } from "../stores/playerStore";
import { useAbilitiesStore } from "../stores/abilitiesStore";
import { useEnemyStore } from "../stores/enemyStore";
import { useGameStore } from "../stores/gameStore";
import { DEFAULT_GAME_CONFIG } from "../constants/gameConfig";

export const CollisionManager = () => {
  const { scene } = useThree();
  const projectiles = useAbilitiesStore(state => state.projectiles);
  const removeProjectile = useAbilitiesStore(state => state.removeProjectile);
  const playerState = usePlayerStore(state => state.state);
  const enemies = useEnemyStore(state => state.enemies);
  const removeEnemy = useEnemyStore(state => state.removeEnemy);
  const takeDamage = usePlayerStore(state => state.takeDamage);
  const setGameOver = useGameStore(state => state.setGameOver);
  const isGameOver = useGameStore(state => state.isGameOver);

  // Check collisions on each frame
  useEffect(() => {
    let frameId: number;

    const checkCollisions = () => {
      if (isGameOver) return;

      if (!playerState.isAlive) {
        setGameOver(true);
        return;
      }

      const player = scene.getObjectByName("player");
      if (!player) return;

      // Verificar colisiones con enemigos
      enemies.forEach(enemy => {
        if (!enemy.isAlive) return;

        const enemyObj = scene.getObjectByName(`enemy-${enemy.id}`);
        if (!enemyObj) return;

        // Colisión física con enemigo
        const distanceToEnemy = player.position.distanceTo(enemyObj.position);
        if (distanceToEnemy < DEFAULT_GAME_CONFIG.collision.minCollisionDistance * 1.5 &&
            !playerState.isInvulnerable) {
          takeDamage();
        }
      });

      // Verificar colisiones con proyectiles
      projectiles.forEach(projectile => {
        const distance = player.position.distanceTo(projectile.position);
        
        // Colisión de proyectil enemigo con jugador
        if (projectile.source === "enemy" && 
            distance < DEFAULT_GAME_CONFIG.collision.minCollisionDistance &&
            !playerState.isInvulnerable) {
          removeProjectile(projectile.id);
          takeDamage();
        }

        // Colisión de proyectil del jugador con enemigos
        if (projectile.source === "player") {
          enemies.forEach(enemy => {
            if (!enemy.isAlive) return;
            
            const enemyObj = scene.getObjectByName(`enemy-${enemy.id}`);
            if (!enemyObj) return;

            const distanceToEnemy = enemyObj.position.distanceTo(projectile.position);
            if (distanceToEnemy < DEFAULT_GAME_CONFIG.collision.minCollisionDistance) {
              removeProjectile(projectile.id);
              removeEnemy(enemy.id);
            }
          });
        }
      });

      frameId = requestAnimationFrame(checkCollisions);
    };

    frameId = requestAnimationFrame(checkCollisions);
    return () => cancelAnimationFrame(frameId);
  }, [scene, projectiles, playerState, enemies, removeProjectile, removeEnemy, takeDamage, setGameOver, isGameOver]);

  return null;
};
