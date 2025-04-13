import { Vector3 } from 'three'

export interface EnemyState {
  id: string
  position: Vector3
  rotation: Vector3
  isAlive: boolean
  lastAttackTime: number
}

export interface EnemyConfig {
  attackCooldown: number  // in seconds
  attackRange: number
  projectileSpeed: number
}

export const DEFAULT_ENEMY_CONFIG: EnemyConfig = {
  attackCooldown: 2,     // Dispara cada 2 segundos
  attackRange: 70,       // Rango de detección y ataque
  projectileSpeed: 0.8   // Aumentamos la velocidad de los proyectiles enemigos
} 