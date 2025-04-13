import { Vector3 } from 'three'

export interface Projectile {
  id: number
  position: Vector3
  direction: Vector3
}

export interface Ability {
  key: string
  name: string
  cooldown: number
  currentCooldown: number
  isReady: boolean
  execute: () => void
}

export type AbilityKey = 'q' | 'w' | 'e' | 'r' | 'd' | 'f'

export const ABILITY_KEYS: AbilityKey[] = ['q', 'w', 'e', 'r', 'd', 'f'] 