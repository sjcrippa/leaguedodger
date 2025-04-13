import { create } from "zustand";
import { Vector3 } from "three";
import { Projectile } from "../types/abilities";
import { ABILITIES_CONFIG } from "../constants/abilities";

interface AbilitiesState {
  projectiles: Projectile[];
  cooldowns: { [key: string]: number };
  addProjectile: (position: Vector3, direction: Vector3) => void;
  removeProjectile: (id: string) => void;
  useAbility: (abilityKey: string, position: Vector3, direction: Vector3) => boolean;
  update: (delta: number) => void;
}

export const useAbilitiesStore = create<AbilitiesState>((set, get) => ({
  projectiles: [],
  cooldowns: {},

  addProjectile: (position, direction) => {
    const id = Math.random().toString(36).substring(7);
    const projectile: Projectile = {
      id,
      position: position.clone(),
      direction: direction.normalize(),
      createdAt: Date.now(),
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
      get().addProjectile(position, direction);
    }

    return true;
  },

  update: delta => {
    // Clean up expired cooldowns
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
    }));
  },
}));
