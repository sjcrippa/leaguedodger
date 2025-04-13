import { useEffect, useCallback, useRef } from 'react'
import { useGameStore } from '../states/gameStore'
import { Vector3, Vector2, Mesh } from 'three'
import { useThree } from '@react-three/fiber'

interface PlayerControls {
  isMoving: boolean
  targetPosition: Vector3
  moveSpeed: number
  // Keyboard movement state
  movement: {
    forward: boolean
    backward: boolean
    left: boolean
    right: boolean
  }
}

export const usePlayerControls = (ref: React.RefObject<Mesh>) => {
  const isPaused = useGameStore((state) => state.isPaused)
  const isGameOver = useGameStore((state) => state.isGameOver)
  const { camera, raycaster, scene } = useThree()
  
  const controls = useRef<PlayerControls>({
    isMoving: false,
    targetPosition: new Vector3(),
    moveSpeed: 0.1,
    movement: {
      forward: false,
      backward: false,
      left: false,
      right: false
    }
  })

  // Handle keyboard controls
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (isPaused || isGameOver) return

    switch (event.key.toLowerCase()) {
      case 'w':
      case 'arrowup':
        controls.current.movement.forward = true
        break
      case 's':
      case 'arrowdown':
        controls.current.movement.backward = true
        break
      case 'a':
      case 'arrowleft':
        controls.current.movement.left = true
        break
      case 'd':
      case 'arrowright':
        controls.current.movement.right = true
        break
    }
  }, [isPaused, isGameOver])

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    switch (event.key.toLowerCase()) {
      case 'w':
      case 'arrowup':
        controls.current.movement.forward = false
        break
      case 's':
      case 'arrowdown':
        controls.current.movement.backward = false
        break
      case 'a':
      case 'arrowleft':
        controls.current.movement.left = false
        break
      case 'd':
      case 'arrowright':
        controls.current.movement.right = false
        break
    }
  }, [])

  // Process keyboard movement
  useEffect(() => {
    let animationFrameId: number

    const updatePosition = () => {
      if (!ref.current || isPaused || isGameOver) return

      const mesh = ref.current
      const speed = controls.current.moveSpeed
      const movement = controls.current.movement

      // Update position based on keyboard input
      if (movement.forward && mesh.position.z > -9) mesh.position.z -= speed
      if (movement.backward && mesh.position.z < 9) mesh.position.z += speed
      if (movement.left && mesh.position.x > -14) mesh.position.x -= speed
      if (movement.right && mesh.position.x < 14) mesh.position.x += speed

      animationFrameId = requestAnimationFrame(updatePosition)
    }

    updatePosition()
    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
    }
  }, [ref, isPaused, isGameOver])

  // Función para procesar el movimiento con mouse/touch
  const processMovement = useCallback((x: number, y: number) => {
    if (!ref.current || isPaused || isGameOver) return

    const mouse = new Vector2(
      (x / window.innerWidth) * 2 - 1,
      -(y / window.innerHeight) * 2 + 1
    )

    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(scene.children, true)
    const floorIntersect = intersects.find(i => i.object.name === 'game-floor')

    if (floorIntersect) {
      const point = floorIntersect.point
      point.y = ref.current.position.y

      controls.current.targetPosition.copy(point)
      controls.current.isMoving = true

      const direction = new Vector3()
        .subVectors(point, ref.current.position)
        .normalize()
      
      const angle = Math.atan2(direction.x, direction.z)
      ref.current.rotation.y = -angle
    }
  }, [ref, camera, raycaster, scene, isPaused, isGameOver])

  // Handle mouse events
  const handleMouseDown = useCallback((event: MouseEvent) => {
    if (event.button === 2) {
      event.preventDefault()
      processMovement(event.clientX, event.clientY)
    }
  }, [processMovement])

  // Set up event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('contextmenu', (e) => e.preventDefault())

    const canvas = document.querySelector('canvas')
    if (canvas) {
      canvas.addEventListener('mousedown', handleMouseDown)
    }
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('contextmenu', (e) => e.preventDefault())
      
      if (canvas) {
        canvas.removeEventListener('mousedown', handleMouseDown)
      }
    }
  }, [handleKeyDown, handleKeyUp, handleMouseDown])

  return controls.current
} 