import { Crosshair, Keyboard, MousePointer } from "lucide-react";
import { Link } from "react-router-dom";

export const TutorialPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-slate-800 rounded-2xl p-8">
        <div className="flex justify-between items-center mb-8 align-middle">
          <h1 className="text-4xl font-bold text-white ">Tutorial</h1>
          <Link
            to="/"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl text-center text-lg transition-colors"
          >
            Volver al menú
          </Link>
        </div>

        <div className="space-y-8">
          {/* Movimiento */}
          <section className="bg-slate-700 p-6 rounded-xl">
            <h2 className="text-2xl font-bold text-white mb-4">Movimiento</h2>
            <div className="flex items-center gap-4">
              <div className="grid grid-cols-4 gap-4">
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
              <p className="text-white text-lg ml-2">
                Usa las teclas Q, W, E y R para moverte por el mapa y esquivar a los enemigos.
              </p>
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
                Mueve el mouse para apuntar a los enemigos. El cursor se volverá amarillo cuando estés apuntando a un enemigo.
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
                Haz clic derecho para realizar un ataque básico a los enemigos cuando estén en tu mira.
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
              Tu objetivo es sobrevivir el mayor tiempo posible mientras derrotas a los enemigos. Cada enemigo derrotado te da puntos.
              El juego se vuelve más difícil a medida que avanzas de nivel.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}; 