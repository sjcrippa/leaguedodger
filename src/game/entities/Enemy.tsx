import { useRef } from 'react'
import { Mesh, Vector3 } from 'three'
import { useFrame } from '@react-three/fiber'
import { EnemyState } from '../types/enemy'

interface EnemyProps {
  enemy: EnemyState
}

export const Enemy = ({ enemy }: EnemyProps) => {
  const groupRef = useRef<THREE.Group>(null)

  // Actualizar la posición y rotación en cada frame
  useFrame(() => {
    if (!groupRef.current) return
    
    // Actualizar posición
    groupRef.current.position.copy(enemy.position)
    
    // Actualizar rotación
    groupRef.current.rotation.y = enemy.rotation.y
  })

  return (
    <group
      ref={groupRef}
      position={enemy.position}
      name={`enemy-${enemy.id}`}
    >
      <mesh
        castShadow
      >
        {/* Main body */}
        <boxGeometry args={[2, 4, 2]} />
        <meshStandardMaterial color="purple" />
      </mesh>
      
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
    </group>
  )
} 