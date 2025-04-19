import { create } from "zustand";

interface TutorialState {
  showTutorial: boolean;
  setShowTutorial: (show: boolean) => void;
}

export const useTutorialStore = create<TutorialState>((set) => ({
  showTutorial: false,
  setShowTutorial: (show) => set({ showTutorial: show }),
})); 