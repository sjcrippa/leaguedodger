import { Vector3 } from "three";

export interface FlashParticles {
  count: number;
  positions: Vector3[];
  velocities: Vector3[];
  lifetimes: number[];
  maxLifetime: number;
  spawnRate: number;
  spread: number;
  speed: number;
}

export interface DashTrail {
  positions: Vector3[];
  maxLength: number;
}

export interface PlayerState {
  isAlive: boolean;
  isInvulnerable: boolean;
  isDashing: boolean;
  isFlashing: boolean;
  isShielded: boolean;
  position: Vector3;
  velocity: Vector3;
  flashParticles: FlashParticles | null;
  dashTrail: DashTrail | null;
}

export interface PlayerStatus {
  isMoving: boolean;
  isUsingAbility: boolean;
  currentAbility: string | null;
}

export interface PlayerConfig {
  baseSpeed: number;
  dashSpeed: number;
  dashDuration: number;
  flashDistance: number;
  flashCooldown: number;
  shieldDuration: number;
  shieldCooldown: number;
  invulnerabilityDuration: number;
  maxHealth: number;
  currentHealth: number;
  flashParticles: FlashParticles;
  dashTrail: DashTrail;
}
