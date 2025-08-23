// Galaxies Collide - Performance Metrics Collector
import { GameState, PerformanceMetrics, PlayerMetrics, GameMetrics } from "@/types/GameTypes";

export class PerformanceCollector {
  private metrics: PerformanceMetrics[] = [];
  private playerMetrics: PlayerMetrics[] = [];
  private gameMetrics: GameMetrics[] = [];
  private startTime: number = Date.now();
  private isCollecting: boolean = false;
  private collectionInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.startCollection();
  }

  public startCollection(intervalMs: number = 1000): void {
    if (this.isCollecting) return;

    this.isCollecting = true;
    this.collectionInterval = setInterval(() => {
      this.collectMetrics();
    }, intervalMs);

    console.log("Performance collection started");
  }

  public stopCollection(): void {
    if (this.collectionInterval) {
      clearInterval(this.collectionInterval);
      this.collectionInterval = null;
    }
    this.isCollecting = false;
    console.log("Performance collection stopped");
  }

  private collectMetrics(): void {
    const currentTime = Date.now();
    const sessionTime = currentTime - this.startTime;

    // Collect performance metrics
    const performanceMetrics: PerformanceMetrics = {
      fps: this.getCurrentFPS(),
      memoryUsage: this.getMemoryUsage(),
      cpuUsage: this.getCPUUsage(),
      networkLatency: this.getNetworkLatency()
    };

    // Collect player metrics
    const playerMetrics: PlayerMetrics = {
      activePlayers: this.getActivePlayers(),
      averageSessionTime: this.getAverageSessionTime(),
      retentionRate: this.getRetentionRate(),
      progressionRate: this.getProgressionRate()
    };

    // Collect game metrics
    const gameMetrics: GameMetrics = {
      zonesCompleted: this.getZonesCompleted(),
      enemiesDefeated: this.getEnemiesDefeated(),
      itemsCrafted: this.getItemsCrafted(),
      achievementsUnlocked: this.getAchievementsUnlocked()
    };

    // Store metrics
    this.metrics.push(performanceMetrics);
    this.playerMetrics.push(playerMetrics);
    this.gameMetrics.push(gameMetrics);

    // Keep only last 1000 metrics to prevent memory issues
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000);
    }
    if (this.playerMetrics.length > 1000) {
      this.playerMetrics = this.playerMetrics.slice(-1000);
    }
    if (this.gameMetrics.length > 1000) {
      this.gameMetrics = this.gameMetrics.slice(-1000);
    }
  }

  private getCurrentFPS(): number {
    // This would be provided by the game engine
    return Math.random() * 60 + 30; // Simulated FPS between 30-90
  }

  private getMemoryUsage(): number {
    if (performance.memory) {
      return performance.memory.usedJSHeapSize / 1024 / 1024; // MB
    }
    return 0;
  }

  private getCPUUsage(): number {
    // This would require more sophisticated monitoring
    return Math.random() * 100; // Simulated CPU usage
  }

  private getNetworkLatency(): number {
    // This would measure actual network latency
    return Math.random() * 100; // Simulated latency in ms
  }

  private getActivePlayers(): number {
    // This would come from the game server
    return Math.floor(Math.random() * 100) + 1; // Simulated active players
  }

  private getAverageSessionTime(): number {
    // Calculate average session time from collected data
    if (this.playerMetrics.length === 0) return 0;
    
    const totalTime = this.playerMetrics.reduce((sum, metric) => sum + metric.averageSessionTime, 0);
    return totalTime / this.playerMetrics.length;
  }

  private getRetentionRate(): number {
    // This would be calculated from player return data
    return Math.random() * 100; // Simulated retention rate
  }

  private getProgressionRate(): number {
    // This would be calculated from player progression data
    return Math.random() * 100; // Simulated progression rate
  }

  private getZonesCompleted(): number {
    // This would come from game state
    return Math.floor(Math.random() * 50); // Simulated zones completed
  }

  private getEnemiesDefeated(): number {
    // This would come from game state
    return Math.floor(Math.random() * 1000); // Simulated enemies defeated
  }

  private getItemsCrafted(): number {
    // This would come from game state
    return Math.floor(Math.random() * 100); // Simulated items crafted
  }

  private getAchievementsUnlocked(): number {
    // This would come from game state
    return Math.floor(Math.random() * 20); // Simulated achievements unlocked
  }

  public getMetrics(): {
    performance: PerformanceMetrics[];
    player: PlayerMetrics[];
    game: GameMetrics[];
  } {
    return {
      performance: this.metrics,
      player: this.playerMetrics,
      game: this.gameMetrics
    };
  }

  public getLatestMetrics(): {
    performance: PerformanceMetrics;
    player: PlayerMetrics;
    game: GameMetrics;
  } {
    return {
      performance: this.metrics[this.metrics.length - 1] || this.getEmptyPerformanceMetrics(),
      player: this.playerMetrics[this.playerMetrics.length - 1] || this.getEmptyPlayerMetrics(),
      game: this.gameMetrics[this.gameMetrics.length - 1] || this.getEmptyGameMetrics()
    };
  }

  public getAverageMetrics(): {
    performance: PerformanceMetrics;
    player: PlayerMetrics;
    game: GameMetrics;
  } {
    return {
      performance: this.calculateAveragePerformance(),
      player: this.calculateAveragePlayer(),
      game: this.calculateAverageGame()
    };
  }

  private calculateAveragePerformance(): PerformanceMetrics {
    if (this.metrics.length === 0) return this.getEmptyPerformanceMetrics();

    const avg = this.metrics.reduce((sum, metric) => ({
      fps: sum.fps + metric.fps,
      memoryUsage: sum.memoryUsage + metric.memoryUsage,
      cpuUsage: sum.cpuUsage + metric.cpuUsage,
      networkLatency: sum.networkLatency + metric.networkLatency
    }), { fps: 0, memoryUsage: 0, cpuUsage: 0, networkLatency: 0 });

    return {
      fps: avg.fps / this.metrics.length,
      memoryUsage: avg.memoryUsage / this.metrics.length,
      cpuUsage: avg.cpuUsage / this.metrics.length,
      networkLatency: avg.networkLatency / this.metrics.length
    };
  }

  private calculateAveragePlayer(): PlayerMetrics {
    if (this.playerMetrics.length === 0) return this.getEmptyPlayerMetrics();

    const avg = this.playerMetrics.reduce((sum, metric) => ({
      activePlayers: sum.activePlayers + metric.activePlayers,
      averageSessionTime: sum.averageSessionTime + metric.averageSessionTime,
      retentionRate: sum.retentionRate + metric.retentionRate,
      progressionRate: sum.progressionRate + metric.progressionRate
    }), { activePlayers: 0, averageSessionTime: 0, retentionRate: 0, progressionRate: 0 });

    return {
      activePlayers: avg.activePlayers / this.playerMetrics.length,
      averageSessionTime: avg.averageSessionTime / this.playerMetrics.length,
      retentionRate: avg.retentionRate / this.playerMetrics.length,
      progressionRate: avg.progressionRate / this.playerMetrics.length
    };
  }

  private calculateAverageGame(): GameMetrics {
    if (this.gameMetrics.length === 0) return this.getEmptyGameMetrics();

    const avg = this.gameMetrics.reduce((sum, metric) => ({
      zonesCompleted: sum.zonesCompleted + metric.zonesCompleted,
      enemiesDefeated: sum.enemiesDefeated + metric.enemiesDefeated,
      itemsCrafted: sum.itemsCrafted + metric.itemsCrafted,
      achievementsUnlocked: sum.achievementsUnlocked + metric.achievementsUnlocked
    }), { zonesCompleted: 0, enemiesDefeated: 0, itemsCrafted: 0, achievementsUnlocked: 0 });

    return {
      zonesCompleted: avg.zonesCompleted / this.gameMetrics.length,
      enemiesDefeated: avg.enemiesDefeated / this.gameMetrics.length,
      itemsCrafted: avg.itemsCrafted / this.gameMetrics.length,
      achievementsUnlocked: avg.achievementsUnlocked / this.gameMetrics.length
    };
  }

  private getEmptyPerformanceMetrics(): PerformanceMetrics {
    return { fps: 0, memoryUsage: 0, cpuUsage: 0, networkLatency: 0 };
  }

  private getEmptyPlayerMetrics(): PlayerMetrics {
    return { activePlayers: 0, averageSessionTime: 0, retentionRate: 0, progressionRate: 0 };
  }

  private getEmptyGameMetrics(): GameMetrics {
    return { zonesCompleted: 0, enemiesDefeated: 0, itemsCrafted: 0, achievementsUnlocked: 0 };
  }

  public exportMetrics(): string {
    const data = {
      timestamp: new Date().toISOString(),
      sessionDuration: Date.now() - this.startTime,
      metrics: this.getMetrics(),
      averages: this.getAverageMetrics()
    };

    return JSON.stringify(data, null, 2);
  }

  public saveMetricsToFile(filename: string): void {
    const fs = require("fs");
    const data = this.exportMetrics();
    fs.writeFileSync(filename, data);
    console.log(`Metrics saved to ${filename}`);
  }
}
