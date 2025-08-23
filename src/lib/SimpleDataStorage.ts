// Galaxies Collide - Simple Data Storage

export interface SimplePlayerData {
  id: string;
  name: string;
  level: number;
  experience: number;
  health: number;
  maxHealth: number;
  lastSaved: number;
}

export class SimpleDataStorage {
  private static readonly STORAGE_KEY = "galaxies_collide_save";

  // Save player data to localStorage
  public static savePlayerData(data: SimplePlayerData): boolean {
    try {
      const saveData = {
        ...data,
        lastSaved: Date.now()
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(saveData));
      console.log("Player data saved successfully");
      return true;
    } catch (error) {
      console.error("Failed to save player data:", error);
      return false;
    }
  }

  // Load player data from localStorage
  public static loadPlayerData(): SimplePlayerData | null {
    try {
      const savedData = localStorage.getItem(this.STORAGE_KEY);
      if (!savedData) {
        return null;
      }

      const data = JSON.parse(savedData);
      
      // Validate data structure
      if (!this.isValidPlayerData(data)) {
        console.warn("Invalid player data found, creating new save");
        return null;
      }

      console.log("Player data loaded successfully");
      return data;
    } catch (error) {
      console.error("Failed to load player data:", error);
      return null;
    }
  }

  // Create new player data
  public static createNewPlayer(name: string): SimplePlayerData {
    return {
      id: `player_${Date.now()}`,
      name: name,
      level: 1,
      experience: 0,
      health: 100,
      maxHealth: 100,
      lastSaved: Date.now()
    };
  }

  // Check if save data exists
  public static hasSaveData(): boolean {
    return localStorage.getItem(this.STORAGE_KEY) !== null;
  }

  // Delete save data
  public static deleteSaveData(): boolean {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      console.log("Save data deleted");
      return true;
    } catch (error) {
      console.error("Failed to delete save data:", error);
      return false;
    }
  }

  // Validate player data structure
  private static isValidPlayerData(data: any): data is SimplePlayerData {
    return (
      typeof data === "object" &&
      typeof data.id === "string" &&
      typeof data.name === "string" &&
      typeof data.level === "number" &&
      typeof data.experience === "number" &&
      typeof data.health === "number" &&
      typeof data.maxHealth === "number" &&
      typeof data.lastSaved === "number"
    );
  }

  // Get save data info
  public static getSaveInfo(): { exists: boolean; lastSaved?: number } {
    const data = this.loadPlayerData();
    return {
      exists: data !== null,
      lastSaved: data?.lastSaved
    };
  }
}
