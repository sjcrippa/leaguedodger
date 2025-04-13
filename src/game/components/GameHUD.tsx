import { useGameStore } from '../stores/gameStore'

interface GameHUDProps {
  score: number;
  health: number;
  energy: number;
}

export const GameHUD = ({ score, health, energy }: GameHUDProps) => {
  const enemyProjectilesEnabled = useGameStore((state) => state.enemyProjectilesEnabled)
  const toggleEnemyProjectiles = useGameStore((state) => state.toggleEnemyProjectiles)

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-start">
        {/* Score */}
        <div className="bg-black/50 backdrop-blur-sm rounded-lg px-6 py-3">
          <p className="text-2xl font-bold text-white">Puntuación: {score}</p>
        </div>

        {/* <div className="flex gap-4">
          <div className="bg-black/50 backdrop-blur-sm rounded-lg px-6 py-3">
            <p className="text-sm text-white mb-2">Vida</p>
            <div className="w-48 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-red-500 transition-all duration-300"
                style={{ width: `${health}%` }}
              />
            </div>
          </div>

          <div className="bg-black/50 backdrop-blur-sm rounded-lg px-6 py-3">
            <p className="text-sm text-white mb-2">Energía</p>
            <div className="w-48 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${energy}%` }}
              />
            </div>
          </div>
        </div> */}

        {/* Debug Controls */}
        <div className="mt-4">
          <button
            onClick={toggleEnemyProjectiles}
            className={`px-4 py-2 rounded ${
              enemyProjectilesEnabled ? 'bg-red-500' : 'bg-green-500'
            }`}
          >
            {enemyProjectilesEnabled ? 'Pausar Proyectiles' : 'Activar Proyectiles'}
          </button>
        </div>
      </div>
    </div>
  );
};
