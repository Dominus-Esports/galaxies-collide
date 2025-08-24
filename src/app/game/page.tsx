"use client";

import { useEffect, useRef } from "react";

export default function GamePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Simple canvas setup
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Simple animation
    let frame = 0;
    const animate = () => {
      frame++;
      
      // Clear canvas
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw simple animation
      ctx.fillStyle = "white";
      ctx.font = "24px Arial";
      ctx.fillText("🌌 Galaxies Collide - Coming Soon!", 50, 100);
      ctx.fillText(`Frame: ${frame}`, 50, 150);
      
      requestAnimationFrame(animate);
    };
    
    animate();
  }, []);

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
        <h1 className="text-2xl font-bold mb-2">🌌 Galaxies Collide</h1>
        <p className="text-sm opacity-75">Simple Demo</p>
      </div>

      {/* Controls */}
      <div className="absolute bottom-4 left-4 text-white text-sm bg-black bg-opacity-50 p-3 rounded">
        <div className="font-bold mb-2">Status</div>
        <div>Basic canvas working</div>
        <div>Ready for BabylonJS integration</div>
      </div>
    </div>
  );
}
