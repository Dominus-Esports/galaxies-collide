import { create } from 'zustand';

export interface Player {
  id: string;
  name: string;
  level: number;
  health: number;
  maxHealth: number;
  energy: number;
  maxEnergy: number;
  experience: number;
}

export interface Enemy {
  id: string;
  name: string;
  level: number;
  health: number;
  maxHealth: number;
  type: string;
}

interface GameState {
  player: Player;
  enemies: Enemy[];
  updatePlayer: (player: Player) => void;
  spawnEnemy: () => void;
  removeEnemy: (id: string) => void;
  resetGame: () => void;
}

const initialPlayer: Player = {
  id: 'player-1',
  name: 'Dimensional Traveler',
  level: 1,
  health: 100,
  maxHealth: 100,
  energy: 50,
  maxEnergy: 50,
  experience: 0
};

const enemyTypes = [
  { name: 'Shadow Stalker', type: 'shadow' },
  { name: 'Void Crawler', type: 'void' },
  { name: 'Reality Shifter', type: 'reality' },
  { name: 'Quantum Phantom', type: 'quantum' },
  { name: 'Dimensional Drifter', type: 'dimensional' }
];

export const useGameStore = create<GameState>((set, get) => ({
  player: initialPlayer,
  enemies: [],

  updatePlayer: (player: Player) => {
    set({ player });
  },

  spawnEnemy: () => {
    const { enemies } = get();
    if (enemies.length >= 3) return;

    const enemyType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
    const level = Math.floor(Math.random() * 3) + 1;
    const health = 30 + (level * 10);

    const newEnemy: Enemy = {
      id: `enemy-${Date.now()}`,
      name: enemyType.name,
      level,
      health,
      maxHealth: health,
      type: enemyType.type
    };

    set({ enemies: [...enemies, newEnemy] });
  },

  removeEnemy: (id: string) => {
    const { enemies } = get();
    set({ enemies: enemies.filter(enemy => enemy.id !== id) });
  },

  resetGame: () => {
    set({ player: initialPlayer, enemies: [] });
  }
}));
