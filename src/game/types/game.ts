// Position type for 3D coordinates
export type Position = {
  x: number
  y: number
  z: number
}

// Velocity type for movement
export type Velocity = {
  x: number
  y: number
  z: number
}

// Base entity type that all game objects will extend
export interface Entity {
  id: string
  position: Position
  velocity: Velocity
  isActive: boolean
}

// Player specific type
export interface Player extends Entity {
  type: 'player'
  speed: number
}

// Game configuration type
export interface GameConfig {
  mapSize: {
    width: number
    height: number
  }
  playerSpeed: number
  difficulty: 'easy' | 'medium' | 'hard'
  collision: {
    playerRadius: number
    projectileRadius: number
    minCollisionDistance: number
  }
} 