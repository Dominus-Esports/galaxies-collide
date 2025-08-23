"use client";

import { useEffect, useRef, useState } from "react";
import { SimpleGameEngine } from "@/game/engine/SimpleGameEngine";
import { Vector3 } from "@babylonjs/core";

export default function GamePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameEngineRef = useRef<SimpleGameEngine | null>(null);
  const [gameState, setGameState] = useState<any>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize simple game engine
    gameEngineRef.current = new SimpleGameEngine(canvasRef.current);

    // Update game state every 100ms
    const interval = setInterval(() => {
      if (gameEngineRef.current) {
        setGameState(gameEngineRef.current.getGameState());
      }
    }, 100);

    return () => {
      clearInterval(interval);
      if (gameEngineRef.current) {
        gameEngineRef.current.stop();
      }
    };
  }, []);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (!gameEngineRef.current) return;

    const speed = 1;
    const direction = new Vector3(0, 0, 0);

    switch (event.key.toLowerCase()) {
      case "w":
        direction.z = -speed;
        break;
      case "s":
        direction.z = speed;
        break;
      case "a":
        direction.x = -speed;
        break;
      case "d":
        direction.x = speed;
        break;
      case " ":
        // Attack nearest enemy
        if (gameState?.enemies?.length > 0) {
          const nearestEnemy = gameState.enemies[0];
          gameEngineRef.current.attackEnemy(nearestEnemy.id);
        }
        break;
      case "e":
        // Spawn enemy
        const randomPosition = new Vector3(
          (Math.random() - 0.5) * 10,
          0,
          (Math.random() - 0.5) * 10
        );
        gameEngineRef.current.addEnemy(randomPosition);
        break;
    }

    if (direction.length() > 0) {
      gameEngineRef.current.movePlayer(direction);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [gameState]);

  return (
    <div className="w-full h-screen bg-black flex flex-col">
      {/* Game Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ touchAction: "none" }}
      />
      
      {/* Game UI */}
      <div className="absolute top-4 left-4 text-white">
        <h1 className="text-2xl font-bold mb-2">Galaxies Collide</h1>
        <p className="text-sm opacity-75">Simple Combat Demo</p>
      </div>
      
      {/* Game Stats */}
      <div className="absolute top-4 right-4 text-white text-sm">
        <div>Level: {gameState?.player?.level || 1}</div>
        <div>Health: {gameState?.player?.health || 100}/{gameState?.player?.maxHealth || 100}</div>
        <div>Experience: {gameState?.player?.experience || 0}</div>
        <div>Enemies: {gameState?.enemies?.length || 0}</div>
        <div>Game Time: {Math.floor(gameState?.gameTime || 0)}s</div>
      </div>
      
      {/* Controls */}
      <div className="absolute bottom-4 left-4 text-white text-sm opacity-75">
        <div>WASD - Move</div>
        <div>Space - Attack</div>
        <div>E - Spawn Enemy</div>
      </div>

      {/* Game Status */}
      <div className="absolute bottom-4 right-4 text-white text-sm">
        <div>Status: Running</div>
      </div>
    </div>
  );
}
