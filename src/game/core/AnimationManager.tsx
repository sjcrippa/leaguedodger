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
    set(state => {
      const newCallbacks = new Map(state.callbacks);
      newCallbacks.set(id, callback);
      return { callbacks: newCallbacks };
    });

    // Start animation loop if it's not running
    if (!get().isRunning) {
      get().startAnimation();
    }
  },

  unregisterCallback: (id: string) => {
    set(state => {
      const newCallbacks = new Map(state.callbacks);
      newCallbacks.delete(id);
      return { callbacks: newCallbacks };
    });

    // Stop animation loop if no callbacks remain
    if (get().callbacks.size === 0) {
      get().stopAnimation();
    }
  },

  startAnimation: () => {
    set({ isRunning: true, lastTime: performance.now() });

    const animate = (currentTime: number) => {
      if (!get().isRunning) return;

      const delta = (currentTime - get().lastTime) / 1000; // Convert to seconds
      set({ lastTime: currentTime });

      // Execute all registered callbacks
      get().callbacks.forEach(callback => {
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
