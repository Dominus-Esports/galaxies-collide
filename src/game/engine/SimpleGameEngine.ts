// Galaxies Collide - Simple, Realistic Game Engine

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

// Simple, realistic game state
export interface SimpleGameState {
  player: {
    position: Vector3;
    health: number;
    maxHealth: number;
    level: number;
    experience: number;
  };
  enemies: Array<{
    id: string;
    position: Vector3;
    health: number;
    maxHealth: number;
  }>;
  gameTime: number;
}

export class SimpleGameEngine {
  private canvas: HTMLCanvasElement;
  private engine: Engine;
  private scene: Scene;
  private gameState: SimpleGameState;
  private isRunning: boolean = false;
  private playerMesh: any;
  private enemyMeshes: Map<string, any> = new Map();

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.gameState = this.initializeGameState();
    this.initializeEngine();
  }

  private initializeGameState(): SimpleGameState {
    return {
      player: {
        position: new Vector3(0, 0, 0),
        health: 100,
        maxHealth: 100,
        level: 1,
        experience: 0
      },
      enemies: [],
      gameTime: 0
    };
  }

  private async initializeEngine(): Promise<void> {
    try {
      // Create basic BabylonJS engine
      this.engine = new Engine(this.canvas, true);
      this.scene = new Scene(this.engine);
      
      // Setup basic scene
      this.setupScene();
      
      // Setup render loop
      this.setupRenderLoop();
      
      console.log("Simple Game Engine initialized");
    } catch (error) {
      console.error("Failed to initialize engine:", error);
      throw error;
    }
  }

  private setupScene(): void {
    // Camera
    const camera = new ArcRotateCamera("camera", 0, Math.PI / 3, 10, Vector3.Zero(), this.scene);
    camera.attachControl(this.canvas, true);
    camera.lowerRadiusLimit = 2;
    camera.upperRadiusLimit = 20;

    // Light
    const light = new HemisphericLight("light", new Vector3(0, 1, 0), this.scene);
    light.intensity = 0.7;

    // Ground
    const ground = MeshBuilder.CreateGround("ground", { width: 20, height: 20 }, this.scene);
    const groundMaterial = new StandardMaterial("groundMaterial", this.scene);
    groundMaterial.diffuseColor = new Color3(0.2, 0.2, 0.2);
    ground.material = groundMaterial;

    // Player
    this.playerMesh = MeshBuilder.CreateSphere("player", { diameter: 1 }, this.scene);
    const playerMaterial = new StandardMaterial("playerMaterial", this.scene);
    playerMaterial.diffuseColor = new Color3(0, 0.5, 1);
    this.playerMesh.material = playerMaterial;
    this.playerMesh.position = this.gameState.player.position;
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
    // Update game time
    this.gameState.gameTime += this.engine.getDeltaTime() / 1000;
    
    // Update player mesh position
    if (this.playerMesh) {
      this.playerMesh.position = this.gameState.player.position;
    }
    
    // Update enemy meshes
    this.updateEnemies();
  }

  private updateEnemies(): void {
    // Simple enemy update logic
    for (const enemy of this.gameState.enemies) {
      const enemyMesh = this.enemyMeshes.get(enemy.id);
      if (enemyMesh) {
        enemyMesh.position = enemy.position;
      }
    }
  }

  // Public API - Simple and realistic
  public start(): void {
    if (!this.isRunning) {
      this.isRunning = true;
      this.engine.runRenderLoop(() => {
        this.scene.render();
      });
      console.log("Game started");
    }
  }

  public stop(): void {
    this.isRunning = false;
    this.engine.stopRenderLoop();
    this.scene.dispose();
    this.engine.dispose();
  }

  public movePlayer(direction: Vector3): void {
    const speed = 0.1;
    this.gameState.player.position.addInPlace(direction.scale(speed));
  }

  public addEnemy(position: Vector3): string {
    const enemyId = `enemy_${Date.now()}`;
    const enemy = {
      id: enemyId,
      position: position,
      health: 50,
      maxHealth: 50
    };

    this.gameState.enemies.push(enemy);

    // Create enemy mesh
    const enemyMesh = MeshBuilder.CreateSphere(enemyId, { diameter: 0.8 }, this.scene);
    const enemyMaterial = new StandardMaterial(`${enemyId}_material`, this.scene);
    enemyMaterial.diffuseColor = new Color3(1, 0, 0);
    enemyMesh.material = enemyMaterial;
    enemyMesh.position = position;

    this.enemyMeshes.set(enemyId, enemyMesh);

    return enemyId;
  }

  public attackEnemy(enemyId: string): boolean {
    const enemy = this.gameState.enemies.find(e => e.id === enemyId);
    if (!enemy) return false;

    // Simple attack - reduce enemy health
    enemy.health = Math.max(0, enemy.health - 25);

    // Remove enemy if dead
    if (enemy.health <= 0) {
      this.removeEnemy(enemyId);
      this.gameState.player.experience += 10;
      
      // Level up check
      if (this.gameState.player.experience >= this.gameState.player.level * 100) {
        this.levelUp();
      }
      
      return true;
    }

    return false;
  }

  private removeEnemy(enemyId: string): void {
    // Remove from game state
    this.gameState.enemies = this.gameState.enemies.filter(e => e.id !== enemyId);
    
    // Remove mesh
    const enemyMesh = this.enemyMeshes.get(enemyId);
    if (enemyMesh) {
      enemyMesh.dispose();
      this.enemyMeshes.delete(enemyId);
    }
  }

  private levelUp(): void {
    this.gameState.player.level++;
    this.gameState.player.experience = 0;
    this.gameState.player.maxHealth += 20;
    this.gameState.player.health = this.gameState.player.maxHealth;
    console.log(`Level up! Now level ${this.gameState.player.level}`);
  }

  public getGameState(): SimpleGameState {
    return this.gameState;
  }

  public getPlayerHealth(): number {
    return this.gameState.player.health;
  }

  public getPlayerLevel(): number {
    return this.gameState.player.level;
  }

  public getEnemyCount(): number {
    return this.gameState.enemies.length;
  }
}
