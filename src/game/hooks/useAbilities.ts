import { useEffect } from 'react'
import { useAbilitiesStore } from '../stores/abilitiesStore'
import { Vector3 } from 'three'
import { useThree } from '@react-three/fiber'
import { ABILITY_KEYS, AbilityKey } from '../types/abilities'

export const useAbilities = () => {
  const { useAbility } = useAbilitiesStore()
  const { scene } = useThree()

  const handleKeyPress = (event: KeyboardEvent) => {
    const key = event.key.toLowerCase()
    if (ABILITY_KEYS.includes(key as AbilityKey)) {
      const player = scene.getObjectByName('player')
      if (!player) return

      // Get player's forward direction based on rotation
      const direction = new Vector3(0, 0, 1)
        .applyQuaternion(player.quaternion)
        .normalize()

      // Create projectile closer to the player
      const startPosition = player.position.clone().add(direction.clone().multiplyScalar(1.5))

      // Use ability with position and direction
      useAbility(key, startPosition, direction)
    }
  }

  // Initialize keyboard event listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [useAbility, scene])

  return null
} 