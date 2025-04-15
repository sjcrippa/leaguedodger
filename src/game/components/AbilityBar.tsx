import { useEffect } from 'react';
import { useAbilityBarStore } from '../stores/abilityBarStore';
import { useGameStore } from '../stores/gameStore';

const AbilityBar = () => {
  const abilities = useAbilityBarStore((state) => state.abilities);
  const triggerAbility = useAbilityBarStore((state) => state.triggerAbility);
  const updateCooldowns = useAbilityBarStore((state) => state.updateCooldowns);
  const isPaused = useGameStore((state) => state.isPaused);
  const isGameOver = useGameStore((state) => state.isGameOver);

  useEffect(() => {
    let frameId: number;

    const update = () => {
      if (!isPaused && !isGameOver) {
        updateCooldowns(1 / 60); // Asumiendo 60 FPS
      }
      frameId = requestAnimationFrame(update);
    };

    frameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId);
  }, [isPaused, isGameOver, updateCooldowns]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isPaused || isGameOver) return;
      
      const key = e.key.toUpperCase();
      if (['Q', 'W', 'E', 'R'].includes(key)) {
        triggerAbility(key);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPaused, isGameOver, triggerAbility]);

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4">
      {abilities.map((ability) => (
        <div
          key={ability.key}
          className={`relative w-16 h-16 bg-black/50 backdrop-blur-sm rounded-lg flex items-center justify-center cursor-pointer
            ${ability.isOnCooldown ? 'opacity-80' : 'hover:bg-black/60'}`}
          onClick={() => !ability.isOnCooldown && triggerAbility(ability.key)}
        >
          {/* Ability key */}
          <span className={`text-2xl font-bold text-white transition-opacity duration-200 ${ability.isOnCooldown ? 'opacity-30' : 'opacity-100'}`}>
            {ability.key}
          </span>

          {/* Cooldown overlay */}
          {ability.isOnCooldown && (
            <>
              {/* Cooldown number */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black/60 rounded-full w-8 h-8 flex items-center justify-center">
                  <span className="text-lg font-bold text-white">
                    {Math.ceil(ability.currentCooldown)}
                  </span>
                </div>
              </div>

              {/* Cooldown progress - Ahora es un círculo que rodea la habilidad */}
              <svg
                className="absolute inset-0 w-full h-full -rotate-90"
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="5"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="5"
                  strokeDasharray={`${(1 - ability.currentCooldown / ability.cooldown) * 283} 283`}
                  className="transition-all duration-100 ease-linear"
                />
              </svg>
            </>
          )}

          {/* Ability name tooltip */}
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/90 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">
            {ability.name}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AbilityBar; 