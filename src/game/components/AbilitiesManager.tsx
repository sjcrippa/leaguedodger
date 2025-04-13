import { useEffect } from "react";
import { useAbilities } from "../hooks/useAbilities";
import { useAbilitiesStore } from "../stores/abilitiesStore";
import { useGameStore } from "../stores/gameStore";

export const AbilitiesManager = () => {
  const isPaused = useGameStore(state => state.isPaused);
  const isGameOver = useGameStore(state => state.isGameOver);
  const updateCooldowns = useAbilitiesStore(state => state.update);

  // Initialize abilities system
  useAbilities();

  // Update cooldowns on each frame
  useEffect(() => {
    let frameId: number;

    const update = () => {
      if (!isPaused && !isGameOver) {
        updateCooldowns(1 / 60); // Assuming 60 FPS
      }
      frameId = requestAnimationFrame(update);
    };

    frameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId);
  }, [isPaused, isGameOver, updateCooldowns]);

  return null; // This is a manager component, it doesn't render anything
};
