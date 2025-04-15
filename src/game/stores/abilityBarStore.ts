import { create } from "zustand";

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

const initialAbilities: Ability[] = [
  { key: 'Q', name: 'Projectile Shot', cooldown: 0.2, currentCooldown: 0, isOnCooldown: false },
  { key: 'W', name: 'Shield', cooldown: 8, currentCooldown: 0, isOnCooldown: false },
  { key: 'E', name: 'Dash', cooldown: 5, currentCooldown: 0, isOnCooldown: false },
  { key: 'R', name: 'Flash', cooldown: 5, currentCooldown: 0, isOnCooldown: false },
];

export const useAbilityBarStore = create<AbilityBarState>((set) => ({
  abilities: initialAbilities,
  
  triggerAbility: (key: string) => {
    set((state) => ({
      abilities: state.abilities.map((ability) =>
        ability.key === key && !ability.isOnCooldown
          ? { ...ability, isOnCooldown: true, currentCooldown: ability.cooldown }
          : ability
      ),
    }));
  },

  updateCooldowns: (delta: number) => {
    set((state) => ({
      abilities: state.abilities.map((ability) =>
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