import { useEffect } from "react";

import { PauseIcon, PlayIcon } from "lucide-react";
import { useGameStore } from "../stores/gameStore";
import { useLevelStore } from '../stores/levelStore';

export const GameHUD = () => {
  const { score } = useGameStore();
  const { currentLevel, enemiesDefeated, enemiesPerLevel, isLevelComplete } = useLevelStore();
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
          {/* Score and Level Info */}
          <div className="bg-black/50 backdrop-blur-sm rounded-lg px-6 py-3">
            <div className="flex items-center gap-4">
              <div className="text-3xl font-bold text-white">
                <span className="text-yellow-400">Score:</span> {score}
              </div>
              <div className="text-xl text-white">
                <span className="text-blue-400">Level:</span> {currentLevel}
              </div>
              <div className="text-xl text-white">
                <span className="text-red-400">Enemies:</span> {enemiesDefeated}/{enemiesPerLevel}
              </div>
            </div>
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

      {/* Level Complete Overlay */}
      {isLevelComplete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center z-50">
          <div className="bg-black/70 p-8 rounded-lg text-center">
            <h2 className="text-3xl font-bold text-white mb-4">¡Nivel Completado!</h2>
            <p className="text-xl text-white mb-6">Nivel {currentLevel} completado con éxito</p>
            <p className="text-xl text-yellow-400 mb-6">Puntos ganados: {enemiesDefeated * 25}</p>
            <button
              onClick={() => useLevelStore.getState().incrementLevel()}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Continuar al Nivel {currentLevel + 1}
            </button>
          </div>
        </div>
      )}

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
