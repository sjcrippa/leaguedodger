import { Gamepad2, GraduationCap, X, Crosshair } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useGameStore } from "../stores/gameStore";
import { useEnemyStore } from "../stores/enemyStore";
import { usePlayerStore } from "../stores/playerStore";
import { useAbilitiesStore } from "../stores/abilitiesStore";

export const GameOverScreen = () => {
  const [showTutorial, setShowTutorial] = useState(false);
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
    <>
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
              onClick={() => setShowTutorial(true)}
              className="px-6 py-3 bg-green-600 text-white rounded-lg border-none cursor-pointer text-lg transition-colors hover:bg-green-700 pointer-events-auto flex items-center justify-center gap-2"
            >
              <GraduationCap className="w-5 h-5" />
              Ver Tutorial
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

      {/* Tutorial Modal */}
      {showTutorial && (
        <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black/90 backdrop-blur-sm z-[60]">
          <div className="bg-slate-800 rounded-2xl p-8 max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl font-bold text-white">Tutorial</h1>
              <button
                onClick={() => setShowTutorial(false)}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
            
            <div className="space-y-8">
              {/* Movimiento */}
              <section className="bg-slate-700 p-6 rounded-xl">
                <h2 className="text-2xl font-bold text-white mb-4">Movimiento</h2>
                <div className="flex items-center gap-4">
                  <div className="grid grid-cols-4 gap-2">
                    <div className="w-12 h-12 bg-slate-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xl font-bold">Q</span>
                    </div>
                    <div className="w-12 h-12 bg-slate-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xl font-bold">W</span>
                    </div>
                    <div className="w-12 h-12 bg-slate-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xl font-bold">E</span>
                    </div>
                    <div className="w-12 h-12 bg-slate-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xl font-bold">R</span>
                    </div>
                  </div>
                  <p className="text-white text-lg">
                    Usa las teclas Q, W, E y R para moverte por el mapa y esquivar a los enemigos.
                  </p>
                </div>
              </section>

              {/* Apuntar */}
              <section className="bg-slate-700 p-6 rounded-xl">
                <h2 className="text-2xl font-bold text-white mb-4">Apuntar</h2>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-600 rounded-lg flex items-center justify-center">
                    <Crosshair className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-white text-lg">
                    Mueve el mouse para apuntar a los enemigos. El cursor se volverá amarillo cuando estés apuntando a un enemigo.
                  </p>
                </div>
              </section>

              {/* Ataque Básico */}
              <section className="bg-slate-700 p-6 rounded-xl">
                <h2 className="text-2xl font-bold text-white mb-4">Ataque Básico</h2>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-600 rounded-lg flex items-center justify-center">
                    <Crosshair className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-white text-lg">
                    Haz clic izquierdo para realizar un ataque básico a los enemigos cuando estén en tu mira.
                  </p>
                </div>
              </section>

              {/* Pausa */}
              <section className="bg-slate-700 p-6 rounded-xl">
                <h2 className="text-2xl font-bold text-white mb-4">Pausa</h2>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-600 rounded-lg flex items-center justify-center">
                    <X className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-white text-lg">
                    Presiona ESC para pausar el juego en cualquier momento.
                  </p>
                </div>
              </section>

              {/* Objetivo */}
              <section className="bg-slate-700 p-6 rounded-xl">
                <h2 className="text-2xl font-bold text-white mb-4">Objetivo</h2>
                <p className="text-white text-lg">
                  Tu objetivo es sobrevivir el mayor tiempo posible mientras derrotas a los enemigos. Cada enemigo derrotado te da puntos.
                  El juego se vuelve más difícil a medida que avanzas de nivel.
                </p>
              </section>
            </div>

            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setShowTutorial(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl text-center text-lg transition-colors"
              >
                Volver al juego
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
