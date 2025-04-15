import { Vector3 } from "three";
import { create } from "zustand";

import { PlayerState, PlayerStatus, PlayerConfig } from "../types/player";

// Store the initial position
const INITIAL_POSITION = new Vector3(0, 2.5, 0);

const DEFAULT_PLAYER_CONFIG: PlayerConfig = {
  baseSpeed: 0.15,
  dashSpeed: 0.3,
  dashDuration: 0.3,
  flashDistance: 5,
  flashCooldown: 5,
  shieldDuration: 3, // 3 seconds shield duration
  shieldCooldown: 8,
  invulnerabilityDuration: 1, // 1 second of invulnerability after taking damage
  maxHealth: 100,
  currentHealth: 100,
};

interface PlayerStore {
  state: PlayerState;
  status: PlayerStatus;
  config: PlayerConfig;
  takeDamage: () => void;
  setInvulnerable: (isInvulnerable: boolean) => void;
  setDashing: (isDashing: boolean) => void;
  setFlashing: (isFlashing: boolean) => void;
  setShielded: (isShielded: boolean) => void;
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
    isShielded: false,
    position: INITIAL_POSITION.clone(),
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
      if (state.state.isInvulnerable || state.state.isShielded) return state;

      // Reduce the health
      const newHealth = state.config.currentHealth - 100; // Fixed damage of 100 for now

      // Make the player temporarily invulnerable
      state.state.isInvulnerable = true;
      setTimeout(() => {
        set(state => ({
          state: {
            ...state.state,
            isInvulnerable: false,
          },
        }));
      }, DEFAULT_PLAYER_CONFIG.invulnerabilityDuration * 1000);

      // If the health reaches 0, the player dies
      if (newHealth <= 0) {
        return {
          state: {
            ...state.state,
            isAlive: false,
            isInvulnerable: true,
          },
          config: {
            ...state.config,
            currentHealth: 0,
          },
        };
      }

      return {
        state: {
          ...state.state,
          isInvulnerable: true,
        },
        config: {
          ...state.config,
          currentHealth: newHealth,
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

  setShielded: isShielded =>
    set(state => {
      const newState = {
        state: {
          ...state.state,
          isShielded,
        },
        status: {
          ...state.status,
          isUsingAbility: isShielded,
          currentAbility: isShielded ? "w" : null,
        },
      };

      // Si se activa el escudo, programar su desactivación
      if (isShielded) {
        setTimeout(() => {
          set(state => ({
            state: {
              ...state.state,
              isShielded: false,
            },
            status: {
              ...state.status,
              isUsingAbility: false,
              currentAbility: null,
            },
          }));
        }, DEFAULT_PLAYER_CONFIG.shieldDuration * 1000);
      }

      return newState;
    }),

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
        isShielded: false,
        position: INITIAL_POSITION.clone(),
        velocity: new Vector3(),
      },
      status: {
        isMoving: false,
        isUsingAbility: false,
        currentAbility: null,
      },
      config: DEFAULT_PLAYER_CONFIG,
    }),
}));
