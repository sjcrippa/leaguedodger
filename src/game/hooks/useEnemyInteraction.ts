import { useCallback, useState, useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { Vector3, Vector2 } from "three";
import { useGameStore } from "../stores/gameStore";
import { usePlayerStore } from "../stores/playerStore";
import { useAbilitiesStore } from "../stores/abilitiesStore";

const BASIC_ATTACK_COOLDOWN = 3000; // 3 seconds in milliseconds

export const useEnemyInteraction = () => {
  const { camera, raycaster, scene } = useThree();
  const isPaused = useGameStore(state => state.isPaused);
  const isGameOver = useGameStore(state => state.isGameOver);
  const countdown = useGameStore(state => state.countdown);
  const playerPosition = usePlayerStore(state => state.state.position);
  const [hoveredEnemyId, setHoveredEnemyId] = useState<string | null>(null);
  const lastAttackTimes = useRef<Record<string, number>>({});

  // Detect hover over enemies
  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (isPaused || isGameOver || countdown !== null) return;

      const mouse = new Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
      );

      raycaster.setFromCamera(mouse, camera);
      
      // Get all enemy meshes
      const enemyMeshes = scene.children
        .filter(child => child.name.startsWith('enemy-'))
        .flatMap(enemyGroup => enemyGroup.children.filter(child => child.type === 'Mesh'));

      const intersects = raycaster.intersectObjects(enemyMeshes, true);

      if (intersects.length > 0) {
        const enemyGroup = intersects[0].object.parent;
        if (enemyGroup && enemyGroup.name.startsWith('enemy-')) {
          const enemyId = enemyGroup.name.split('-')[1];
          setHoveredEnemyId(enemyId);
        }
      } else {
        setHoveredEnemyId(null);
      }
    },
    [camera, raycaster, scene, isPaused, isGameOver, countdown]
  );

  // Handle basic attack
  const handleMouseDown = useCallback(
    (event: MouseEvent) => {
      if (event.button === 2) { // Right click
        event.preventDefault();

        if (hoveredEnemyId) {
          const now = Date.now();
          const lastAttackTime = lastAttackTimes.current[hoveredEnemyId] || 0;
          
          if (now - lastAttackTime < BASIC_ATTACK_COOLDOWN) {
            // Show cooldown feedback (you could add a visual or sound effect here)
            return;
          }

          const enemyGroup = scene.getObjectByName(`enemy-${hoveredEnemyId}`);
          if (enemyGroup) {
            const direction = new Vector3()
              .subVectors(enemyGroup.position, playerPosition)
              .normalize();
            const startPosition = playerPosition.clone().add(direction.multiplyScalar(1.5));
            useAbilitiesStore.getState().addProjectile(startPosition, direction, "player", 0.6);
            lastAttackTimes.current[hoveredEnemyId] = now;
          }
        }
      }
    },
    [scene, playerPosition, hoveredEnemyId]
  );

  // Setup event listeners
  useEffect(() => {
    const canvas = document.querySelector("canvas");
    if (canvas) {
      canvas.addEventListener("mousemove", handleMouseMove);
      canvas.addEventListener("mousedown", handleMouseDown);
    }
    window.addEventListener("contextmenu", e => e.preventDefault());

    return () => {
      if (canvas) {
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("mousedown", handleMouseDown);
      }
      window.removeEventListener("contextmenu", e => e.preventDefault());
    };
  }, [handleMouseMove, handleMouseDown]);

  return {
    hoveredEnemyId,
  };
}; 