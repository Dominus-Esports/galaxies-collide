'use client';

import { useEffect, useState } from 'react';
import BabylonGame3D from '../components/BabylonGame3D';
import DimensionalCombat from '../components/DimensionalCombat';
import DimensionalHideout from '../components/DimensionalHideout';
import { useGameStore } from '../stores/GameStore';

interface Chamber {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  level: number;
  type: 'reality' | 'dream' | 'dimension' | 'world' | 'void';
  difficulty: 'normal' | 'cruel' | 'merciless' | 'eternal';
  modifiers: string[];
  rewards: string[];
  energyCost: number;
  experienceReward: number;
  specialEffects: string[];
}

export default function Home() {
  const { player, updatePlayer, enemies, spawnEnemy, removeEnemy } = useGameStore();
  const [gameState, setGameState] = useState<'playing' | 'hideout' | 'combat' | '3d'>('playing');
  const [currentChamber, setCurrentChamber] = useState<Chamber | null>(null);
  const [lastAction, setLastAction] = useState<string>('');

  // Game loop
  useEffect(() => {
    const gameLoop = setInterval(() => {
      // Spawn enemies occasionally
      if (Math.random() < 0.1 && enemies.length < 3) {
        spawnEnemy();
      }

      // Regenerate energy slowly
      if (player.energy < player.maxEnergy) {
        updatePlayer({
          ...player,
          energy: Math.min(player.maxEnergy, player.energy + 1)
        });
      }
    }, 1000);

    return () => clearInterval(gameLoop);
  }, [player, enemies, spawnEnemy, updatePlayer]);

  const handleAttack = () => {
    if (player.energy >= 10 && enemies.length > 0) {
      const enemy = enemies[0];
      const damage = Math.floor(Math.random() * 20) + 10;

      if (enemy.health - damage <= 0) {
        // Enemy defeated
        removeEnemy(enemy.id);
        updatePlayer({
          ...player,
          experience: player.experience + 25,
          energy: player.energy - 10
        });
        setLastAction(`⚔️ Defeated ${enemy.name}! +25 XP`);
      } else {
        // Enemy takes damage
        const updatedEnemies = enemies.map(e =>
          e.id === enemy.id ? { ...e, health: e.health - damage } : e
        );
        updatePlayer({
          ...player,
          energy: player.energy - 10
        });
        setLastAction(`⚔️ Dealt ${damage} damage to ${enemy.name}!`);
      }
    } else if (player.energy < 10) {
      setLastAction('⚠️ Not enough energy to attack!');
    } else {
      setLastAction('⚠️ No enemies to attack!');
    }

    setTimeout(() => setLastAction(''), 2000);
  };

  const handleRest = () => {
    updatePlayer({
      ...player,
      health: Math.min(player.maxHealth, player.health + 15),
      energy: Math.min(player.maxEnergy, player.energy + 20)
    });
    setLastAction('💤 Rested and recovered!');
    setTimeout(() => setLastAction(''), 2000);
  };

  const handleExplore = () => {
    if (player.energy >= 5) {
      const foundItems = ['Gold', 'Potion', 'Gem', 'Scroll'];
      const foundItem = foundItems[Math.floor(Math.random() * foundItems.length)];

      updatePlayer({
        ...player,
        experience: player.experience + 10,
        energy: player.energy - 5
      });

      setLastAction(`🔍 Found ${foundItem}! +10 XP`);
    } else {
      setLastAction('⚠️ Too tired to explore!');
    }

    setTimeout(() => setLastAction(''), 2000);
  };

  const enterHideout = () => {
    setGameState('hideout');
  };

  const enter3DWorld = () => {
    setGameState('3d');
  };

  const exitHideout = () => {
    setGameState('playing');
  };

  const enterChamber = (chamber: Chamber) => {
    setCurrentChamber(chamber);
    setGameState('combat');
  };

  const exitCombat = () => {
    setCurrentChamber(null);
    setGameState('hideout');
  };

  const completeChamber = (rewards: string[]) => {
    setLastAction(`🎉 Chamber completed! Gained: ${rewards.join(', ')}`);
    setCurrentChamber(null);
    setGameState('hideout');
  };

  // Check for level up
  useEffect(() => {
    const experienceNeeded = player.level * 100;
    if (player.experience >= experienceNeeded) {
      updatePlayer({
        ...player,
        level: player.level + 1,
        experience: player.experience - experienceNeeded,
        maxHealth: player.maxHealth + 20,
        maxEnergy: player.maxEnergy + 10,
        health: player.maxHealth + 20,
        energy: player.maxEnergy + 10
      });
      setLastAction(`🎉 Level Up! You are now level ${player.level + 1}!`);
      setTimeout(() => setLastAction(''), 3000);
    }
  }, [player.experience, player.level]);

  if (gameState === 'hideout') {
    return <DimensionalHideout onExit={exitHideout} onEnterChamber={enterChamber} />;
  }

  if (gameState === 'combat' && currentChamber) {
    return <DimensionalCombat chamber={currentChamber} onExit={exitCombat} onComplete={completeChamber} />;
  }

  if (gameState === '3d') {
    return <BabylonGame3D onExit={() => setGameState('playing')} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-purple-900 to-black text-white p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-yellow-400">Galaxies Collide</h1>
        <div className="flex gap-4">
          <button
            onClick={enterHideout}
            className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors text-lg font-semibold"
          >
            🌀 Enter Dimensional Hideout
          </button>
          <button
            onClick={enter3DWorld}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-lg font-semibold"
          >
            🌌 Enter 3D World
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Player Status */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-blue-400">Player Status</h2>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Health</span>
                  <span>{player.health}/{player.maxHealth}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-red-500 h-3 rounded-full transition-all"
                    style={{ width: `${(player.health / player.maxHealth) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Energy</span>
                  <span>{player.energy}/{player.maxEnergy}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-blue-500 h-3 rounded-full transition-all"
                    style={{ width: `${(player.energy / player.maxEnergy) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="text-2xl font-bold text-yellow-400">{player.level}</div>
                  <div className="text-sm text-gray-300">Level</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="text-2xl font-bold text-green-400">{player.experience}</div>
                  <div className="text-sm text-gray-300">Experience</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Game Actions */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-green-400">Actions</h2>

            <div className="space-y-3">
              <button
                onClick={handleAttack}
                disabled={player.energy < 10 || enemies.length === 0}
                className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors font-semibold"
              >
                ⚔️ Attack (10 Energy)
              </button>

              <button
                onClick={handleRest}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-semibold"
              >
                💤 Rest
              </button>

              <button
                onClick={handleExplore}
                disabled={player.energy < 5}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors font-semibold"
              >
                🔍 Explore (5 Energy)
              </button>
            </div>

            {/* Action Feedback */}
            {lastAction && (
              <div className="mt-4 p-3 bg-green-600 rounded-lg text-center">
                <p className="font-semibold">{lastAction}</p>
              </div>
            )}
          </div>
        </div>

        {/* Enemies */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-red-400">Enemies</h2>

            {enemies.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <div className="text-4xl mb-2">🌌</div>
                <p>No enemies nearby</p>
                <p className="text-sm">Explore to find enemies!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {enemies.map((enemy) => (
                  <div key={enemy.id} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold text-red-300">{enemy.name}</h3>
                      <span className="text-sm text-gray-400">Level {enemy.level}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Health</span>
                      <span>{enemy.health}/{enemy.maxHealth}</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div
                        className="bg-red-400 h-2 rounded-full transition-all"
                        style={{ width: `${(enemy.health / enemy.maxHealth) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Game Info */}
      <div className="mt-6 bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-2 text-yellow-400">Game Info</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-300">
          <div>
            <strong>🌀 Dimensional Hideout:</strong> Your base of operations with chambers for traveling between realities, dreams, and dimensions.
          </div>
          <div>
            <strong>⚔️ Combat:</strong> Fight dimensional entities in turn-based combat with special abilities and rewards.
          </div>
          <div>
            <strong>🔍 Exploration:</strong> Search for valuable items and resources in the vast underground.
          </div>
        </div>
      </div>

      {/* Dimensional Chambers Preview */}
      <div className="mt-6 bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4 text-cyan-400">Available Dimensional Chambers</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gray-700 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <span>🌌</span>
              <span className="font-semibold">Reality Relocator</span>
            </div>
            <p className="text-sm text-gray-300">Travel to parallel realities</p>
            <p className="text-xs text-green-400">Level 1 • Normal</p>
          </div>

          <div className="bg-gray-700 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <span>🌀</span>
              <span className="font-semibold">Chrono Chamber</span>
            </div>
            <p className="text-sm text-gray-300">Bend time and space</p>
            <p className="text-xs text-yellow-400">Level 3 • Cruel</p>
          </div>

          <div className="bg-gray-700 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <span>🌍</span>
              <span className="font-semibold">Gravity Chamber</span>
            </div>
            <p className="text-sm text-gray-300">Manipulate gravity</p>
            <p className="text-xs text-orange-400">Level 5 • Merciless</p>
          </div>

          <div className="bg-gray-700 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <span>💭</span>
              <span className="font-semibold">Dreamscape Nexus</span>
            </div>
            <p className="text-sm text-gray-300">Enter dream realms</p>
            <p className="text-xs text-red-400">Level 7 • Eternal</p>
          </div>

          <div className="bg-gray-700 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <span>⚫</span>
              <span className="font-semibold">Void Gateway</span>
            </div>
            <p className="text-sm text-gray-300">Face the void</p>
            <p className="text-xs text-red-400">Level 10 • Eternal</p>
          </div>

          <div className="bg-gray-700 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <span>🌀</span>
              <span className="font-semibold">Dimensional Nexus</span>
            </div>
            <p className="text-sm text-gray-300">Craft and upgrade</p>
            <p className="text-xs text-green-400">Level 1 • Normal</p>
          </div>
        </div>
      </div>
    </div>
  );
}
