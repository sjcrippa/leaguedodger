import { create } from 'zustand'
import { Vector3 } from 'three'
import { EnemyState } from '../types/enemy'
import { DEFAULT_GAME_CONFIG } from '../constants/gameConfig'
import { useAbilitiesStore } from './abilitiesStore'
import { useGameStore } from './gameStore'
import { useLevelStore } from './levelStore'

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
    minEnemyDistance: number
    enemyHealth: number
    enemyDamage: number
  }
  isSpawning: boolean // Control de spawn
  addEnemy: (position: Vector3) => void
  removeEnemy: (id: string) => void
  spawnRandomEnemy: () => void
  updateEnemies: (playerPosition: Vector3) => void
  reset: () => void
  updateConfig: (config: {
    enemiesPerLevel: number;
    enemySpeed: number;
    enemyHealth: number;
    enemyDamage: number;
    spawnInterval: number;
  }) => void
}

const DEFAULT_ENEMY_CONFIG = {
  maxEnemies: 5,
  spawnInterval: 2000, // 2 segundos entre spawns
  spawnMargin: 5, // Margen desde los bordes del mapa
  attackRange: 20, // Rango de ataque
  attackCooldown: 2, // 2 segundos entre ataques
  projectileSpeed: 0.7, // Velocidad del proyectil
  moveSpeed: 0.08, // Velocidad de movimiento
  minEnemyDistance: 8, // Aumentado significativamente
  enemyHealth: 100,
  enemyDamage: 10
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
  isSpawning: false,

  updateConfig: (newConfig) => {
    set({
      config: {
        ...DEFAULT_ENEMY_CONFIG,
        maxEnemies: newConfig.enemiesPerLevel,
        spawnInterval: newConfig.spawnInterval,
        moveSpeed: newConfig.enemySpeed,
        enemyHealth: newConfig.enemyHealth,
        enemyDamage: newConfig.enemyDamage
      }
    });
  },

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

    // Incrementar el contador de enemigos derrotados
    useLevelStore.getState().incrementEnemiesDefeated();
  },

  spawnRandomEnemy: () => {
    const { enemies, config, isSpawning, addEnemy } = get()
    const isPaused = useGameStore.getState().isPaused
    const isGameOver = useGameStore.getState().isGameOver
    const { enemiesDefeated, enemiesPerLevel } = useLevelStore.getState()

    // Calcular el total de enemigos (derrotados + actuales)
    const totalEnemies = enemiesDefeated + enemies.length

    // Verificar todas las condiciones que impiden el spawn
    if (isSpawning || 
        isPaused || 
        isGameOver || 
        totalEnemies >= enemiesPerLevel) {
      return
    }

    // Activar el lock de spawn
    set({ isSpawning: true })

    // Spawnear el enemigo
    const position = getRandomMapPosition()
    addEnemy(position)

    // Programar el próximo spawn y liberar el lock
    setTimeout(() => {
      set({ isSpawning: false })
      
      // Verificar si podemos spawnear otro
      const currentState = get()
      const { enemiesDefeated: currentDefeated, enemiesPerLevel } = useLevelStore.getState()
      const currentEnemies = currentState.enemies.length
      const currentTotal = currentDefeated + currentEnemies
      
      // Solo spawnear si:
      // 1. No hemos alcanzado el total de enemigos permitidos por nivel
      // 2. El juego no está pausado
      // 3. El juego no ha terminado
      if (currentTotal < enemiesPerLevel && 
          !useGameStore.getState().isPaused && 
          !useGameStore.getState().isGameOver) {
        currentState.spawnRandomEnemy()
      }
    }, config.spawnInterval)
  },

  updateEnemies: (playerPosition) => {
    const now = Date.now()
    const { enemies, config } = get()
    const addProjectile = useAbilitiesStore.getState().addProjectile
    const enemyProjectilesEnabled = useGameStore.getState().enemyProjectilesEnabled
    const isPaused = useGameStore.getState().isPaused
    const updatedEnemies = [...enemies]

    if (isPaused) return

    updatedEnemies.forEach(enemy => {
      if (!enemy.isAlive) return

      // 1. Calcular dirección hacia el jugador
      const directionToPlayer = new Vector3()
        .subVectors(playerPosition, enemy.position)
        .normalize()

      // 2. Calcular separación de otros enemigos
      const separationForce = new Vector3()
      let nearbyEnemies = 0

      updatedEnemies.forEach(otherEnemy => {
        if (otherEnemy.id === enemy.id || !otherEnemy.isAlive) return

        const distance = enemy.position.distanceTo(otherEnemy.position)
        if (distance < config.minEnemyDistance) {
          nearbyEnemies++
          const awayFromOther = new Vector3()
            .subVectors(enemy.position, otherEnemy.position)
            .normalize()
            .multiplyScalar(Math.pow((config.minEnemyDistance - distance) / config.minEnemyDistance, 3)) // Fuerza cúbica
          
          separationForce.add(awayFromOther)
        }
      })

      // Normalizar la fuerza de separación si hay enemigos cercanos
      if (nearbyEnemies > 0) {
        separationForce.divideScalar(nearbyEnemies)
      }

      // 3. Combinar movimiento hacia el jugador y separación
      const moveDirection = new Vector3()
      
      // Si hay enemigos muy cerca, priorizar mucho más la separación
      const followWeight = nearbyEnemies > 0 ? 0.2 : 0.8     // Reducido cuando hay enemigos cerca
      const separationWeight = nearbyEnemies > 0 ? 0.8 : 0.2 // Aumentado cuando hay enemigos cerca

      moveDirection.addVectors(
        directionToPlayer.multiplyScalar(followWeight),
        separationForce.multiplyScalar(separationWeight)
      ).normalize()

      // 4. Aplicar movimiento con velocidad ajustada
      const finalSpeed = nearbyEnemies > 0 ? config.moveSpeed * 1.5 : config.moveSpeed
      enemy.position.x += moveDirection.x * finalSpeed
      enemy.position.z += moveDirection.z * finalSpeed
      enemy.position.y = 3

      // 5. Rotar al enemigo (siempre mirando al jugador)
      enemy.rotation.y = Math.atan2(directionToPlayer.x, directionToPlayer.z)

      // 6. Lógica de ataque
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
    // Limpiar estado y asegurarnos de que no hay spawns pendientes
    set({ enemies: [], isSpawning: false })
    
    // Iniciar el ciclo de spawn con un único spawn inicial
    const { spawnRandomEnemy } = get()
    spawnRandomEnemy()
  }
})) 