import { create } from 'zustand'
import { Vector3 } from 'three'
import { EnemyState } from '../types/enemy'
import { DEFAULT_GAME_CONFIG } from '../constants/gameConfig'
import { useAbilitiesStore } from './abilitiesStore'
import { useGameStore } from './gameStore'

interface EnemyStore {
  enemies: EnemyState[]
  config: {
    maxEnemies: number
    spawnInterval: number
    spawnMargin: number
    attackRange: number
    attackCooldown: number
    projectileSpeed: number
  }
  addEnemy: (position: Vector3) => void
  removeEnemy: (id: string) => void
  spawnRandomEnemy: () => void
  updateEnemies: (playerPosition: Vector3) => void
  reset: () => void
}

const DEFAULT_ENEMY_CONFIG = {
  maxEnemies: 5,
  spawnInterval: 2000, // 2 segundos entre spawns
  spawnMargin: 5, // Margen desde los bordes del mapa
  attackRange: 30, // Aumentado para mejor alcance
  attackCooldown: 2, // 2 segundos entre ataques
  projectileSpeed: 0.8 // Velocidad del proyectil
}

const getRandomMapPosition = () => {
  const mapWidth = DEFAULT_GAME_CONFIG.mapSize.width
  const mapHeight = DEFAULT_GAME_CONFIG.mapSize.height
  const margin = DEFAULT_ENEMY_CONFIG.spawnMargin

  // Decidir aleatoriamente en qué borde aparecerá el enemigo
  const side = Math.floor(Math.random() * 4) // 0: arriba, 1: derecha, 2: abajo, 3: izquierda

  let x, z
  switch (side) {
    case 0: // Arriba
      x = Math.random() * (mapWidth - margin * 2) - (mapWidth / 2 - margin)
      z = -(mapHeight / 2) + margin
      break
    case 1: // Derecha
      x = (mapWidth / 2) - margin
      z = Math.random() * (mapHeight - margin * 2) - (mapHeight / 2 - margin)
      break
    case 2: // Abajo
      x = Math.random() * (mapWidth - margin * 2) - (mapWidth / 2 - margin)
      z = (mapHeight / 2) - margin
      break
    default: // Izquierda
      x = -(mapWidth / 2) + margin
      z = Math.random() * (mapHeight - margin * 2) - (mapHeight / 2 - margin)
      break
  }

  return new Vector3(x, 3, z)
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

    // Intentar spawnear un nuevo enemigo después de un delay
    setTimeout(() => {
      const { enemies, config, spawnRandomEnemy } = get()
      if (enemies.length < config.maxEnemies) {
        spawnRandomEnemy()
      }
    }, get().config.spawnInterval)
  },

  spawnRandomEnemy: () => {
    const { enemies, config, addEnemy } = get()
    if (enemies.length < config.maxEnemies) {
      const position = getRandomMapPosition()
      addEnemy(position)
    }
  },

  updateEnemies: (playerPosition) => {
    const now = Date.now()
    const { enemies, config } = get()
    const addProjectile = useAbilitiesStore.getState().addProjectile
    const enemyProjectilesEnabled = useGameStore.getState().enemyProjectilesEnabled
    const updatedEnemies = [...enemies]

    updatedEnemies.forEach(enemy => {
      if (!enemy.isAlive) return

      // Calcular dirección hacia el jugador
      const directionToPlayer = new Vector3()
        .subVectors(playerPosition, enemy.position)
        .normalize()

      // Actualizar rotación del enemigo
      enemy.rotation.y = Math.atan2(directionToPlayer.x, directionToPlayer.z)

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

    set({ enemies: updatedEnemies })
  },

  reset: () => {
    set({ enemies: [] })
    
    // Spawnear enemigos iniciales gradualmente
    const spawnEnemiesGradually = (remaining: number) => {
      if (remaining > 0) {
        const { spawnRandomEnemy } = get()
        spawnRandomEnemy()
        setTimeout(() => spawnEnemiesGradually(remaining - 1), DEFAULT_ENEMY_CONFIG.spawnInterval)
      }
    }

    spawnEnemiesGradually(DEFAULT_ENEMY_CONFIG.maxEnemies)
  }
})) 