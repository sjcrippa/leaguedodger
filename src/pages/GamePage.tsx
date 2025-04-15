import { Suspense } from "react";
import type { WheelEvent } from "react";
import { Canvas } from "@react-three/fiber";

import { GameHUD } from "@/game/components/GameHUD";
import { useGameStore } from "@/game/stores/gameStore";
import { GameScene } from "@/game/components/GameScene";
import { GameOverScreen } from "@/game/components/GameOverScreen";

export const GamePage = () => {
  const isGameOver = useGameStore(state => state.isGameOver);

  // Prevent zoom
  const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="relative w-full h-screen">
      {/* Game canvas occupying the entire screen */}
      <div
        className="absolute inset-0"
        onWheel={handleWheel}
        style={{
          pointerEvents: isGameOver ? "none" : "auto",
          zIndex: 1,
        }}
      >
        <Canvas shadows>
          <Suspense fallback={null}>
            <GameScene />
          </Suspense>
        </Canvas>
      </div>

      {/* Overlay HUD */}
      <div
        className="absolute inset-x-0 top-0"
        style={{
          pointerEvents: isGameOver ? "none" : "auto",
          zIndex: 2,
        }}
      >
        <GameHUD />
      </div>

      {/* Game Over Screen */}
      {isGameOver && (
        <div
          className="absolute inset-0"
          style={{
            pointerEvents: "auto",
            zIndex: 3,
          }}
        >
          <GameOverScreen />
        </div>
      )}
    </div>
  );
};
