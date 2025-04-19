import { Vector3 } from "three";
import { create } from "zustand";

import { usePlayerStore } from "./playerStore";
import { useGameStore } from "./gameStore";
import { ABILITIES_CONFIG } from "../constants/abilities";
import { Projectile, AbilityKey } from "../types/abilities";

const INITIAL_COOLDOWNS = {
  q: 0,
  w: 0,
  e: 0,
  r: 0,
  d: 0,
  f: 0,
};

interface AbilitiesState {
  projectiles: Projectile[];
  cooldowns: { [key: string]: number };
  addProjectile: (
    position: Vector3,
    direction: Vector3,
    source: "player" | "enemy",
    speed?: number
  ) => void;
  removeProjectile: (id: string) => void;
  useAbility: (abilityKey: string, position: Vector3, direction: Vector3, player: THREE.Object3D) => boolean;
  castAbility: (abilityKey: AbilityKey, player: THREE.Object3D) => void;
  update: (delta: number) => void;
  reset: () => void;
}

export const useAbilitiesStore = create<AbilitiesState>((set, get) => ({
  projectiles: [],
  cooldowns: INITIAL_COOLDOWNS,

  addProjectile: (position, direction, source, speed = 0.8) => {
    // No allow player projectiles during countdown
    if (source === "player" && useGameStore.getState().countdown !== null) return;

    const id = Math.random().toString(36).substring(7);
    const projectile: Projectile = {
      id,
      position: position.clone(),
      direction: direction.normalize(),
      createdAt: Date.now(),
      source,
      speed,
    };
    set(state => ({ projectiles: [...state.projectiles, projectile] }));
  },

  removeProjectile: id => {
    set(state => ({
      projectiles: state.projectiles.filter(p => p.id !== id),
    }));
  },

  reset: () => {
    set({
      projectiles: [],
      cooldowns: INITIAL_COOLDOWNS,
    });
  },

  useAbility: (abilityKey, position, direction, player) => {
    // Avoid using abilities during countdown
    if (useGameStore.getState().countdown !== null) return false;

    const { cooldowns } = get();
    const ability = ABILITIES_CONFIG[abilityKey];
    if (!ability) return false;

    const now = Date.now();
    const lastUsed = cooldowns[abilityKey] || 0;
    const cooldownMs = ability.cooldown * 1000; // Convert seconds to milliseconds
    const cooldownRemaining = lastUsed + cooldownMs - now;

    if (cooldownRemaining > 0) {
      console.log(
        `Ability ${ability.name} on cooldown for ${(cooldownRemaining / 1000).toFixed(1)}s`
      );
      return false;
    }

    // Update cooldown
    set(state => ({
      cooldowns: {
        ...state.cooldowns,
        [abilityKey]: now,
      },
    }));

    // Handle different abilities
    switch (abilityKey) {
      case "q":
        get().addProjectile(position, direction, "player");
        break;
      case "w":
        usePlayerStore.getState().setShielded(true);
        break;
      case "e": {
        const playerStore = usePlayerStore.getState();
        const playerPosition = playerStore.state.position;

        // Use provided direction by castAbility
        const targetPosition = playerPosition.clone().add(direction.multiplyScalar(10));

        // Apply dash with animation
        playerStore.setDashing(true);

        // Animation of fast movement
        const startTime = Date.now();
        const duration = 300; // 300ms for the dash
        const startPosition = playerPosition.clone();

        const animateDash = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);

          // Smooth interpolation using easeOutQuad
          const easeProgress = 1 - Math.pow(1 - progress, 2);

          // Calculate intermediate position
          const currentPosition = startPosition.clone().lerp(targetPosition, easeProgress);
          playerStore.updatePosition(currentPosition);
          if (player) {
            player.position.copy(currentPosition);
          }

          if (progress < 1) {
            requestAnimationFrame(animateDash);
          } else {
            playerStore.setDashing(false);
          }
        };

        requestAnimationFrame(animateDash);
        break;
      }
      case "r": {
        const playerStore = usePlayerStore.getState();
        const playerPosition = playerStore.state.position;

        // Use provided direction by castAbility
        const targetPosition = playerPosition.clone().add(direction.multiplyScalar(12));

        // First activate the flash state
        playerStore.setFlashing(true);

        // Small delay to ensure particles are shown
        setTimeout(() => {
          // Then update the position
          playerStore.updatePosition(targetPosition);
          
          // Force an immediate mesh update
          if (player) {
            player.position.copy(targetPosition);
          }

          // Finally deactivate the state after the animation
          setTimeout(() => {
            playerStore.setFlashing(false);
          }, 100);
        }, 50);

        break;
      }
      default:
        break;
    }

    return true;
  },

  castAbility: (abilityKey, player) => {
    // Prevent casting abilities during countdown
    if (useGameStore.getState().countdown !== null) return;

    // Get player's forward direction based on rotation
    const direction = new Vector3(0, 0, 1).applyQuaternion(player.quaternion).normalize();

    // Create projectile closer to the player
    const startPosition = player.position.clone().add(direction.clone().multiplyScalar(1.5));

    // Use ability with position and direction
    get().useAbility(abilityKey, startPosition, direction, player);
  },

  update: delta => {
    // No update during countdown
    if (useGameStore.getState().countdown !== null) return;

    // Clean up expired cooldowns and update projectile positions
    const now = Date.now();
    set(state => ({
      cooldowns: Object.entries(state.cooldowns).reduce((acc, [key, time]) => {
        const ability = ABILITIES_CONFIG[key];
        if (!ability) return acc;

        const cooldownMs = ability.cooldown * 1000;
        if (now - time < cooldownMs) {
          acc[key] = time;
        }
        return acc;
      }, {} as { [key: string]: number }),

      // Update projectile positions based on their individual speeds
      projectiles: state.projectiles.map(projectile => ({
        ...projectile,
        position: projectile.position
          .clone()
          .add(projectile.direction.clone().multiplyScalar(delta * projectile.speed * 30)),
      })),
    }));
  },
}));
