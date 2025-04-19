import { Link } from "react-router-dom";
import { Crosshair, Keyboard, MousePointer, X, LucideMouse } from "lucide-react";

import { useGameStore } from "@/game/stores/gameStore";
import { useTutorialStore } from "@/game/stores/tutorialStore";

export const TutorialPage = () => {
  const setShowTutorial = useTutorialStore(state => state.setShowTutorial);
  const isGameOver = useGameStore(state => state.isGameOver);
  const isGameOverActive = isGameOver;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 -mt-20">
      <div className="bg-slate-800 rounded-2xl p-8">
        <div className="flex justify-between items-center mb-8 align-middle">
          <h1 className="text-4xl font-bold text-white ">Tutorial</h1>
          {isGameOverActive ? (
            <button
              onClick={() => setShowTutorial(false)}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          ) : (
            <Link
              to="/"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl text-center text-lg transition-colors"
            >
              Volver al menú
            </Link>
          )}
        </div>

        <div className="space-y-8">
          {/* Movimiento */}
          <section className="bg-slate-700 p-6 rounded-xl">
            <h2 className="text-2xl font-bold text-white mb-4">Movimiento</h2>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-600 rounded-lg flex items-center justify-center">
                <LucideMouse className="w-6 h-6 text-white" />
              </div>
              <p className="text-white text-lg">
                Haz clic derecho para realizar un ataque básico a los enemigos cuando estén en tu
                mira.
              </p>
            </div>
          </section>

          {/* Habilidades */}
          <section className="bg-slate-700 p-6 rounded-xl">
            <h2 className="text-2xl font-bold text-white mb-4">Habilidades</h2>
            
            {/* Habilidad Q */}
            <div className="mb-6 p-4 bg-slate-600 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xl font-bold">Q</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Projectile</h3>
                  <p className="text-white text-lg">
                    Dispara proyectiles en la dirección en la que mira tu jugador. Ideal para atacar a distancia y mantener a los enemigos a raya.
                  </p>
                </div>
              </div>
            </div>

            {/* Habilidad W */}
            <div className="mb-6 p-4 bg-slate-600 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xl font-bold">W</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Shield</h3>
                  <p className="text-white text-lg">
                    Activa un escudo que te protege temporalmente de los ataques enemigos. Úsalo estratégicamente cuando estés en peligro.
                  </p>
                </div>
              </div>
            </div>

            {/* Habilidad E */}
            <div className="mb-6 p-4 bg-slate-600 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xl font-bold">E</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Dash</h3>
                  <p className="text-white text-lg">
                    Te desplazas rápidamente en la dirección del cursor. Perfecto para esquivar ataques o reposicionarte en el campo de batalla.
                  </p>
                </div>
              </div>
            </div>

            {/* Habilidad R */}
            <div className="p-4 bg-slate-600 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xl font-bold">R</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Flash</h3>
                  <p className="text-white text-lg">
                    Te teletransportas hacia adelante, permitiéndote escapar de situaciones peligrosas o sorprender a tus enemigos.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Apuntar */}
          <section className="bg-slate-700 p-6 rounded-xl">
            <h2 className="text-2xl font-bold text-white mb-4">Apuntar</h2>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-600 rounded-lg px-3 flex items-center justify-center">
                <Crosshair className="w-6 h-6 text-white" />
              </div>
              <p className="text-white text-lg">
                Mueve el mouse para apuntar a los enemigos. El cursor se volverá amarillo cuando
                estés apuntando a un enemigo.
              </p>
            </div>
          </section>

          {/* Ataque Básico */}
          <section className="bg-slate-700 p-6 rounded-xl">
            <h2 className="text-2xl font-bold text-white mb-4">Ataque Básico</h2>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-600 rounded-lg flex items-center justify-center">
                <MousePointer className="w-6 h-6 text-white" />
              </div>
              <p className="text-white text-lg">
                Haz clic derecho para realizar un ataque básico a los enemigos cuando estén en tu
                mira.
              </p>
            </div>
          </section>

          {/* Pausa */}
          <section className="bg-slate-700 p-6 rounded-xl">
            <h2 className="text-2xl font-bold text-white mb-4">Pausa</h2>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-600 rounded-lg flex items-center justify-center">
                <Keyboard className="w-6 h-6 text-white" />
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
              Tu objetivo es sobrevivir el mayor tiempo posible mientras derrotas a los enemigos.
              Cada enemigo derrotado te da puntos. El juego se vuelve más difícil a medida que
              avanzas de nivel.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
