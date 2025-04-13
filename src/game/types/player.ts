import { Vector3 } from 'three'

export type PlayerState = {
  isAlive: boolean
  isInvulnerable: boolean
  isDashing: boolean
  isFlashing: boolean
  position: Vector3
  velocity: Vector3
}

export type PlayerStatus = {
  isMoving: boolean
  isUsingAbility: boolean
  currentAbility: string | null
}

export type PlayerConfig = {
  baseSpeed: number
  dashSpeed: number
  dashDuration: number
  flashDistance: number
  flashCooldown: number
  shieldDuration: number
  shieldCooldown: number
} 