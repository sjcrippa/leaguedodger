import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { GameHUD } from '@/game/components/GameHUD'
import { GameScene } from '@/game/components/GameScene'
import { GameOverScreen } from '@/game/components/GameOverScreen'
import { useGameStore } from '@/game/stores/gameStore'

import type { WheelEvent } from 'react'

export const GamePage = () => {
  // Temporary game state
  const gameState = {
    score: 0,
    health: 100,
    energy: 100
  }

  const isGameOver = useGameStore(state => state.isGameOver)

  // Prevenir el zoom
  const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  return (
    <div className="relative w-full h-screen">
      {/* Canvas del juego ocupando toda la pantalla */}
      <div 
        className="absolute inset-0" 
        onWheel={handleWheel}
        style={{ 
          pointerEvents: isGameOver ? 'none' : 'auto',
          zIndex: 1
        }}
      >
        <Canvas shadows>
          <Suspense fallback={null}>
            <GameScene />
          </Suspense>
        </Canvas>
      </div>

      {/* HUD superpuesto */}
      <div 
        className="absolute inset-x-0 top-0"
        style={{ 
          pointerEvents: isGameOver ? 'none' : 'auto',
          zIndex: 2
        }}
      >
        <GameHUD 
          score={gameState.score}
          health={gameState.health}
          energy={gameState.energy}
        />
      </div>

      {/* Game Over Screen */}
      {isGameOver && (
        <div 
          className="absolute inset-0"
          style={{ 
            pointerEvents: 'auto',
            zIndex: 3
          }}
        >
          <GameOverScreen />
        </div>
      )}
    </div>
  )
}
