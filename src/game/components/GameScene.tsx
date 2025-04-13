import { useEffect } from 'react'
import { PerspectiveCamera } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { Player } from '../entities/Player'
import { Enemy } from '../entities/Enemy'
import { DEFAULT_GAME_CONFIG } from '../constants/gameConfig'
import { AbilitiesManager } from './AbilitiesManager'
import { CollisionManager } from './CollisionManager'
import { Projectile } from '../entities/Projectile'
import { useAbilitiesStore } from '../stores/abilitiesStore'
import { useEnemyStore } from '../stores/enemyStore'
import { usePlayerStore } from '../stores/playerStore'
import { useGameStore } from '../stores/gameStore'
import { Vector3 } from 'three'

export const GameScene = () => {
  const projectiles = useAbilitiesStore((state) => state.projectiles)
  const removeProjectile = useAbilitiesStore((state) => state.removeProjectile)
  const playerPosition = usePlayerStore((state) => state.state.position)
  const isGameOver = useGameStore(state => state.isGameOver)
  
  const enemies = useEnemyStore((state) => state.enemies)
  const reset = useEnemyStore((state) => state.reset)
  const updateEnemies = useEnemyStore((state) => state.updateEnemies)

  // Inicializar enemigos
  useEffect(() => {
    if (isGameOver) return;
    reset() // Esto spawneará los enemigos iniciales en posiciones aleatorias
  }, [reset, isGameOver])

  // Actualizar enemigos en cada frame
  useFrame(() => {
    if (isGameOver) return;
    updateEnemies(playerPosition)
  })

  return (
    <>
      {/* Camera setup */}
      <PerspectiveCamera
        makeDefault
        position={[0, 50, 50]}
        rotation={[-Math.PI / 4, 0, 0]}
        fov={45}
        zoom={1}
        near={0.1}
        far={1000}
      />

      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />

      {/* Game floor */}
      <mesh 
        name="game-floor"
        rotation={[-Math.PI / 2, 0, 0]} 
        receiveShadow
        position={[0, 0, 0]}
      >
        <planeGeometry args={[DEFAULT_GAME_CONFIG.mapSize.width, DEFAULT_GAME_CONFIG.mapSize.height]} />
        <meshStandardMaterial color="#1F2937" />
      </mesh>

      {/* Player */}
      <Player />

      {/* Enemies */}
      {enemies.map((enemy) => (
        <Enemy key={enemy.id} enemy={enemy} />
      ))}

      {/* Projectiles */}
      {projectiles.map((projectile) => (
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
  )
}
