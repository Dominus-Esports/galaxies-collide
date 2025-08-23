import { NextResponse } from "next/server";

export async function GET() {
  const metrics = {
    timestamp: new Date().toISOString(),
    performance: {
      fps: Math.random() * 60 + 30,
      memoryUsage: Math.random() * 100,
      cpuUsage: Math.random() * 100,
      networkLatency: Math.random() * 50
    },
    game: {
      activePlayers: Math.floor(Math.random() * 100) + 1,
      zonesCompleted: Math.floor(Math.random() * 50),
      enemiesDefeated: Math.floor(Math.random() * 1000),
      itemsCrafted: Math.floor(Math.random() * 100)
    }
  };

  return NextResponse.json(metrics);
}
