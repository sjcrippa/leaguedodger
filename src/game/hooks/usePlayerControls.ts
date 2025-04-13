import { useEffect, useCallback } from 'react'
import { useGameStore } from '../states/gameStore'

export const usePlayerControls = (ref: React.RefObject<THREE.Mesh>) => {
  const isPaused = useGameStore((state) => state.isPaused)
  const isGameOver = useGameStore((state) => state.isGameOver)

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (isPaused || isGameOver || !ref.current) return

    const speed = 0.5
    const mesh = ref.current

    switch (event.key) {
      case 'ArrowLeft':
      case 'a':
        if (mesh.position.x > -14) {
          mesh.position.x -= speed
        }
        break
      case 'ArrowRight':
      case 'd':
        if (mesh.position.x < 14) {
          mesh.position.x += speed
        }
        break
      case 'ArrowUp':
      case 'w':
        if (mesh.position.z > -9) {
          mesh.position.z -= speed
        }
        break
      case 'ArrowDown':
      case 's':
        if (mesh.position.z < 9) {
          mesh.position.z += speed
        }
        break
    }
  }, [ref, isPaused, isGameOver])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])
} 