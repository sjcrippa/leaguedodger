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
    moveSpeed: number // Enemy movement speed
    minEnemyDistance: number
    enemyHealth: number
    enemyDamage: number
  }
  isSpawning: boolean // Spawn control
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
  spawnInterval: 2000, // 2 seconds between spawns
  spawnMargin: 5, // Margin from map edges
  attackRange: 20, // Attack range
  attackCooldown: 2, // 2 seconds between attacks
  projectileSpeed: 0.7, // Projectile speed
  moveSpeed: 0.08, // Movement speed
  minEnemyDistance: 8, // Significantly increased
  enemyHealth: 100,
  enemyDamage: 10
}

const getRandomMapPosition = () => {
  const mapWidth = DEFAULT_GAME_CONFIG.mapSize.width
  const mapHeight = DEFAULT_GAME_CONFIG.mapSize.height
  const margin = DEFAULT_ENEMY_CONFIG.spawnMargin

  // Randomly decide which edge the enemy will appear on
  const side = Math.floor(Math.random() * 4) // 0: top, 1: right, 2: bottom, 3: left

  let x, z
  switch (side) {
    case 0: // Top
      x = Math.random() * (mapWidth - margin * 2) - (mapWidth / 2 - margin)
      z = -(mapHeight / 2) + margin
      break
    case 1: // Right
      x = (mapWidth / 2) - margin
      z = Math.random() * (mapHeight - margin * 2) - (mapHeight / 2 - margin)
      break
    case 2: // Bottom
      x = Math.random() * (mapWidth - margin * 2) - (mapWidth / 2 - margin)
      z = (mapHeight / 2) - margin
      break
    default: // Left
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

    // Increment defeated enemies counter and score
    useLevelStore.getState().incrementEnemiesDefeated();
    useGameStore.getState().incrementScore();
  },

  spawnRandomEnemy: () => {
    const { enemies, config, isSpawning, addEnemy } = get()
    const isPaused = useGameStore.getState().isPaused
    const isGameOver = useGameStore.getState().isGameOver
    const { enemiesDefeated, enemiesPerLevel } = useLevelStore.getState()

    // Calculate total enemies (defeated + current)
    const totalEnemies = enemiesDefeated + enemies.length

    // Check all conditions that prevent spawning
    if (isSpawning || 
        isPaused || 
        isGameOver || 
        totalEnemies >= enemiesPerLevel) {
      return
    }

    // Activate spawn lock
    set({ isSpawning: true })

    // Spawn enemy
    const position = getRandomMapPosition()
    addEnemy(position)

    // Schedule next spawn and release lock
    setTimeout(() => {
      set({ isSpawning: false })
      
      // Check if we can spawn another
      const currentState = get()
      const { enemiesDefeated: currentDefeated, enemiesPerLevel } = useLevelStore.getState()
      const currentEnemies = currentState.enemies.length
      const currentTotal = currentDefeated + currentEnemies
      
      // Only spawn if:
      // 1. We haven't reached the total allowed enemies per level
      // 2. Game is not paused
      // 3. Game is not over
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

      // 1. Calculate direction to player
      const directionToPlayer = new Vector3()
        .subVectors(playerPosition, enemy.position)
        .normalize()

      // 2. Calculate separation from other enemies
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
            .multiplyScalar(Math.pow((config.minEnemyDistance - distance) / config.minEnemyDistance, 3)) // Cubic force
          
          separationForce.add(awayFromOther)
        }
      })

      // Normalize separation force if there are nearby enemies
      if (nearbyEnemies > 0) {
        separationForce.divideScalar(nearbyEnemies)
      }

      // 3. Combine movement towards player and separation
      const moveDirection = new Vector3()
      
      // If enemies are very close, prioritize separation much more
      const followWeight = nearbyEnemies > 0 ? 0.2 : 0.8     // Reduced when enemies are nearby
      const separationWeight = nearbyEnemies > 0 ? 0.8 : 0.2 // Increased when enemies are nearby

      moveDirection.addVectors(
        directionToPlayer.multiplyScalar(followWeight),
        separationForce.multiplyScalar(separationWeight)
      ).normalize()

      // 4. Apply movement with adjusted speed
      const finalSpeed = nearbyEnemies > 0 ? config.moveSpeed * 1.5 : config.moveSpeed
      enemy.position.x += moveDirection.x * finalSpeed
      enemy.position.z += moveDirection.z * finalSpeed
      enemy.position.y = 3

      // 5. Rotate enemy (always facing player)
      enemy.rotation.y = Math.atan2(directionToPlayer.x, directionToPlayer.z)

      // 6. Attack logic
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
    // Clear state and ensure no pending spawns
    set({ enemies: [], isSpawning: false })
    
    // Start spawn cycle with a single initial spawn
    const { spawnRandomEnemy } = get()
    spawnRandomEnemy()
  }
})) 