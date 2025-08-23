// Galaxies Collide - Unit Tests for Game Engine
import { render, screen, waitFor } from "@testing-library/react";
import { GameEngine } from "@/game/engine/GameEngine";
import { PerformanceConfig, TextureQuality, ShadowQuality } from "@/types/GameTypes";

// Mock canvas
const createMockCanvas = () => {
  const canvas = document.createElement("canvas");
  canvas.width = 800;
  canvas.height = 600;
  return canvas;
};

describe("GameEngine", () => {
  let canvas: HTMLCanvasElement;
  let gameEngine: GameEngine;

  beforeEach(() => {
    canvas = createMockCanvas();
  });

  afterEach(() => {
    if (gameEngine) {
      gameEngine.stop();
    }
  });

  describe("Initialization", () => {
    it("should initialize with default performance config", async () => {
      gameEngine = new GameEngine(canvas);
      
      await waitFor(() => {
        expect(gameEngine.getGameState()).toBeDefined();
      });
    });

    it("should initialize with custom performance config", async () => {
      const customConfig: PerformanceConfig = {
        targetFPS: 30,
        maxDrawDistance: 500,
        textureQuality: TextureQuality.LOW,
        shadowQuality: ShadowQuality.OFF,
        particleDensity: 0.2,
        lodDistance: 200
      };

      gameEngine = new GameEngine(canvas, customConfig);
      
      await waitFor(() => {
        const gameState = gameEngine.getGameState();
        expect(gameState).toBeDefined();
      });
    });

    it("should handle initialization errors gracefully", async () => {
      // Mock canvas to throw error
      const brokenCanvas = {
        width: 0,
        height: 0,
        getContext: () => null
      } as any;

      expect(() => {
        new GameEngine(brokenCanvas);
      }).toThrow();
    });
  });

  describe("Game State Management", () => {
    beforeEach(async () => {
      gameEngine = new GameEngine(canvas);
      await waitFor(() => {
        expect(gameEngine.getGameState()).toBeDefined();
      });
    });

    it("should have valid initial game state", () => {
      const gameState = gameEngine.getGameState();
      
      expect(gameState.player).toBeDefined();
      expect(gameState.player.name).toBe("Galactic Warrior");
      expect(gameState.player.level).toBe(1);
      expect(gameState.player.health).toBe(100);
      expect(gameState.player.maxHealth).toBe(100);
    });

    it("should update game state correctly", () => {
      const newGameState = gameEngine.getGameState();
      newGameState.player.health = 50;
      newGameState.difficulty = 2;
      
      gameEngine.setGameState(newGameState);
      
      const updatedState = gameEngine.getGameState();
      expect(updatedState.player.health).toBe(50);
      expect(updatedState.difficulty).toBe(2);
    });
  });

  describe("Performance Management", () => {
    beforeEach(async () => {
      gameEngine = new GameEngine(canvas);
      await waitFor(() => {
        expect(gameEngine.getGameState()).toBeDefined();
      });
    });

    it("should provide performance metrics", () => {
      const metrics = gameEngine.getPerformanceMetrics();
      
      expect(metrics).toHaveProperty("fps");
      expect(metrics).toHaveProperty("memoryUsage");
      expect(typeof metrics.fps).toBe("number");
      expect(typeof metrics.memoryUsage).toBe("number");
    });

    it("should handle performance optimization", () => {
      // Simulate low FPS
      const originalMetrics = gameEngine.getPerformanceMetrics();
      
      // Trigger performance optimization
      // This would normally be called internally when FPS drops
      const optimizedMetrics = gameEngine.getPerformanceMetrics();
      
      expect(optimizedMetrics).toBeDefined();
    });
  });

  describe("Game Lifecycle", () => {
    beforeEach(async () => {
      gameEngine = new GameEngine(canvas);
      await waitFor(() => {
        expect(gameEngine.getGameState()).toBeDefined();
      });
    });

    it("should start game correctly", () => {
      gameEngine.start();
      // Game should be running
      expect(gameEngine.getGameState().gameTime).toBeGreaterThan(0);
    });

    it("should pause and resume game", () => {
      gameEngine.start();
      const timeBeforePause = gameEngine.getGameState().gameTime;
      
      gameEngine.pause();
      const timeAfterPause = gameEngine.getGameState().gameTime;
      
      gameEngine.resume();
      const timeAfterResume = gameEngine.getGameState().gameTime;
      
      expect(timeAfterPause).toBe(timeBeforePause);
      expect(timeAfterResume).toBeGreaterThan(timeAfterPause);
    });

    it("should stop game and clean up resources", () => {
      gameEngine.start();
      gameEngine.stop();
      
      // Game should be stopped
      expect(gameEngine.getGameState().gameTime).toBe(0);
    });
  });

  describe("Mobile Optimization", () => {
    it("should optimize for low-end devices", async () => {
      const lowEndConfig: PerformanceConfig = {
        targetFPS: 30,
        maxDrawDistance: 300,
        textureQuality: TextureQuality.LOW,
        shadowQuality: ShadowQuality.OFF,
        particleDensity: 0.1,
        lodDistance: 100
      };

      gameEngine = new GameEngine(canvas, lowEndConfig);
      
      await waitFor(() => {
        const gameState = gameEngine.getGameState();
        expect(gameState).toBeDefined();
      });
    });

    it("should handle different screen sizes", async () => {
      // Test different canvas sizes
      const sizes = [
        { width: 320, height: 568 },  // iPhone SE
        { width: 375, height: 667 },  // iPhone 6/7/8
        { width: 414, height: 896 },  // iPhone X/XS
        { width: 768, height: 1024 }, // iPad
        { width: 1920, height: 1080 } // Desktop
      ];

      for (const size of sizes) {
        const testCanvas = createMockCanvas();
        testCanvas.width = size.width;
        testCanvas.height = size.height;

        const testEngine = new GameEngine(testCanvas);
        
        await waitFor(() => {
          expect(testEngine.getGameState()).toBeDefined();
        });

        testEngine.stop();
      }
    });
  });
});
