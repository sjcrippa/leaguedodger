import { Ability } from '../types/abilities'

export const ABILITIES_CONFIG: Record<string, Omit<Ability, 'execute' | 'currentCooldown' | 'isReady'>> = {
  q: {
    key: 'q',
    name: 'Projectile Shot',
    cooldown: 1
  },
  w: {
    key: 'w',
    name: 'W Ability',
    cooldown: 8
  },
  e: {
    key: 'e',
    name: 'E Ability',
    cooldown: 10
  },
  r: {
    key: 'r',
    name: 'R Ability',
    cooldown: 30
  },
  d: {
    key: 'd',
    name: 'D/F Ability',
    cooldown: 15
  }
} 