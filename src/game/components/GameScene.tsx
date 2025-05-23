import { useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";

import { Enemy } from "../entities/Enemy";
import { Player } from "../entities/Player";
import { useGameStore } from "../stores/gameStore";
import { Projectile } from "../entities/Projectile";
import { useEnemyStore } from "../stores/enemyStore";
import { useLevelStore } from "../stores/levelStore";
import { usePlayerStore } from "../stores/playerStore";
import { CollisionManager } from "../core/CollisionManager";
import { AbilitiesManager } from "../core/AbilitiesManager";
import { useAbilitiesStore } from "../stores/abilitiesStore";
import { DEFAULT_GAME_CONFIG } from "../constants/gameConfig";
import { useEnemyInteraction } from "../hooks/useEnemyInteraction";

export const GameScene = () => {
  const projectiles = useAbilitiesStore(state => state.projectiles);
  const removeProjectile = useAbilitiesStore(state => state.removeProjectile);
  const playerPosition = usePlayerStore(state => state.state.position);
  const resetPlayer = usePlayerStore(state => state.reset);
  const isGameOver = useGameStore(state => state.isGameOver);
  const isPaused = useGameStore(state => state.isPaused);
  const countdown = useGameStore(state => state.countdown);
  const startCountdown = useGameStore(state => state.startCountdown);
  const updateCountdown = useGameStore(state => state.updateCountdown);
  const currentLevel = useLevelStore(state => state.currentLevel);

  const enemies = useEnemyStore(state => state.enemies);
  const reset = useEnemyStore(state => state.reset);
  const updateEnemies = useEnemyStore(state => state.updateEnemies);

  // Get enemy interaction state
  const { hoveredEnemyId } = useEnemyInteraction();

  // Initialize countdown when game starts
  useEffect(() => {
    if (isGameOver) return;
    startCountdown();
    resetPlayer(); // Reset player position when countdown starts
  }, [startCountdown, isGameOver, resetPlayer]);

  // Start countdown when level changes
  useEffect(() => {
    if (isGameOver) return;
    startCountdown();
    resetPlayer();
  }, [currentLevel, startCountdown, isGameOver, resetPlayer]);

  // Update countdown every second
  useEffect(() => {
    if (countdown === null) return;

    const interval = setInterval(() => {
      updateCountdown();
    }, 1000);

    return () => clearInterval(interval);
  }, [countdown, updateCountdown]);

  // Start enemy generation when countdown ends
  useEffect(() => {
    if (countdown === null && !isGameOver) {
      reset();
    }
  }, [countdown, reset, isGameOver]);

  // Update enemies in each frame
  useFrame(() => {
    if (isGameOver || isPaused || countdown !== null) return;
    updateEnemies(playerPosition);
  });

  return (
    <>
      {/* Camera setup */}
      <PerspectiveCamera
        makeDefault
        position={[0, 60, 60]}
        rotation={[-Math.PI / 4, 0, 0]}
        fov={55}
        zoom={1}
        near={0.1}
        far={1000}
      />

      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[50, 70, 50]}
        intensity={1}
        castShadow
        shadow-mapSize={[4096, 4096]}
        shadow-camera-near={0.1}
        shadow-camera-far={800}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
      />

      {/* Game floor */}
      <mesh name="game-floor" rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
        <planeGeometry
          args={[DEFAULT_GAME_CONFIG.mapSize.width, DEFAULT_GAME_CONFIG.mapSize.height]}
        />
        <meshStandardMaterial color="white" />
      </mesh>

      {/* Player */}
      <Player />

      {/* Enemies */}
      {enemies.map(enemy => (
        <Enemy 
          key={enemy.id} 
          enemy={enemy} 
          isHovered={hoveredEnemyId === enemy.id}
        />
      ))}

      {/* Projectiles */}
      {projectiles.map(projectile => (
        <Projectile
          key={projectile.id}
          position={projectile.position}
          direction={projectile.direction}
          source={projectile.source}
          speed={projectile.speed}
          onDestroy={() => removeProjectile(projectile.id)}
        />
      ))}

      {/* Managers */}
      <AbilitiesManager />
      <CollisionManager />
    </>
  );
};
