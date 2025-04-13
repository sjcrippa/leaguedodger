import { GameConfig } from "../types/game";

// Default game configuration
export const DEFAULT_GAME_CONFIG: GameConfig = {
  mapSize: {
    width: 60, // Width of the game map
    height: 40, // Height of the game map
  },
  playerSpeed: 0.2,
  difficulty: "medium",
  collision: {
    playerRadius: 0.5, // Half of player's width/height
    projectileRadius: 0.25, // Half of projectile's width/height
    minCollisionDistance: 0.75, // Sum of both radii
  },
};

// Game physics constants
export const PHYSICS = {
  GRAVITY: 9.81,
  FRICTION: 0.1,
  MAX_VELOCITY: 10,
};

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
};
