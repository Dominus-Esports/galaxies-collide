// Galaxies Collide - Game Analytics System
import { GameState, PlayerMetrics, GameMetrics, PerformanceMetrics, AnalyticsData } from "@/types/GameTypes";

export class GameAnalytics {
  private analyticsData: AnalyticsData;
  private sessionStartTime: number = Date.now();
  private playerSessions: Map<string, any> = new Map();
  private gameEvents: any[] = [];

  constructor() {
    this.analyticsData = {
      playerMetrics: {
        activePlayers: 0,
        averageSessionTime: 0,
        retentionRate: 0,
        progressionRate: 0
      },
      gameMetrics: {
        zonesCompleted: 0,
        enemiesDefeated: 0,
        itemsCrafted: 0,
        achievementsUnlocked: 0
      },
      performanceMetrics: {
        fps: 0,
        memoryUsage: 0,
        cpuUsage: 0,
        networkLatency: 0
      }
    };
  }

  // Player Analytics
  public trackPlayerSession(playerId: string, sessionData: any): void {
    this.playerSessions.set(playerId, {
      ...sessionData,
      startTime: Date.now(),
      events: []
    });
  }

  public trackPlayerEvent(playerId: string, eventType: string, eventData: any): void {
    const session = this.playerSessions.get(playerId);
    if (session) {
      session.events.push({
        type: eventType,
        data: eventData,
        timestamp: Date.now()
      });
    }

    this.gameEvents.push({
      playerId,
      eventType,
      eventData,
      timestamp: Date.now()
    });
  }

  public trackPlayerProgression(playerId: string, progressionData: any): void {
    this.trackPlayerEvent(playerId, "progression", progressionData);
  }

  public trackPlayerCombat(playerId: string, combatData: any): void {
    this.trackPlayerEvent(playerId, "combat", combatData);
  }

  public trackPlayerExploration(playerId: string, explorationData: any): void {
    this.trackPlayerEvent(playerId, "exploration", explorationData);
  }

  // Game Analytics
  public trackZoneCompletion(zoneId: string, completionData: any): void {
    this.analyticsData.gameMetrics.zonesCompleted++;
    this.gameEvents.push({
      eventType: "zone_completion",
      zoneId,
      completionData,
      timestamp: Date.now()
    });
  }

  public trackEnemyDefeat(enemyId: string, defeatData: any): void {
    this.analyticsData.gameMetrics.enemiesDefeated++;
    this.gameEvents.push({
      eventType: "enemy_defeat",
      enemyId,
      defeatData,
      timestamp: Date.now()
    });
  }

  public trackItemCrafting(itemId: string, craftingData: any): void {
    this.analyticsData.gameMetrics.itemsCrafted++;
    this.gameEvents.push({
      eventType: "item_crafting",
      itemId,
      craftingData,
      timestamp: Date.now()
    });
  }

  public trackAchievementUnlock(achievementId: string, unlockData: any): void {
    this.analyticsData.gameMetrics.achievementsUnlocked++;
    this.gameEvents.push({
      eventType: "achievement_unlock",
      achievementId,
      unlockData,
      timestamp: Date.now()
    });
  }

  // Performance Analytics
  public updatePerformanceMetrics(metrics: PerformanceMetrics): void {
    this.analyticsData.performanceMetrics = metrics;
  }

  public trackPerformanceEvent(eventType: string, eventData: any): void {
    this.gameEvents.push({
      eventType: "performance",
      performanceType: eventType,
      eventData,
      timestamp: Date.now()
    });
  }

  // Analytics Calculations
  public calculatePlayerMetrics(): PlayerMetrics {
    const activeSessions = Array.from(this.playerSessions.values());
    const totalSessions = activeSessions.length;
    
    if (totalSessions === 0) {
      return {
        activePlayers: 0,
        averageSessionTime: 0,
        retentionRate: 0,
        progressionRate: 0
      };
    }

    const totalSessionTime = activeSessions.reduce((sum, session) => {
      return sum + (Date.now() - session.startTime);
    }, 0);

    const averageSessionTime = totalSessionTime / totalSessions;

    // Calculate retention rate (simplified)
    const retentionRate = this.calculateRetentionRate();

    // Calculate progression rate
    const progressionRate = this.calculateProgressionRate();

    return {
      activePlayers: totalSessions,
      averageSessionTime,
      retentionRate,
      progressionRate
    };
  }

