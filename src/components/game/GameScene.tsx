import { useRef, useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import { Physics, usePlane, useBox } from '@react-three/cannon'
import { Vector2 } from 'three'
import type { Mesh, PerspectiveCamera as TPerspectiveCamera } from 'three'

// Componente para el suelo (mapa)
const Floor = () => {
  const [ref] = usePlane<Mesh>(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0],
    material: { friction: 0.1 }
  }))

  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[30, 20]} /> {/* Rectángulo 30x20 */}
      <meshStandardMaterial color="#374151" />
    </mesh>
  )
}

// Componente para el cubo del jugador
const Player = () => {
  const [ref, api] = useBox<Mesh>(() => ({
    mass: 1,
    position: [0, 0.5, 0],
    rotation: [0, 0, 0],
    fixedRotation: true,
    type: 'Dynamic'
  }))

  const { camera, raycaster, scene } = useThree()
  
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (event.buttons === 2) { // Click derecho
        // Convertir coordenadas del mouse a coordenadas normalizadas (-1 a 1)
        const rect = event.currentTarget as Window
        const mouse = new Vector2(
          (event.clientX / rect.innerWidth) * 2 - 1,
          -(event.clientY / rect.innerHeight) * 2 + 1
        )
        
        // Actualizar el raycaster
        raycaster.setFromCamera(mouse, camera)
        
        // Buscar intersección con el plano
        const intersects = raycaster.intersectObjects(scene.children, true)
        const floorIntersect = intersects.find(i => i.object.name === 'floor-plane')
        
        if (floorIntersect) {
          // Mover el cubo a la posición del mouse
          api.position.set(floorIntersect.point.x, 0.5, floorIntersect.point.z)
        }
      }
    }

    const preventDefault = (e: Event) => e.preventDefault()
    
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('contextmenu', preventDefault)
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('contextmenu', preventDefault)
    }
  }, [api, camera, raycaster, scene])

  return (
    <mesh ref={ref} castShadow>
      <boxGeometry args={[1, 5, 1]} />
      <meshStandardMaterial color="#3B82F6" />
    </mesh>
  )
}

// Componente para las luces
const Lights = () => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[0, 20, 10]}
        intensity={1}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
    </>
  )
}

export const GameScene = () => {
  const cameraRef = useRef<TPerspectiveCamera>(null)

  return (
    <>
      {/* Cámara con ángulo inclinado y fija */}
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={[0, 35, 35]}
        rotation={[-Math.PI / 4, 0, 0]}
        fov={45}
        zoom={2}
        near={0.1}
        far={1000}
      />
      
      <Lights />
      
      <Physics>
        <Floor />
        <Player />
      </Physics>

      {/* Plano invisible para el raycasting */}
      <mesh name="floor-plane" visible={false} position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[30, 20]} />
        <meshBasicMaterial />
      </mesh>

      {/* Ambiente */}
      <fog attach="fog" args={['#1f2937', 30, 100]} />
      <color attach="background" args={['#1f2937']} />
    </>
  )
} 