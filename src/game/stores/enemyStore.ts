import { create } from 'zustand'
import { Vector3 } from 'three'
import { EnemyState, EnemyConfig, DEFAULT_ENEMY_CONFIG } from '../types/enemy'
import { useAbilitiesStore } from './abilitiesStore'
import { useGameStore } from './gameStore'

interface EnemyStore {
  enemies: EnemyState[]
  config: EnemyConfig
  addEnemy: (position: Vector3) => void
  removeEnemy: (id: string) => void
  updateEnemies: (playerPosition: Vector3) => void
}

export const useEnemyStore = create<EnemyStore>((set, get) => ({
  enemies: [],
  config: DEFAULT_ENEMY_CONFIG,

  addEnemy: (position) => {
    const id = Math.random().toString(36).substr(2, 9)
    const enemy: EnemyState = {
      id,
      position: position.clone(),
      rotation: new Vector3(),
      isAlive: true,
      lastAttackTime: 0
    }
    set(state => ({ enemies: [...state.enemies, enemy] }))
  },

  removeEnemy: (id) => {
    set(state => ({
      enemies: state.enemies.filter(enemy => enemy.id !== id)
    }))
  },

  updateEnemies: (playerPosition) => {
    const now = Date.now()
    const { enemies, config } = get()
    const addProjectile = useAbilitiesStore.getState().addProjectile
    const enemyProjectilesEnabled = useGameStore.getState().enemyProjectilesEnabled

    enemies.forEach(enemy => {
      if (!enemy.isAlive) return

      // Calcular dirección hacia el jugador
      const directionToPlayer = new Vector3()
        .subVectors(playerPosition, enemy.position)
        .normalize()

      // Actualizar rotación del enemigo
      const angle = Math.atan2(directionToPlayer.x, directionToPlayer.z)
      enemy.rotation.y = angle

      // Verificar si el jugador está en rango y si podemos atacar
      const distanceToPlayer = enemy.position.distanceTo(playerPosition)
      const timeSinceLastAttack = (now - enemy.lastAttackTime) / 1000 // convertir a segundos

      if (enemyProjectilesEnabled && 
          distanceToPlayer <= config.attackRange && 
          timeSinceLastAttack >= config.attackCooldown) {
        // Disparar al jugador
        enemy.lastAttackTime = now
        
        // Crear proyectil desde una posición ligeramente adelantada del enemigo
        const projectileStart = enemy.position.clone().add(
          directionToPlayer.clone().multiplyScalar(1.5)
        )
        
        // Añadir el proyectil con la configuración del enemigo
        addProjectile(
          projectileStart,
          directionToPlayer,
          'enemy',
          config.projectileSpeed
        )
      }
    })

    set({ enemies: [...enemies] })
  }
})) 