  public calculateGameMetrics(): GameMetrics {
    return {
      zonesCompleted: this.analyticsData.gameMetrics.zonesCompleted,
      enemiesDefeated: this.analyticsData.gameMetrics.enemiesDefeated,
      itemsCrafted: this.analyticsData.gameMetrics.itemsCrafted,
      achievementsUnlocked: this.analyticsData.gameMetrics.achievementsUnlocked
    };
  }

  private calculateRetentionRate(): number {
    // This would be calculated from historical data
    // For now, return a simulated value
    return Math.random() * 100;
  }

  private calculateProgressionRate(): number {
    // Calculate based on player progression events
    const progressionEvents = this.gameEvents.filter(event => event.eventType === "progression");
    
    if (progressionEvents.length === 0) return 0;

    const totalProgression = progressionEvents.reduce((sum, event) => {
      return sum + (event.data.level || 0);
    }, 0);

    return totalProgression / progressionEvents.length;
  }

  // Data Export and Reporting
  public generateAnalyticsReport(): any {
    const report = {
      timestamp: new Date().toISOString(),
      sessionDuration: Date.now() - this.sessionStartTime,
      playerMetrics: this.calculatePlayerMetrics(),
      gameMetrics: this.calculateGameMetrics(),
      performanceMetrics: this.analyticsData.performanceMetrics,
      totalEvents: this.gameEvents.length,
      activeSessions: this.playerSessions.size,
      eventBreakdown: this.getEventBreakdown(),
      topEvents: this.getTopEvents(),
      performanceTrends: this.getPerformanceTrends()
    };

    return report;
  }

  private getEventBreakdown(): any {
    const eventCounts: { [key: string]: number } = {};
    
    this.gameEvents.forEach(event => {
      eventCounts[event.eventType] = (eventCounts[event.eventType] || 0) + 1;
    });

    return eventCounts;
  }

  private getTopEvents(): any[] {
    const eventCounts = this.getEventBreakdown();
    return Object.entries(eventCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([eventType, count]) => ({ eventType, count }));
  }

  private getPerformanceTrends(): any {
    // This would analyze performance over time
    return {
      averageFPS: this.analyticsData.performanceMetrics.fps,
      averageMemoryUsage: this.analyticsData.performanceMetrics.memoryUsage,
      averageCPUUsage: this.analyticsData.performanceMetrics.cpuUsage,
      averageNetworkLatency: this.analyticsData.performanceMetrics.networkLatency
    };
  }

  public exportAnalyticsData(): string {
    const data = {
      analytics: this.generateAnalyticsReport(),
      events: this.gameEvents,
      sessions: Array.from(this.playerSessions.entries())
    };

    return JSON.stringify(data, null, 2);
  }

  public saveAnalyticsToFile(filename: string): void {
    const fs = require("fs");
    const data = this.exportAnalyticsData();
    fs.writeFileSync(filename, data);
    console.log(`Analytics saved to ${filename}`);
  }

  // Real-time Analytics
  public getRealTimeMetrics(): any {
    return {
      activePlayers: this.playerSessions.size,
      totalEvents: this.gameEvents.length,
      sessionDuration: Date.now() - this.sessionStartTime,
      performance: this.analyticsData.performanceMetrics
    };
  }

  // Cleanup
  public cleanup(): void {
    // Remove old events (keep only last 10000)
    if (this.gameEvents.length > 10000) {
      this.gameEvents = this.gameEvents.slice(-10000);
    }

    // Remove old sessions (older than 24 hours)
    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
    for (const [playerId, session] of this.playerSessions.entries()) {
      if (session.startTime < oneDayAgo) {
        this.playerSessions.delete(playerId);
      }
    }
  }
}
