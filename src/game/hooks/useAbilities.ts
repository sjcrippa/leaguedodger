import { useEffect, useRef } from 'react'
import { useAbilitiesStore } from '../stores/abilitiesStore'
import { Vector3 } from 'three'
import { useThree } from '@react-three/fiber'
import { ABILITY_KEYS, AbilityKey } from '../types/abilities'
import { ABILITIES_CONFIG } from '../constants/abilities'

export const useAbilities = () => {
  const { useAbility, setAbility, addProjectile } = useAbilitiesStore()
  const { scene } = useThree()
  const projectileId = useRef(0)

  const handleKeyPress = (event: KeyboardEvent) => {
    const key = event.key.toLowerCase()
    if (ABILITY_KEYS.includes(key as AbilityKey)) {
      useAbility(key as AbilityKey)
    }
  }

  const shootProjectile = () => {
    const player = scene.getObjectByName('player')
    if (!player) return

    // Get player's forward direction based on rotation
    const direction = new Vector3(0, 0, 1)
      .applyQuaternion(player.quaternion)
      .normalize()

    // Create projectile slightly in front of the player
    const startPosition = player.position.clone().add(direction.clone().multiplyScalar(1))

    // Create projectile
    const projectile = {
      id: projectileId.current++,
      position: startPosition,
      direction
    }

    addProjectile(projectile)
  }

  // Initialize keyboard event listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [useAbility])

  // Initialize abilities
  useEffect(() => {
    // Set up all abilities
    Object.entries(ABILITIES_CONFIG).forEach(([key, config]) => {
      setAbility(key as AbilityKey, {
        ...config,
        currentCooldown: 0,
        isReady: true,
        execute: key === 'q' ? shootProjectile : () => console.log(`${config.name} executed`)
      })
    })
  }, [setAbility, scene, addProjectile])
} 