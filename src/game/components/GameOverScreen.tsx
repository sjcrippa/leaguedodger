import { Gamepad2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useGameStore } from "../stores/gameStore";
import { useEnemyStore } from "../stores/enemyStore";
import { usePlayerStore } from "../stores/playerStore";
import { useAbilitiesStore } from "../stores/abilitiesStore";

export const GameOverScreen = () => {
  const isGameOver = useGameStore(state => state.isGameOver);
  const score = useGameStore(state => state.score);
  const resetGame = useGameStore(state => state.resetGame);
  const resetPlayer = usePlayerStore(state => state.reset);
  const resetEnemies = useEnemyStore(state => state.reset);
  const resetAbilities = useAbilitiesStore(state => state.reset);
  const navigate = useNavigate();
  const handleRestart = () => {
    resetGame();
    resetPlayer();
    resetEnemies();
    resetAbilities();
  };

  const handleHomeRedirect = () => {
    navigate("/");
  };

  if (!isGameOver) return null;

  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black/80 backdrop-blur-sm z-50 pointer-events-auto">
      <div className="bg-red-700 p-8 rounded-lg shadow-2xl text-center pointer-events-auto flex flex-col items-center justify-center">
        <h2 className="text-5xl font-bold text-white mb-4">¡Game Over!</h2>
        <Gamepad2 className="mt-5 w-12 h-12 text-white mb-4 text-center animate-bounce transition-all duration-300" />
        <p className="text-xl text-gray-300 mb-8 font-semibold">Puntuación final: {score}</p>
        <div className="flex flex-col gap-4 justify-center w-full">
          <button
            onClick={handleRestart}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg border-none cursor-pointer text-lg transition-colors hover:bg-blue-700 pointer-events-auto"
          >
            Volver a jugar
          </button>
          <button
            onClick={handleHomeRedirect}
            className="px-6 py-3 bg-white text-black rounded-lg border-none cursor-pointer text-lg transition-colors hover:bg-gray-200 pointer-events-auto"
          >
            Ir al inicio
          </button>
        </div>
      </div>
    </div>
  );
};
