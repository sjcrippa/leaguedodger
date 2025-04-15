import { create } from "zustand";

type AnimationCallback = (delta: number) => void;

interface AnimationManager {
  callbacks: Map<string, AnimationCallback>;
  lastTime: number;
  isRunning: boolean;
  registerCallback: (id: string, callback: AnimationCallback) => void;
  unregisterCallback: (id: string) => void;
  startAnimation: () => void;
  stopAnimation: () => void;
}

export const useAnimationManager = create<AnimationManager>((set, get) => ({
  callbacks: new Map(),
  lastTime: 0,
  isRunning: false,

  registerCallback: (id: string, callback: AnimationCallback) => {
    const state = get();
    const newCallbacks = new Map(state.callbacks);
    newCallbacks.set(id, callback);

    set({ callbacks: newCallbacks });

    // Start animation loop if it's not running
    if (!state.isRunning) {
      get().startAnimation();
    }
  },

  unregisterCallback: (id: string) => {
    const state = get();
    const newCallbacks = new Map(state.callbacks);
    newCallbacks.delete(id);

    set({ callbacks: newCallbacks });

    // Stop animation loop if no callbacks remain
    if (newCallbacks.size === 0) {
      set({ isRunning: false });
    }
  },

  startAnimation: () => {
    const state = get();
    if (state.isRunning) return;

    set({ isRunning: true, lastTime: performance.now() });

    const animate = (currentTime: number) => {
      const currentState = get();
      if (!currentState.isRunning) return;

      const delta = (currentTime - currentState.lastTime) / 1000; // Convert to seconds
      set({ lastTime: currentTime });

      // Execute all registered callbacks
      currentState.callbacks.forEach(callback => {
        try {
          callback(delta);
        } catch (error) {
          console.error("Error in animation callback:", error);
        }
      });

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  },

  stopAnimation: () => {
    set({ isRunning: false });
  },
}));
