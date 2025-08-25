'use client';

import {
    Color3,
    Engine,
    FreeCamera,
    HemisphericLight,
    MeshBuilder,
    Scene,
    StandardMaterial,
    Vector3
} from '@babylonjs/core';
import { useEffect, useRef } from 'react';

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

             // Enhanced lighting for dimensional atmosphere
       const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene);
       light.intensity = 0.3;
       light.diffuse = new Color3(0.2, 0.3, 0.8);
       light.groundColor = new Color3(0.8, 0.2, 0.5);

             // Dimensional ground with cosmic texture
       const ground = MeshBuilder.CreateGround('ground', { width: 40, height: 40 }, scene);
       const groundMaterial = new StandardMaterial('groundMat', scene);
       groundMaterial.diffuseColor = new Color3(0.1, 0.05, 0.2);
       groundMaterial.emissiveColor = new Color3(0.05, 0.02, 0.1);
       ground.material = groundMaterial;

             // Player character with dimensional glow
       const player = MeshBuilder.CreateSphere('player', { diameter: 1 }, scene);
       player.position = new Vector3(0, 1, 0);
       const playerMaterial = new StandardMaterial('playerMat', scene);
       playerMaterial.diffuseColor = new Color3(0, 0.8, 1);
       playerMaterial.emissiveColor = new Color3(0, 0.3, 0.5);
       player.material = playerMaterial;

             // Enhanced dimensional chambers with glow effects
       const createChamber = (name: string, position: Vector3, color: Color3, size: number = 3) => {
         const chamber = MeshBuilder.CreateBox(name, { height: 0.5, width: size, depth: size }, scene);
         chamber.position = position;
         const chamberMaterial = new StandardMaterial(`${name}Mat`, scene);
         chamberMaterial.diffuseColor = color;
         chamberMaterial.emissiveColor = color.scale(0.3);
         chamber.material = chamberMaterial;
         return chamber;
       };

       // Create dimensional chambers with proper spacing
       createChamber('realityRelocator', new Vector3(-8, 4, 0), new Color3(0.5, 0, 1), 4);
       createChamber('chronoChamber', new Vector3(8, 4, 0), new Color3(1, 0.5, 0), 4);
       createChamber('gravityChamber', new Vector3(0, 4, 8), new Color3(0, 1, 0.5), 4);
       createChamber('dreamscapeNexus', new Vector3(0, 4, -8), new Color3(1, 0, 0.5), 4);
       createChamber('voidGateway', new Vector3(-8, 4, 8), new Color3(0.8, 0, 0.8), 4);
       createChamber('dimensionalNexus', new Vector3(8, 4, -8), new Color3(0.5, 0.5, 1), 4);

       // Add floating cosmic particles
       for (let i = 0; i < 50; i++) {
         const particle = MeshBuilder.CreateSphere(`particle${i}`, { diameter: 0.1 }, scene);
         particle.position = new Vector3(
           (Math.random() - 0.5) * 40,
           Math.random() * 10 + 2,
           (Math.random() - 0.5) * 40
         );
         const particleMaterial = new StandardMaterial(`particleMat${i}`, scene);
         particleMaterial.diffuseColor = new Color3(
           Math.random() * 0.5 + 0.5,
           Math.random() * 0.5 + 0.5,
           Math.random() * 0.5 + 0.5
         );
         particleMaterial.emissiveColor = particleMaterial.diffuseColor.scale(0.5);
         particle.material = particleMaterial;
       }

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
    <div className="fixed inset-0 w-full h-full">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ touchAction: 'none' }}
      />
      <div className="absolute top-4 left-4 text-white bg-black/50 p-4 rounded z-10">
        <h2 className="text-xl font-bold mb-2">🌌 Dimensional Realms</h2>
        <p className="text-sm mb-2">WASD - Move</p>
        <p className="text-sm mb-2">Mouse - Look</p>
        <p className="text-sm">ESC - Exit</p>
      </div>
      <button
        onClick={onExit}
        className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded z-10"
      >
        Exit 3D World
      </button>
    </div>
  );
}
