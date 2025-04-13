import { useRef } from 'react'
import { Mesh, Vector3 } from 'three'
import { useFrame } from '@react-three/fiber'
import { useGameStore } from '../states/gameStore'
import { usePlayerControls } from '../hooks/usePlayerControls'

export const Player = () => {
  const meshRef = useRef<Mesh>(null)
  const isGameOver = useGameStore((state) => state.isGameOver)
  const controls = usePlayerControls(meshRef)
  const velocity = useRef(new Vector3())

  // Handle movement in animation frame
  useFrame((state, delta) => {
    if (!meshRef.current || isGameOver) return

    if (controls.isMoving) {
      const currentPos = meshRef.current.position
      const distance = currentPos.distanceTo(controls.targetPosition)
      
      if (distance > 0.1) {
        // Calcular dirección del movimiento
        const direction = new Vector3()
          .subVectors(controls.targetPosition, currentPos)
          .normalize()

        // Actualizar velocidad
        velocity.current.copy(direction).multiplyScalar(controls.moveSpeed)

        // Aplicar movimiento suave
        currentPos.add(velocity.current)
      } else {
        controls.isMoving = false
        velocity.current.set(0, 0, 0)
      }
    }
  })

  return (
    <mesh
      ref={meshRef}
      position={[0, 2.5, 0]}
      castShadow
    >
      {/* Main body */}
      <boxGeometry args={[1, 5, 1]} />
      <meshStandardMaterial color="#3B82F6" />
      
      {/* Eyes (optional decorative elements) */}
      <group position={[0, 1.5, 0.51]}>
        {/* Right eye */}
        <mesh position={[0.2, 0, 0]}>
          <boxGeometry args={[0.2, 0.2, 0.1]} />
          <meshStandardMaterial color="white" />
        </mesh>
        {/* Left eye */}
        <mesh position={[-0.2, 0, 0]}>
          <boxGeometry args={[0.2, 0.2, 0.1]} />
          <meshStandardMaterial color="white" />
        </mesh>
      </group>
    </mesh>
  )
} 