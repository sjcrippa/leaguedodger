import { useRef } from 'react'
import { Mesh, Vector3 } from 'three'
import { EnemyState } from '../types/enemy'

interface EnemyProps {
  enemy: EnemyState
}

export const Enemy = ({ enemy }: EnemyProps) => {
  const meshRef = useRef<Mesh>(null)

  return (
    <mesh
      ref={meshRef}
      position={enemy.position}
      rotation-y={enemy.rotation.y}
      castShadow
      name={`enemy-${enemy.id}`}
    >
      {/* Main body */}
      <boxGeometry args={[2, 4, 2]} />
      <meshStandardMaterial color="purple" />
      
      {/* Eyes */}
      <group position={[0, 1, 1.01]}>
        {/* Right eye */}
        <mesh position={[0.4, 0, 0]}>
          <boxGeometry args={[0.4, 0.4, 0.1]} />
          <meshStandardMaterial color="red" />
        </mesh>
        {/* Left eye */}
        <mesh position={[-0.4, 0, 0]}>
          <boxGeometry args={[0.4, 0.4, 0.1]} />
          <meshStandardMaterial color="red" />
        </mesh>
      </group>
    </mesh>
  )
} 