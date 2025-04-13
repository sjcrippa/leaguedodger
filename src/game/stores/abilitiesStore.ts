import { create } from "zustand";
import { Vector3 } from "three";
import { Ability, Projectile, AbilityKey } from "../types/abilities";
import { ABILITIES_CONFIG } from "../constants/abilities";

interface AbilitiesState {
  projectiles: Projectile[];
  cooldowns: { [key: string]: number };
  addProjectile: (position: Vector3, direction: Vector3, source: 'player' | 'enemy', speed?: number) => void;
  removeProjectile: (id: string) => void;
  useAbility: (abilityKey: string, position: Vector3, direction: Vector3) => boolean;
  castAbility: (abilityKey: AbilityKey, player: THREE.Object3D) => void;
  update: (delta: number) => void;
}

export const useAbilitiesStore = create<AbilitiesState>((set, get) => ({
  projectiles: [],
  cooldowns: {},

  addProjectile: (position, direction, source, speed = 0.8) => {
    const id = Math.random().toString(36).substring(7);
    const projectile: Projectile = {
      id,
      position: position.clone(),
      direction: direction.normalize(),
      createdAt: Date.now(),
      source,
      speed
    };
    set(state => ({ projectiles: [...state.projectiles, projectile] }));
  },

  removeProjectile: id => {
    set(state => ({
      projectiles: state.projectiles.filter(p => p.id !== id),
    }));
  },

  useAbility: (abilityKey, position, direction) => {
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

    // Create projectile for Q ability
    if (abilityKey === "q") {
      get().addProjectile(position, direction, 'player');
    }

    return true;
  },

  castAbility: (abilityKey, player) => {
    // Get player's forward direction based on rotation
    const direction = new Vector3(0, 0, 1)
      .applyQuaternion(player.quaternion)
      .normalize();

    // Create projectile closer to the player
    const startPosition = player.position.clone().add(direction.clone().multiplyScalar(1.5));

    // Use ability with position and direction
    get().useAbility(abilityKey, startPosition, direction);
  },

  update: (delta) => {
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
        position: projectile.position.clone().add(
          projectile.direction.clone().multiplyScalar(delta * projectile.speed * 30)
        )
      }))
    }));
  }
}));
