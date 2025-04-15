import { Vector3 } from "three";
import { create } from "zustand";

import { PlayerState, PlayerStatus, PlayerConfig, DashParticles } from "../types/player";

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
  dashParticles: {
    count: 30,
    positions: [] as Vector3[],
    velocities: [] as Vector3[],
    lifetimes: [] as number[],
    maxLifetime: 0.5,
    spawnRate: 0.01,
    spread: 0.8,
    speed: 3,
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
  updateDashParticles: (delta: number) => void;
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
    dashParticles: null,
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
            dashParticles: null,
          },
          status: {
            ...state.status,
            isUsingAbility: false,
            currentAbility: null,
          },
        };
      }

      // If dash is active, initialize the particles
      const baseConfig = state.config.dashParticles;
      const dashParticles: DashParticles = {
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
      for (let i = 0; i < dashParticles.count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * dashParticles.spread;
        const x = Math.cos(angle) * radius;
        const y = Math.random() * dashParticles.spread - dashParticles.spread / 2;
        const z = Math.sin(angle) * radius;

        dashParticles.positions.push(new Vector3(x, y, z));
        dashParticles.velocities.push(
          new Vector3(
            (Math.random() - 0.5) * dashParticles.speed,
            (Math.random() - 0.5) * dashParticles.speed,
            (Math.random() - 0.5) * dashParticles.speed
          )
        );
        dashParticles.lifetimes.push(dashParticles.maxLifetime);
      }

      return {
        state: {
          ...state.state,
          isDashing: true,
          dashParticles,
        },
        status: {
          ...state.status,
          isUsingAbility: true,
          currentAbility: "e",
        },
      };
    }),

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
        dashParticles: null,
      },
      status: {
        isMoving: false,
        isUsingAbility: false,
        currentAbility: null,
      },
      config: DEFAULT_PLAYER_CONFIG,
    }),

  updateDashParticles: (delta: number) => {
    const state = get().state;
    if (!state.dashParticles) return;

    const currentParticles = state.dashParticles;
    const newPositions: Vector3[] = [];
    const newVelocities: Vector3[] = [];
    const newLifetimes: number[] = [];

    // Update existing particles
    for (let i = 0; i < currentParticles.positions.length; i++) {
      const lifetime = currentParticles.lifetimes[i] - delta;
      if (lifetime > 0) {
        // Reutilizar vectores temporales
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

      // Reutilizar vector temporal para la posición
      tempVector.set(
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * currentParticles.spread,
        Math.sin(angle) * radius
      );

      // Reutilizar vector temporal para la velocidad
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
        dashParticles: {
          ...currentParticles,
          positions: newPositions,
          velocities: newVelocities,
          lifetimes: newLifetimes,
        },
      },
    }));
  },
}));
