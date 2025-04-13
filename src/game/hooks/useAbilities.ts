import { useEffect } from "react";
import { useAbilitiesStore } from "../stores/abilitiesStore";
import { useThree } from "@react-three/fiber";
import { ABILITY_KEYS, AbilityKey } from "../types/abilities";

export const useAbilities = () => {
  const castAbility = useAbilitiesStore(state => state.castAbility);
  const { scene } = useThree();

  // Initialize keyboard event listener
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (ABILITY_KEYS.includes(key as AbilityKey)) {
        const player = scene.getObjectByName("player");
        if (!player) return;

        castAbility(key as AbilityKey, player);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [scene, castAbility]);

  return null;
};
