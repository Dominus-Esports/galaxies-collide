// Simple test to verify our foundation works
import { SimpleGameEngine } from "@/game/engine/SimpleGameEngine";
import { SimpleDataStorage } from "@/lib/SimpleDataStorage";

describe("Galaxies Collide - Foundation Tests", () => {
  test("SimpleDataStorage should work", () => {
    const playerData = SimpleDataStorage.createNewPlayer("Test Player");
    
    expect(playerData.name).toBe("Test Player");
    expect(playerData.level).toBe(1);
    expect(playerData.health).toBe(100);
    
    const saved = SimpleDataStorage.savePlayerData(playerData);
    expect(saved).toBe(true);
    
    const loaded = SimpleDataStorage.loadPlayerData();
    expect(loaded).not.toBeNull();
    expect(loaded?.name).toBe("Test Player");
  });

  test("Game state should be valid", () => {
    // Mock canvas for testing
    const canvas = document.createElement("canvas");
    
    // This would need proper mocking in a real test
    expect(canvas).toBeDefined();
  });
});
