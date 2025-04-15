import { useEffect } from "react";
import { useAbilitiesStore } from "../stores/abilitiesStore";
import { useGameStore } from "../stores/gameStore";
import { useThree } from "@react-three/fiber";
import { ABILITY_KEYS, AbilityKey } from "../types/abilities";

export const useAbilities = () => {
  const castAbility = useAbilitiesStore(state => state.castAbility);
  const countdown = useGameStore(state => state.countdown);
  const isPaused = useGameStore(state => state.isPaused);
  const isGameOver = useGameStore(state => state.isGameOver);
  const { scene } = useThree();

  // Initialize keyboard event listener
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      // Avoid using abilities during countdown, pause or game over
      if (countdown !== null || isPaused || isGameOver) return;

      if (ABILITY_KEYS.includes(key as AbilityKey)) {
        const player = scene.getObjectByName("player");
        if (!player) return;

        castAbility(key as AbilityKey, player);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [scene, castAbility, countdown, isPaused, isGameOver]);

  return null;
};
