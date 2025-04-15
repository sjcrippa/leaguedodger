import { create } from "zustand";
import { ABILITIES_CONFIG } from "../constants/abilities";

interface Ability {
  key: string;
  name: string;
  cooldown: number;
  currentCooldown: number;
  isOnCooldown: boolean;
}

interface AbilityBarState {
  abilities: Ability[];
  triggerAbility: (key: string) => void;
  updateCooldowns: (delta: number) => void;
  resetAbilities: () => void;
}

// consume initial abilities from the config
const initialAbilities: Ability[] = Object.entries(ABILITIES_CONFIG).map(([key, config]) => ({
  key: key.toUpperCase(),
  name: config.name,
  cooldown: config.cooldown,
  currentCooldown: 0,
  isOnCooldown: false,
}));

export const useAbilityBarStore = create<AbilityBarState>(set => ({
  abilities: initialAbilities,

  triggerAbility: (key: string) => {
    set(state => ({
      abilities: state.abilities.map(ability =>
        ability.key === key && !ability.isOnCooldown
          ? { ...ability, isOnCooldown: true, currentCooldown: ability.cooldown }
          : ability
      ),
    }));
  },

  updateCooldowns: (delta: number) => {
    set(state => ({
      abilities: state.abilities.map(ability =>
        ability.isOnCooldown
          ? {
              ...ability,
              currentCooldown: Math.max(0, ability.currentCooldown - delta),
              isOnCooldown: ability.currentCooldown - delta > 0,
            }
          : ability
      ),
    }));
  },

  resetAbilities: () => {
    set({ abilities: initialAbilities });
  },
}));
