// Galaxies Collide - Core Game Engine

import {
  Engine,
  Scene,
  Vector3,
  HemisphericLight,
  ArcRotateCamera,
  MeshBuilder,
  StandardMaterial,
  Color3
} from "@babylonjs/core";
import { GameState, Player, PerformanceConfig, TextureQuality, ShadowQuality } from "@/types/GameTypes";

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private engine: Engine;
  private scene: Scene;
  private gameState: GameState;
  private performanceConfig: PerformanceConfig;
  private isRunning: boolean = false;

  constructor(canvas: HTMLCanvasElement, performanceConfig?: PerformanceConfig) {
    this.canvas = canvas;
    this.performanceConfig = performanceConfig || this.getDefaultPerformanceConfig();
    this.gameState = this.initializeGameState();
    this.initializeEngine();
  }

  private async initializeEngine(): Promise<void> {
    try {
      this.engine = new Engine(this.canvas, true);
      this.scene = new Scene(this.engine);
      this.applyPerformanceSettings();
      this.setupBasicScene();
      this.setupRenderLoop();
      console.log("Galaxies Collide Game Engine initialized successfully");
    } catch (error) {
      console.error("Failed to initialize game engine:", error);
      throw error;
    }
  }

  private applyPerformanceSettings(): void {
    const config = this.performanceConfig;
    this.engine.setHardwareScalingLevel(this.getHardwareScalingLevel());
    this.scene.freezeActiveMeshes();
    this.scene.skipCollisions = true;
    this.scene.shadowsEnabled = config.shadowQuality !== ShadowQuality.OFF;
  }

  private getHardwareScalingLevel(): number {
    switch (this.performanceConfig.textureQuality) {
      case TextureQuality.LOW: return 2.0;
      case TextureQuality.MEDIUM: return 1.5;
      case TextureQuality.HIGH: return 1.0;
      case TextureQuality.ULTRA: return 0.5;
      default: return 1.0;
    }
  }

  private getDefaultPerformanceConfig(): PerformanceConfig {
    return {
      targetFPS: 60,
      maxDrawDistance: 1000,
      textureQuality: TextureQuality.MEDIUM,
      shadowQuality: ShadowQuality.LOW,
      particleDensity: 0.5,
      lodDistance: 500
    };
  }

  private setupBasicScene(): void {
    const camera = new ArcRotateCamera("camera", 0, Math.PI / 3, 10, Vector3.Zero(), this.scene);
    camera.attachControl(this.canvas, true);
    camera.lowerRadiusLimit = 2;
    camera.upperRadiusLimit = 20;

    const light = new HemisphericLight("light", new Vector3(0, 1, 0), this.scene);
    light.intensity = 0.7;

    const ground = MeshBuilder.CreateGround("ground", { width: 20, height: 20 }, this.scene);
    const groundMaterial = new StandardMaterial("groundMaterial", this.scene);
    groundMaterial.diffuseColor = new Color3(0.2, 0.2, 0.2);
    ground.material = groundMaterial;

    const playerMesh = MeshBuilder.CreateSphere("player", { diameter: 1 }, this.scene);
    const playerMaterial = new StandardMaterial("playerMaterial", this.scene);
    playerMaterial.diffuseColor = new Color3(0, 0.5, 1);
    playerMesh.material = playerMaterial;
    playerMesh.position = new Vector3(0, 0.5, 0);
  }

  private setupRenderLoop(): void {
    this.scene.registerBeforeRender(() => {
      this.update();
    });

    this.scene.onReadyObservable.add(() => {
      this.start();
    });
  }

  private update(): void {
    this.gameState.gameTime += this.engine.getDeltaTime() / 1000;
  }

  public start(): void {
    if (!this.isRunning) {
      this.isRunning = true;
      this.engine.runRenderLoop(() => {
        this.scene.render();
      });
      console.log("Galaxies Collide game started");
    }
  }

  public pause(): void {
    this.isRunning = false;
    this.engine.stopRenderLoop();
  }

  public resume(): void {
    if (!this.isRunning) {
      this.start();
    }
  }

  public stop(): void {
    this.isRunning = false;
    this.engine.stopRenderLoop();
    this.scene.dispose();
    this.engine.dispose();
  }

  public getGameState(): GameState {
    return this.gameState;
  }

  public setGameState(state: GameState): void {
    this.gameState = state;
  }

  public getPerformanceMetrics(): { fps: number; memoryUsage: number } {
    return {
      fps: 60,
      memoryUsage: performance.memory?.usedJSHeapSize || 0
    };
  }

  private initializeGameState(): GameState {
    return {
      player: this.createDefaultPlayer(),
      currentZone: this.createDefaultZone(),
      gameTime: 0,
      difficulty: 1,
      progression: {
        level: 1,
        experience: 0,
        skillPoints: 0,
        attributePoints: 0,
        completedZones: [],
        achievements: [],
        reputation: {
          divine: 0,
          abyss: 0,
          cosmic: 0,
          void: 0,
          neutral: 0
        }
      },
      inventory: {
        items: [],
        maxSlots: 20,
        gold: 100,
        materials: []
      },
      skills: {
        divine: [],
        abyss: [],
        hybrid: []
      }
    };
  }

  private createDefaultPlayer(): Player {
    return {
      id: "player_1",
      name: "Galactic Warrior",
      level: 1,
      experience: 0,
      health: 100,
      maxHealth: 100,
      mana: 50,
      maxMana: 50,
      position: new Vector3(0, 0, 0),
      rotation: { x: 0, y: 0, z: 0, w: 1 } as Quaternion,
      stats: {
        strength: 10,
        agility: 10,
        intelligence: 10,
        vitality: 10,
        divinePower: 0,
        abyssResistance: 0
      },
      equipment: {
        weapon: null,
        armor: null,
        accessory: null,
        gemSlots: []
      },
      skills: [],
      realm: {
        id: "earth",
        name: "Earth",
        type: "earth" as RealmType,
        difficulty: 1,
        level: 1,
        zones: [],
        portals: []
      },
      dimension: {
        id: "present",
        name: "Present",
        type: "present" as DimensionType,
        timePeriod: "modern" as TimePeriod,
        stability: 100,
        corruption: 0
      }
    };
  }

  private createDefaultZone(): GameZone {
    return {
      id: "safe_zone_1",
      name: "Sanctuary Peak",
      type: "safe_zone" as ZoneType,
      difficulty: 1,
      level: 1,
      enemies: [],
      environment: {
        terrain: "mountain" as TerrainType,
        weather: "clear" as WeatherType,
        lighting: "day" as LightingType,
        hazards: [],
        resources: []
      },
      rewards: {
        experience: 0,
        gold: 0,
        items: [],
        materials: [],
        reputation: {}
      },
      procedural: {
        seed: Math.random() * 1000000,
        complexity: 1,
        size: 1000,
        biome: "mountain_range" as BiomeType,
        modifiers: [],
        enemyDensity: 0,
        resourceDensity: 0.1,
        hazardDensity: 0
      }
    };
  }
}

import { Quaternion, RealmType, DimensionType, TimePeriod, GameZone, ZoneType, TerrainType, WeatherType, LightingType, BiomeType } from "@/types/GameTypes";
