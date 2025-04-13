import { create } from "zustand";
import { Vector3 } from "three";
import { PlayerState, PlayerStatus, PlayerConfig } from "../types/player";

const DEFAULT_PLAYER_CONFIG: PlayerConfig = {
  baseSpeed: 0.07,
  dashSpeed: 0.2,
  dashDuration: 0.3,
  flashDistance: 5,
  flashCooldown: 5,
  shieldDuration: 2,
  shieldCooldown: 8,
};

interface PlayerStore {
  state: PlayerState;
  status: PlayerStatus;
  config: PlayerConfig;
  takeDamage: () => void;
  setInvulnerable: (isInvulnerable: boolean) => void;
  setDashing: (isDashing: boolean) => void;
  setFlashing: (isFlashing: boolean) => void;
  updatePosition: (position: Vector3) => void;
  updateVelocity: (velocity: Vector3) => void;
  reset: () => void;
}

export const usePlayerStore = create<PlayerStore>(set => ({
  state: {
    isAlive: true,
    isInvulnerable: false,
    isDashing: false,
    isFlashing: false,
    position: new Vector3(0, 2.5, 0),
    velocity: new Vector3(),
  },
  status: {
    isMoving: false,
    isUsingAbility: false,
    currentAbility: null,
  },
  config: DEFAULT_PLAYER_CONFIG,

  takeDamage: () =>
    set(state => {
      if (state.state.isInvulnerable) return state;

      return {
        state: {
          ...state.state,
          isAlive: false,
        },
      };
    }),

  setInvulnerable: isInvulnerable =>
    set(state => ({
      state: {
        ...state.state,
        isInvulnerable,
      },
    })),

  setDashing: isDashing =>
    set(state => ({
      state: {
        ...state.state,
        isDashing,
      },
      status: {
        ...state.status,
        isUsingAbility: isDashing,
        currentAbility: isDashing ? "e" : null,
      },
    })),

  setFlashing: isFlashing =>
    set(state => ({
      state: {
        ...state.state,
        isFlashing,
      },
      status: {
        ...state.status,
        isUsingAbility: isFlashing,
        currentAbility: isFlashing ? "r" : null,
      },
    })),

  updatePosition: position =>
    set(state => ({
      state: {
        ...state.state,
        position,
      },
    })),

  updateVelocity: velocity =>
    set(state => ({
      state: {
        ...state.state,
        velocity,
      },
    })),

  reset: () =>
    set({
      state: {
        isAlive: true,
        isInvulnerable: false,
        isDashing: false,
        isFlashing: false,
        position: new Vector3(0, 2.5, 0),
        velocity: new Vector3(),
      },
      status: {
        isMoving: false,
        isUsingAbility: false,
        currentAbility: null,
      },
    }),
}));
