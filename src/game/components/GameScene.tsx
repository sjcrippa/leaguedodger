import { PerspectiveCamera } from "@react-three/drei";
import { Player } from "../entities/Player";
import { DEFAULT_GAME_CONFIG } from "../constants/gameConfig";
import { AbilitiesManager } from "./AbilitiesManager";
import { Projectile } from "../entities/Projectile";
import { useAbilitiesStore } from "../stores/abilitiesStore";

export const GameScene = () => {
  const projectiles = useAbilitiesStore(state => state.projectiles);
  const removeProjectile = useAbilitiesStore(state => state.removeProjectile);

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
      <mesh name="game-floor" rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
        <planeGeometry
          args={[DEFAULT_GAME_CONFIG.mapSize.width, DEFAULT_GAME_CONFIG.mapSize.height]}
        />
        <meshStandardMaterial color="#1F2937" />
      </mesh>

      {/* Player */}
      <Player />

      {/* Projectiles */}
      {projectiles.map(projectile => (
        <Projectile
          key={projectile.id}
          position={projectile.position}
          direction={projectile.direction}
          onDestroy={() => removeProjectile(projectile.id)}
        />
      ))}

      {/* Managers */}
      <AbilitiesManager />
    </>
  );
};
