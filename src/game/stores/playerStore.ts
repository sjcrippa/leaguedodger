import { Vector3 } from "three";
import { create } from "zustand";

import { PlayerState, PlayerStatus, PlayerConfig, FlashParticles, DashTrail } from "../types/player";

// Store the initial position
const INITIAL_POSITION = new Vector3(0, 2.5, 0);

const DEFAULT_PLAYER_CONFIG: PlayerConfig = {
  baseSpeed: 0.15,
  dashSpeed: 0.3,
  dashDuration: 0.3,
  flashDistance: 5,
  flashCooldown: 5,
  shieldDuration: 2,
  shieldCooldown: 6,
  invulnerabilityDuration: 1,
  maxHealth: 100,
  currentHealth: 100,
  flashParticles: {
    count: 30,
    positions: [] as Vector3[],
    velocities: [] as Vector3[],
    lifetimes: [] as number[],
    maxLifetime: 0.5,
    spawnRate: 0.01,
    spread: 0.8,
    speed: 3,
  },
  dashTrail: {
    positions: [] as Vector3[],
    maxLength: 15,
  },
};

// Reusable vectors for calculations
const tempVector = new Vector3();
const tempDirection = new Vector3();

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
  updateFlashParticles: (delta: number) => void;
  updateDashTrail: (position: Vector3) => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  state: {
    isAlive: true,
    isInvulnerable: false,
    isDashing: false,
    isFlashing: false,
    isShielded: false,
    position: INITIAL_POSITION.clone(),
    velocity: new Vector3(),
    flashParticles: null,
    dashTrail: null,
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
    set(state => {
      if (!isDashing) {
        return {
          state: {
            ...state.state,
            isDashing: false,
            dashTrail: null,
          },
          status: {
            ...state.status,
            isUsingAbility: false,
            currentAbility: null,
          },
        };
      }

      // Initialize dash trail
      const dashTrail: DashTrail = {
        positions: [state.state.position.clone()],
        maxLength: state.config.dashTrail.maxLength,
      };

      return {
        state: {
          ...state.state,
          isDashing: true,
          dashTrail,
        },
        status: {
          ...state.status,
          isUsingAbility: true,
          currentAbility: "e",
        },
      };
    }),

  setFlashing: isFlashing =>
    set(state => {
      if (!isFlashing) {
        return {
          state: {
            ...state.state,
            isFlashing: false,
            flashParticles: null,
          },
          status: {
            ...state.status,
            isUsingAbility: false,
            currentAbility: null,
          },
        };
      }

      // If flash is active, initialize the particles
      const baseConfig = state.config.flashParticles;
      const flashParticles: FlashParticles = {
        count: baseConfig.count,
        maxLifetime: baseConfig.maxLifetime,
        spawnRate: baseConfig.spawnRate,
        spread: baseConfig.spread,
        speed: baseConfig.speed,
        positions: [],
        velocities: [],
        lifetimes: [],
      };

      // Generate initial particles
      for (let i = 0; i < flashParticles.count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * flashParticles.spread;
        const x = Math.cos(angle) * radius;
        const y = Math.random() * flashParticles.spread - flashParticles.spread / 2;
        const z = Math.sin(angle) * radius;

        flashParticles.positions.push(new Vector3(x, y, z));
        flashParticles.velocities.push(
          new Vector3(
            (Math.random() - 0.5) * flashParticles.speed,
            (Math.random() - 0.5) * flashParticles.speed,
            (Math.random() - 0.5) * flashParticles.speed
          )
        );
        flashParticles.lifetimes.push(flashParticles.maxLifetime);
      }

      return {
        state: {
          ...state.state,
          isFlashing: true,
          flashParticles,
        },
        status: {
          ...state.status,
          isUsingAbility: true,
          currentAbility: "r",
        },
      };
    }),

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

      // If the shield is activated, program its deactivation
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
        flashParticles: null,
        dashTrail: null,
      },
      status: {
        isMoving: false,
        isUsingAbility: false,
        currentAbility: null,
      },
      config: DEFAULT_PLAYER_CONFIG,
    }),

  updateFlashParticles: (delta: number) => {
    const state = get().state;
    if (!state.flashParticles) return;

    const currentParticles = state.flashParticles;
    const newPositions: Vector3[] = [];
    const newVelocities: Vector3[] = [];
    const newLifetimes: number[] = [];

    // Update existing particles
    for (let i = 0; i < currentParticles.positions.length; i++) {
      const lifetime = currentParticles.lifetimes[i] - delta;
      if (lifetime > 0) {
        tempVector.copy(currentParticles.velocities[i]).multiplyScalar(delta);
        newPositions.push(currentParticles.positions[i].clone().add(tempVector));
        newVelocities.push(currentParticles.velocities[i]);
        newLifetimes.push(lifetime);
      }
    }

    // Generate new particles more efficiently
    const newParticlesCount = Math.floor(delta / currentParticles.spawnRate);
    for (let i = 0; i < newParticlesCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * currentParticles.spread;

      tempVector.set(
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * currentParticles.spread,
        Math.sin(angle) * radius
      );

      tempDirection.set(
        (Math.random() - 0.5) * currentParticles.speed,
        (Math.random() - 0.5) * currentParticles.speed,
        (Math.random() - 0.5) * currentParticles.speed
      );

      newPositions.push(tempVector.clone());
      newVelocities.push(tempDirection.clone());
      newLifetimes.push(currentParticles.maxLifetime);
    }

    set(state => ({
      state: {
        ...state.state,
        flashParticles: {
          ...currentParticles,
          positions: newPositions,
          velocities: newVelocities,
          lifetimes: newLifetimes,
        },
      },
    }));
  },

  updateDashTrail: (position: Vector3) => {
    set(state => {
      if (!state.state.dashTrail) return state;

      const newPositions = [...state.state.dashTrail.positions, position.clone()];
      if (newPositions.length > state.state.dashTrail.maxLength) {
        newPositions.shift();
      }

      return {
        state: {
          ...state.state,
          dashTrail: {
            ...state.state.dashTrail,
            positions: newPositions,
          },
        },
      };
    });
  },
}));
