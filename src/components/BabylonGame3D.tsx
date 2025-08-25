'use client';

import { useEffect, useRef } from 'react';
import {
  Engine,
  Scene,
  FreeCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  StandardMaterial,
  Color3,
  Mesh,
  PhysicsImpostor,
  HavokPlugin
} from '@babylonjs/core';

interface BabylonGame3DProps {
  onExit: () => void;
}

export default function BabylonGame3D({ onExit }: BabylonGame3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const engine = new Engine(canvas, true);
    
    const createScene = async () => {
      const scene = new Scene(engine);

      // Camera
      const camera = new FreeCamera('camera', new Vector3(0, 5, -10), scene);
      camera.setTarget(Vector3.Zero());
      camera.attachControl(canvas, true);

      // Lighting
      const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene);
      light.intensity = 0.7;

      // Ground
      const ground = MeshBuilder.CreateGround('ground', { width: 20, height: 20 }, scene);
      const groundMaterial = new StandardMaterial('groundMat', scene);
      groundMaterial.diffuseColor = new Color3(0.2, 0.2, 0.2);
      ground.material = groundMaterial;

      // Player character (simple sphere for now)
      const player = MeshBuilder.CreateSphere('player', { diameter: 1 }, scene);
      player.position = new Vector3(0, 1, 0);
      const playerMaterial = new StandardMaterial('playerMat', scene);
      playerMaterial.diffuseColor = new Color3(0, 0.5, 1);
      player.material = playerMaterial;

      // Dimensional chambers (floating platforms)
      const createChamber = (name: string, position: Vector3, color: Color3) => {
        const chamber = MeshBuilder.CreateBox(name, { height: 0.5, width: 3, depth: 3 }, scene);
        chamber.position = position;
        const chamberMaterial = new StandardMaterial(`${name}Mat`, scene);
        chamberMaterial.diffuseColor = color;
        chamber.material = chamberMaterial;
        return chamber;
      };

      // Create dimensional chambers
      createChamber('realityRelocator', new Vector3(-5, 3, 0), new Color3(0.5, 0, 1));
      createChamber('chronoChamber', new Vector3(5, 3, 0), new Color3(1, 0.5, 0));
      createChamber('gravityChamber', new Vector3(0, 3, 5), new Color3(0, 1, 0.5));
      createChamber('dreamscapeNexus', new Vector3(0, 3, -5), new Color3(1, 0, 0.5));

      // Simple movement controls
      let moveForward = false;
      let moveBackward = false;
      let moveLeft = false;
      let moveRight = false;

      scene.onKeyboardObservable.add((kbInfo) => {
        switch (kbInfo.type) {
          case 1: // KEYDOWN
            switch (kbInfo.event.code) {
              case 'KeyW': moveForward = true; break;
              case 'KeyS': moveBackward = true; break;
              case 'KeyA': moveLeft = true; break;
              case 'KeyD': moveRight = true; break;
              case 'Escape': onExit(); break;
            }
            break;
          case 2: // KEYUP
            switch (kbInfo.event.code) {
              case 'KeyW': moveForward = false; break;
              case 'KeyS': moveBackward = false; break;
              case 'KeyA': moveLeft = false; break;
              case 'KeyD': moveRight = false; break;
            }
            break;
        }
      });

      // Game loop
      scene.registerBeforeRender(() => {
        const speed = 0.1;
        if (moveForward) player.position.z += speed;
        if (moveBackward) player.position.z -= speed;
        if (moveLeft) player.position.x -= speed;
        if (moveRight) player.position.x += speed;
      });

      return scene;
    };

    createScene().then((scene) => {
      engine.runRenderLoop(() => {
        scene.render();
      });
    });

    const handleResize = () => {
      engine.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      engine.dispose();
    };
  }, [onExit]);

  return (
    <div className="relative w-full h-screen">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ touchAction: 'none' }}
      />
      <div className="absolute top-4 left-4 text-white bg-black/50 p-4 rounded">
        <h2 className="text-xl font-bold mb-2">🌌 Dimensional Realms</h2>
        <p className="text-sm mb-2">WASD - Move</p>
        <p className="text-sm mb-2">Mouse - Look</p>
        <p className="text-sm">ESC - Exit</p>
      </div>
      <button
        onClick={onExit}
        className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
      >
        Exit 3D World
      </button>
    </div>
  );
}
