import { create } from "zustand";

interface LevelState {
  currentLevel: number;
  maxLevel: number;
  enemiesPerLevel: number;
  enemiesDefeated: number;
  isLevelComplete: boolean;
  // Actions
  incrementLevel: () => void;
  incrementEnemiesDefeated: () => void;
  checkLevelCompletion: () => void;
  resetLevel: () => void;
}

const initialState = {
  currentLevel: 1,
  maxLevel: 10, // Máximo de niveles
  enemiesPerLevel: 5, // Enemigos por nivel
  enemiesDefeated: 0,
  isLevelComplete: false,
};

export const useLevelStore = create<LevelState>((set, get) => ({
  ...initialState,

  incrementLevel: () => {
    set(state => ({ 
      currentLevel: Math.min(state.currentLevel + 1, state.maxLevel),
      enemiesDefeated: 0,
      isLevelComplete: false
    }));
  },

  incrementEnemiesDefeated: () => {
    set(state => ({ 
      enemiesDefeated: state.enemiesDefeated + 1 
    }));
    get().checkLevelCompletion();
  },

  checkLevelCompletion: () => {
    const { enemiesDefeated, enemiesPerLevel } = get();
    if (enemiesDefeated >= enemiesPerLevel) {
      set({ isLevelComplete: true });
      // Aquí podríamos agregar lógica adicional cuando se completa un nivel
    }
  },

  resetLevel: () => {
    set(initialState);
  }
})); 