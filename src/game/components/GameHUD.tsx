import { useEffect } from "react";

import { PauseIcon, PlayIcon } from "lucide-react";
import { useGameStore } from "../stores/gameStore";

interface GameHUDProps {
  score: number;
}

export const GameHUD = ({ score }: GameHUDProps) => {
  const enemyProjectilesEnabled = useGameStore(state => state.enemyProjectilesEnabled);
  const toggleEnemyProjectiles = useGameStore(state => state.toggleEnemyProjectiles);
  const isPaused = useGameStore(state => state.isPaused);
  const setPaused = useGameStore(state => state.setPaused);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPaused(!isPaused);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isPaused, setPaused]);

  return (
    <>
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-start">
          {/* Score */}
          <div className="bg-black/50 backdrop-blur-sm rounded-lg px-6 py-3">
            <p className="text-2xl font-bold text-white">Puntuación: {score}</p>
          </div>

          {/* Controls */}
          <div className="flex gap-4">
            <button
              onClick={() => setPaused(!isPaused)}
              className="bg-black/50 backdrop-blur-sm rounded-lg px-6 py-3 text-white hover:bg-black/60 transition-colors"
            >
              {isPaused ? <PlayIcon className="w-12 h-12" /> : <PauseIcon className="w-12 h-12" />}
            </button>

            <button
              onClick={toggleEnemyProjectiles}
              className={`px-4 py-2 rounded ${
                enemyProjectilesEnabled ? "bg-red-500" : "bg-green-500"
              }`}
            >
              {enemyProjectilesEnabled ? "Pausar Proyectiles" : "Activar Proyectiles"}
            </button>
          </div>
        </div>
      </div>

      {/* Pause overlay */}
      {isPaused && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex flex-col gap-5 items-center justify-center">
          <PauseIcon className="w-12 h-12" />
          <p className="text-xl text-white/80">Presiona ESC para continuar</p>
        </div>
      )}
    </>
  );
};
