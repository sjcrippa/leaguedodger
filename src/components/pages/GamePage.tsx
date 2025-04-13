import { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { GameHUD } from '@components/game/GameHUD'
import { GameScene } from '@components/game/GameScene'
import type { WheelEvent } from 'react'

export const GamePage = () => {
  const [gameState, setGameState] = useState({
    score: 0,
    health: 100,
    energy: 100
  })

  // Prevenir el zoom
  const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  return (
    <div className="relative w-full h-screen">
      {/* Canvas del juego ocupando toda la pantalla */}
      <div className="absolute inset-0" onWheel={handleWheel}>
        <Canvas shadows>
          <Suspense fallback={null}>
            <GameScene />
          </Suspense>
        </Canvas>
      </div>

      {/* HUD superpuesto */}
      <div className="absolute inset-x-0 top-0 z-10">
        <GameHUD 
          score={gameState.score}
          health={gameState.health}
          energy={gameState.energy}
        />
      </div>
    </div>
  )
} 