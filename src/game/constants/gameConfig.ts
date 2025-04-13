import { GameConfig } from '../types/game'

// Default game configuration
export const DEFAULT_GAME_CONFIG: GameConfig = {
  mapSize: {
    width: 30,  // Width of the game map
    height: 20, // Height of the game map
  },
  playerSpeed: 0.2,
  difficulty: 'medium',
}

// Game physics constants
export const PHYSICS = {
  GRAVITY: 9.81,
  FRICTION: 0.1,
  MAX_VELOCITY: 10,
}

// Game difficulty settings
export const DIFFICULTY_SETTINGS = {
  easy: {
    obstacleSpeed: 0.1,
    obstacleSpawnRate: 2000, // ms
    scoreMultiplier: 1,
  },
  medium: {
    obstacleSpeed: 0.2,
    obstacleSpawnRate: 1500,
    scoreMultiplier: 2,
  },
  hard: {
    obstacleSpeed: 0.3,
    obstacleSpawnRate: 1000,
    scoreMultiplier: 3,
  },
} 