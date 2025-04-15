import { useEffect, useCallback, useRef } from "react";
import { useGameStore } from "../stores/gameStore";
import { Vector3, Vector2, Mesh } from "three";
import { useThree } from "@react-three/fiber";
import { usePlayerStore } from "../stores/playerStore";

interface PlayerControls {
  isMoving: boolean;
  targetPosition: Vector3;
  moveSpeed: number;
}

export const usePlayerControls = (ref: React.RefObject<Mesh>) => {
  const isPaused = useGameStore(state => state.isPaused);
  const isGameOver = useGameStore(state => state.isGameOver);
  const countdown = useGameStore(state => state.countdown);
  const isDashing = usePlayerStore(state => state.state.isDashing);
  const { camera, raycaster, scene } = useThree();

  const controls = useRef<PlayerControls>({
    isMoving: false,
    targetPosition: new Vector3(),
    moveSpeed: 0.12,
  });

  // Detener movimiento cuando se pausa, hay countdown o está dashing
  useEffect(() => {
    if (isPaused || countdown !== null || isDashing) {
      controls.current.isMoving = false;
    }
  }, [isPaused, countdown, isDashing]);

  // Procesar el movimiento del jugador hacia un punto
  const processMovement = useCallback(
    (x: number, y: number) => {
      if (!ref.current || isPaused || isGameOver || countdown !== null || isDashing) return;

      // Convertir coordenadas del mouse a coordenadas normalizadas (-1 a 1)
      const mouse = new Vector2((x / window.innerWidth) * 2 - 1, -(y / window.innerHeight) * 2 + 1);

      // Actualizar el rayo para intersección
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);
      const floorIntersect = intersects.find(i => i.object.name === "game-floor");

      if (floorIntersect) {
        const point = floorIntersect.point;
        point.y = ref.current.position.y; // Mantener altura actual

        // Actualizar destino y estado de movimiento
        controls.current.targetPosition.copy(point);
        controls.current.isMoving = true;

        // Rotar el jugador hacia el punto de destino
        const direction = new Vector3().subVectors(point, ref.current.position).normalize();

        const angle = Math.atan2(direction.x, direction.z);
        ref.current.rotation.y = angle;
      }
    },
    [ref, camera, raycaster, scene, isPaused, isGameOver, countdown, isDashing]
  );

  // Manejar click derecho
  const handleMouseDown = useCallback(
    (event: MouseEvent) => {
      if (event.button === 2) {
        // Solo click derecho
        event.preventDefault();
        processMovement(event.clientX, event.clientY);
      }
    },
    [processMovement]
  );

  // Actualizar posición en cada frame
  useEffect(() => {
    let animationFrameId: number;

    const updatePosition = () => {
      if (!ref.current || isPaused || isGameOver || countdown !== null || isDashing) {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
        return;
      }

      if (controls.current.isMoving) {
        const currentPos = ref.current.position;
        const targetPos = controls.current.targetPosition;
        const distance = currentPos.distanceTo(targetPos);

        if (distance > 0.1) {
          const direction = new Vector3().subVectors(targetPos, currentPos).normalize();
          currentPos.add(direction.multiplyScalar(controls.current.moveSpeed));
        } else {
          controls.current.isMoving = false;
        }
      }

      animationFrameId = requestAnimationFrame(updatePosition);
    };

    updatePosition();
    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [ref, isPaused, isGameOver, countdown, isDashing]);

  // Configurar event listeners
  useEffect(() => {
    const canvas = document.querySelector("canvas");
    if (canvas) {
      canvas.addEventListener("mousedown", handleMouseDown);
    }
    window.addEventListener("contextmenu", e => e.preventDefault());

    return () => {
      if (canvas) {
        canvas.removeEventListener("mousedown", handleMouseDown);
      }
      window.removeEventListener("contextmenu", e => e.preventDefault());
    };
  }, [handleMouseDown]);

  return controls.current;
};
