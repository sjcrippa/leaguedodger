import { PerspectiveCamera } from '@react-three/drei'
import { Player } from '../entities/Player'
import { DEFAULT_GAME_CONFIG } from '../constants/gameConfig'
import { AbilitiesManager } from './AbilitiesManager'

export const GameScene = () => {
  return (
    <>
      {/* Camera setup */}
      <PerspectiveCamera
        makeDefault
        position={[0, 35, 35]}
        rotation={[-Math.PI / 4, 0, 0]}
        fov={45}
        zoom={1.5}
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

      {/* Abilities Manager */}
      <AbilitiesManager />
    </>
  )
} 