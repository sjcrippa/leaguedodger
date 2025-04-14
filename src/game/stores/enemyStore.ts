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
    moveSpeed: number // Velocidad de movimiento del enemigo
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
  attackRange: 20, // Rango de ataque
  attackCooldown: 2, // 2 segundos entre ataques
  projectileSpeed: 0.8, // Velocidad del proyectil
  moveSpeed: 0.1 // Velocidad de movimiento
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

      // 1. Calcular dirección hacia el jugador
      const directionToPlayer = new Vector3()
        .subVectors(playerPosition, enemy.position)
        .normalize()

      // 2. Mover al enemigo hacia el jugador (sin límite de distancia)
      enemy.position.x += directionToPlayer.x * config.moveSpeed
      enemy.position.z += directionToPlayer.z * config.moveSpeed
      enemy.position.y = 3 // Mantener altura constante

      // 3. Rotar al enemigo para que mire al jugador
      enemy.rotation.y = Math.atan2(directionToPlayer.x, directionToPlayer.z)

      // 4. Verificar si puede atacar
      const distanceToPlayer = enemy.position.distanceTo(playerPosition)
      const timeSinceLastAttack = (now - enemy.lastAttackTime) / 1000

      if (enemyProjectilesEnabled && 
          distanceToPlayer <= config.attackRange && 
          timeSinceLastAttack >= config.attackCooldown) {
        enemy.lastAttackTime = now
        
        const projectileStart = enemy.position.clone().add(
          directionToPlayer.clone().multiplyScalar(1.5)
        )
        
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