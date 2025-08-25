'use client';

import { useEffect, useState } from 'react';
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

interface DimensionalEnemy {
  id: string;
  name: string;
  health: number;
  maxHealth: number;
  level: number;
  type: string;
  abilities: string[];
  dimensionalEffects: string[];
}

interface DimensionalCombatProps {
  chamber: Chamber;
  onExit: () => void;
  onComplete: (rewards: string[]) => void;
}

export default function DimensionalCombat({ chamber, onExit, onComplete }: DimensionalCombatProps) {
  const { player, updatePlayer } = useGameStore();
  const [enemies, setEnemies] = useState<DimensionalEnemy[]>([]);
  const [combatLog, setCombatLog] = useState<string[]>([]);
  const [isCombatActive, setIsCombatActive] = useState(false);
  const [currentTurn, setCurrentTurn] = useState<'player' | 'enemy'>('player');
  const [rewards, setRewards] = useState<string[]>([]);

  // Generate dimensional enemies based on chamber
  useEffect(() => {
    const generateEnemies = () => {
      const enemyTypes = {
        reality: ['Reality Shifter', 'Quantum Phantom', 'Dimensional Drifter'],
        dream: ['Nightmare Manifestation', 'Dream Eater', 'Subconscious Shadow'],
        dimension: ['Temporal Echo', 'Space Distorter', 'Dimensional Anomaly'],
        world: ['Gravity Defier', 'Spatial Manipulator', 'World Bender'],
        void: ['Void Corruptor', 'Reality Breaker', 'Void Walker']
      };

      const chamberEnemies = enemyTypes[chamber.type] || ['Dimensional Entity'];
      const numEnemies = Math.min(3, Math.floor(chamber.level / 2) + 1);

      const newEnemies: DimensionalEnemy[] = [];

      for (let i = 0; i < numEnemies; i++) {
        const enemyName = chamberEnemies[Math.floor(Math.random() * chamberEnemies.length)];
        const enemyLevel = chamber.level + Math.floor(Math.random() * 3);

        newEnemies.push({
          id: `enemy-${i}-${Date.now()}`,
          name: enemyName,
          health: 50 + (enemyLevel * 10),
          maxHealth: 50 + (enemyLevel * 10),
          level: enemyLevel,
          type: chamber.type,
          abilities: getEnemyAbilities(chamber.type),
          dimensionalEffects: getDimensionalEffects(chamber)
        });
      }

      setEnemies(newEnemies);
      setIsCombatActive(true);
      addCombatLog(`🌌 Entered ${chamber.name} - ${chamber.type} realm`);
      addCombatLog(`⚔️ Encountered ${newEnemies.length} dimensional entities!`);
    };

    generateEnemies();
  }, [chamber]);

  const getEnemyAbilities = (type: string): string[] => {
    const abilities = {
      reality: ['Reality Shift', 'Quantum Strike', 'Dimensional Rift'],
      dream: ['Nightmare Grasp', 'Dream Drain', 'Subconscious Attack'],
      dimension: ['Time Warp', 'Space Distortion', 'Dimensional Pull'],
      world: ['Gravity Crush', 'Spatial Tear', 'World Bend'],
      void: ['Void Corruption', 'Reality Break', 'Void Drain']
    };

    return abilities[type] || ['Dimensional Strike'];
  };

  const getDimensionalEffects = (chamber: Chamber): string[] => {
    return chamber.modifiers.map(mod => `${mod} Active`);
  };

  const addCombatLog = (message: string) => {
    setCombatLog(prev => [...prev.slice(-9), message]);
  };

  const handleAttack = () => {
    if (!isCombatActive || enemies.length === 0 || currentTurn !== 'player') return;

    const enemy = enemies[0];
    const damage = Math.floor(Math.random() * 30) + 20 + (player.level * 5);

    const newEnemies = [...enemies];
    newEnemies[0] = { ...enemy, health: Math.max(0, enemy.health - damage) };

    addCombatLog(`⚔️ You deal ${damage} damage to ${enemy.name}!`);

    if (newEnemies[0].health <= 0) {
      addCombatLog(`💀 ${enemy.name} has been defeated!`);
      newEnemies.shift();

      // Add rewards
      const chamberRewards = chamber.rewards[Math.floor(Math.random() * chamber.rewards.length)];
      setRewards(prev => [...prev, chamberRewards]);
      addCombatLog(`🎁 Gained ${chamberRewards}!`);
    }

    setEnemies(newEnemies);
    setCurrentTurn('enemy');

    // Check if all enemies defeated
    if (newEnemies.length === 0) {
      handleCombatVictory();
      return;
    }

    // Enemy turn after delay
    setTimeout(() => {
      handleEnemyTurn(newEnemies);
    }, 1000);
  };

  const handleEnemyTurn = (currentEnemies: DimensionalEnemy[]) => {
    if (currentEnemies.length === 0) return;

    const enemy = currentEnemies[0];
    const ability = enemy.abilities[Math.floor(Math.random() * enemy.abilities.length)];
    const damage = Math.floor(Math.random() * 25) + 15 + (enemy.level * 3);

    addCombatLog(`👹 ${enemy.name} uses ${ability} for ${damage} damage!`);

    updatePlayer({
      ...player,
      health: Math.max(0, player.health - damage)
    });

    setCurrentTurn('player');

    // Check if player defeated
    if (player.health - damage <= 0) {
      handleCombatDefeat();
    }
  };

  const handleCombatVictory = () => {
    setIsCombatActive(false);
    addCombatLog(`🎉 Victory! Chamber completed!`);
    addCombatLog(`📈 Gained ${chamber.experienceReward} experience!`);

    updatePlayer({
      ...player,
      experience: player.experience + chamber.experienceReward
    });

    setTimeout(() => {
      onComplete(rewards);
    }, 2000);
  };

  const handleCombatDefeat = () => {
    setIsCombatActive(false);
    addCombatLog(`💀 Defeat! You have been overwhelmed by the dimensional forces.`);

    setTimeout(() => {
      onExit();
    }, 2000);
  };

  const handleSpecialAbility = () => {
    if (!isCombatActive || currentTurn !== 'player') return;

    const specialAbilities = {
      reality: 'Reality Anchor',
      dream: 'Dream Shield',
      dimension: 'Time Freeze',
      world: 'Gravity Shield',
      void: 'Void Barrier'
    };

    const ability = specialAbilities[chamber.type] || 'Dimensional Shield';
    addCombatLog(`🛡️ Used ${ability} - Reduced damage taken!`);

    setCurrentTurn('enemy');

    setTimeout(() => {
      handleEnemyTurn(enemies);
    }, 1000);
  };

  const handleRetreat = () => {
    addCombatLog(`🏃 Retreating from ${chamber.name}...`);
    setIsCombatActive(false);

    setTimeout(() => {
      onExit();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-black text-white p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-cyan-400">
          {chamber.type === 'reality' && '🌌'}
          {chamber.type === 'dream' && '💭'}
          {chamber.type === 'dimension' && '🌀'}
          {chamber.type === 'world' && '🌍'}
          {chamber.type === 'void' && '⚫'}
          {' '}{chamber.name}
        </h1>
        <div className="text-sm text-gray-400">
          {chamber.difficulty.toUpperCase()} • Level {chamber.level}
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

            {/* Combat Actions */}
            {isCombatActive && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3 text-green-400">Combat Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={handleAttack}
                    disabled={currentTurn !== 'player'}
                    className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors font-semibold"
                  >
                    ⚔️ Attack
                  </button>

                  <button
                    onClick={handleSpecialAbility}
                    disabled={currentTurn !== 'player'}
                    className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors font-semibold"
                  >
                    🛡️ Special Ability
                  </button>

                  <button
                    onClick={handleRetreat}
                    className="w-full py-3 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors font-semibold"
                  >
                    🏃 Retreat
                  </button>
                </div>
              </div>
            )}

            {/* Turn Indicator */}
            {isCombatActive && (
              <div className="mt-4 p-3 rounded-lg text-center">
                <div className={`text-lg font-bold ${currentTurn === 'player' ? 'text-green-400' : 'text-red-400'}`}>
                  {currentTurn === 'player' ? '🎯 Your Turn' : '👹 Enemy Turn'}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Combat Area */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-red-400">Dimensional Combat</h2>

            {enemies.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <div className="text-4xl mb-2">🎉</div>
                <p>All enemies defeated!</p>
                <p className="text-sm">Chamber completed successfully!</p>
              </div>
            ) : (
              <div className="space-y-4">
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

                    {/* Enemy Abilities */}
                    <div className="mt-2 text-xs text-gray-400">
                      Abilities: {enemy.abilities.join(', ')}
                    </div>

                    {/* Dimensional Effects */}
                    {enemy.dimensionalEffects.length > 0 && (
                      <div className="mt-1 text-xs text-orange-400">
                        Effects: {enemy.dimensionalEffects.join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Combat Log & Rewards */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-yellow-400">Combat Log</h2>

            <div className="bg-gray-900 rounded-lg p-3 h-64 overflow-y-auto mb-4">
              {combatLog.map((log, index) => (
                <div key={index} className="text-sm text-gray-300 mb-1">
                  {log}
                </div>
              ))}
            </div>

            {/* Chamber Modifiers */}
            {chamber.modifiers.length > 0 && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2 text-orange-400">Active Modifiers</h3>
                <div className="space-y-1">
                  {chamber.modifiers.map((modifier) => (
                    <div key={modifier} className="text-sm text-orange-300">
                      ⚡ {modifier}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rewards */}
            {rewards.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2 text-green-400">Rewards Gained</h3>
                <div className="space-y-1">
                  {rewards.map((reward, index) => (
                    <div key={index} className="text-sm text-green-300">
                      🎁 {reward}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
