import { create } from "zustand";

import { Ability, Projectile } from "../types/abilities";

interface AbilitiesState {
  abilities: Record<string, Ability>;
  projectiles: Projectile[];
  setAbility: (key: string, ability: Ability) => void;
  useAbility: (key: string) => void;
  updateCooldowns: (delta: number) => void;
  addProjectile: (projectile: Projectile) => void;
  removeProjectile: (id: number) => void;
}

export const useAbilitiesStore = create<AbilitiesState>((set, get) => ({
  abilities: {},
  projectiles: [],

  setAbility: (key: string, ability: Ability) =>
    set(state => ({
      abilities: {
        ...state.abilities,
        [key]: ability,
      },
    })),

  useAbility: (key: string) => {
    const state = get();
    const ability = state.abilities[key];

    if (ability && ability.isReady) {
      console.log(`Using ability: ${ability.name}`);
      ability.execute();

      set(state => ({
        abilities: {
          ...state.abilities,
          [key]: {
            ...ability,
            currentCooldown: ability.cooldown,
            isReady: false,
          },
        },
      }));
    } else {
      console.log(
        `Ability ${key} is on cooldown: ${ability?.currentCooldown?.toFixed(2)}s remaining`
      );
    }
  },

  updateCooldowns: (delta: number) =>
    set(state => {
      const updatedAbilities = { ...state.abilities };

      Object.keys(updatedAbilities).forEach(key => {
        const ability = updatedAbilities[key];
        if (!ability.isReady) {
          const newCooldown = Math.max(0, ability.currentCooldown - delta);
          updatedAbilities[key] = {
            ...ability,
            currentCooldown: newCooldown,
            isReady: newCooldown === 0,
          };
        }
      });

      return { abilities: updatedAbilities };
    }),

  addProjectile: (projectile: Projectile) =>
    set(state => ({
      projectiles: [...state.projectiles, projectile],
    })),

  removeProjectile: (id: number) =>
    set(state => ({
      projectiles: state.projectiles.filter(p => p.id !== id),
    })),
}));
