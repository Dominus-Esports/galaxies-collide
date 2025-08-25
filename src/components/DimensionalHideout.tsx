'use client';

import { useState } from 'react';
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

interface DimensionalHideoutProps {
  onExit: () => void;
  onEnterChamber: (chamber: Chamber) => void;
}

export default function DimensionalHideout({ onExit, onEnterChamber }: DimensionalHideoutProps) {
  const { player, updatePlayer } = useGameStore();
  const [currentChamber, setCurrentChamber] = useState<string>('relocator');
  const [selectedAction, setSelectedAction] = useState<string>('');

  // Dimensional chambers - Path of Exile style
  const [chambers] = useState<Record<string, Chamber>>({
    relocator: {
      id: 'relocator',
      name: 'Reality Relocator',
      description: 'A massive quantum displacement device that can transport you to parallel realities. The air crackles with dimensional energy.',
      unlocked: true,
      level: 1,
      type: 'reality',
      difficulty: 'normal',
      modifiers: ['Dimensional Instability', 'Reality Shifts'],
      rewards: ['Reality Fragments', 'Quantum Essence'],
      energyCost: 15,
      experienceReward: 50,
      specialEffects: ['Random Reality Events', 'Temporal Distortions']
    },
    chrono: {
      id: 'chrono',
      name: 'Chrono Chamber',
      description: 'A time-bending chamber where past, present, and future converge. Time flows differently here, allowing rapid progression.',
      unlocked: player.level >= 3,
      level: 3,
      type: 'dimension',
      difficulty: 'cruel',
      modifiers: ['Time Acceleration', 'Temporal Echoes'],
      rewards: ['Chronos Shards', 'Time Crystals'],
      energyCost: 25,
      experienceReward: 100,
      specialEffects: ['Time Warp', 'Echo Combat']
    },
    gravity: {
      id: 'gravity',
      name: 'Gravity Chamber',
      description: 'A chamber where gravity itself is manipulated. Enemies float in zero-G while you maintain control through dimensional anchors.',
      unlocked: player.level >= 5,
      level: 5,
      type: 'world',
      difficulty: 'merciless',
      modifiers: ['Zero Gravity', 'Gravitational Anomalies'],
      rewards: ['Gravity Cores', 'Spatial Essence'],
      energyCost: 35,
      experienceReward: 150,
      specialEffects: ['Anti-Gravity Combat', 'Spatial Manipulation']
    },
    dreamscape: {
      id: 'dreamscape',
      name: 'Dreamscape Nexus',
      description: 'A realm where dreams become reality. Your subconscious manifests as powerful allies and nightmarish enemies.',
      unlocked: player.level >= 7,
      level: 7,
      type: 'dream',
      difficulty: 'eternal',
      modifiers: ['Dream Logic', 'Nightmare Manifestations'],
      rewards: ['Dream Essence', 'Subconscious Fragments'],
      energyCost: 50,
      experienceReward: 250,
      specialEffects: ['Dream Allies', 'Nightmare Enemies']
    },
    voidgate: {
      id: 'voidgate',
      name: 'Void Gateway',
      description: 'A portal to the void between realities. Here, the laws of physics break down and only the strongest survive.',
      unlocked: player.level >= 10,
      level: 10,
      type: 'void',
      difficulty: 'eternal',
      modifiers: ['Void Corruption', 'Reality Breakdown'],
      rewards: ['Void Essence', 'Reality Shards'],
      energyCost: 75,
      experienceReward: 500,
      specialEffects: ['Void Powers', 'Reality Manipulation']
    },
    nexus: {
      id: 'nexus',
      name: 'Dimensional Nexus',
      description: 'The central hub connecting all dimensional chambers. Here you can craft dimensional items and upgrade your hideout.',
      unlocked: true,
      level: 1,
      type: 'dimension',
      difficulty: 'normal',
      modifiers: [],
      rewards: [],
      energyCost: 0,
      experienceReward: 0,
      specialEffects: ['Crafting Station', 'Hideout Upgrades']
    }
  });

  const handleChamberAction = (action: string, chamber: Chamber) => {
    setSelectedAction(action);

    switch (action) {
      case 'enter':
        if (player.energy >= chamber.energyCost) {
          updatePlayer({
            ...player,
            energy: player.energy - chamber.energyCost
          });
          onEnterChamber(chamber);
        } else {
          setSelectedAction('insufficient_energy');
        }
        break;
      case 'upgrade':
        // Upgrade chamber logic
        if (player.experience >= 100) {
          updatePlayer({
            ...player,
            experience: player.experience - 100
          });
          setSelectedAction('chamber_upgraded');
        } else {
          setSelectedAction('insufficient_xp');
        }
        break;
      case 'craft':
        // Crafting logic
        if (player.level >= 3) {
          updatePlayer({
            ...player,
            experience: player.experience + 25
          });
          setSelectedAction('item_crafted');
        }
        break;
    }

    setTimeout(() => setSelectedAction(''), 3000);
  };

  const getChamberActions = (chamber: Chamber) => {
    const actions = [];

    if (chamber.id === 'nexus') {
      actions.push('craft');
      actions.push('upgrade');
    } else if (chamber.unlocked) {
      actions.push('enter');
      if (chamber.modifiers.length > 0) {
        actions.push('upgrade');
      }
    }

    return actions;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'normal': return 'text-green-400';
      case 'cruel': return 'text-yellow-400';
      case 'merciless': return 'text-orange-400';
      case 'eternal': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'reality': return '🌌';
      case 'dream': return '💭';
      case 'dimension': return '🌀';
      case 'world': return '🌍';
      case 'void': return '⚫';
      default: return '❓';
    }
  };

  const currentChamberData = chambers[currentChamber];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-black text-white p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-cyan-400">🌀 Dimensional Hideout</h1>
        <button
          onClick={onExit}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
        >
          Exit Hideout
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chamber Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4 text-blue-400">Dimensional Chambers</h2>
            <div className="space-y-2">
              {Object.values(chambers).map((chamber) => (
                <button
                  key={chamber.id}
                  onClick={() => setCurrentChamber(chamber.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    currentChamber === chamber.id
                      ? 'bg-cyan-600 text-white'
                      : chamber.unlocked
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                      : 'bg-gray-900 text-gray-500 cursor-not-allowed'
                  }`}
                  disabled={!chamber.unlocked}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span>{getTypeIcon(chamber.type)}</span>
                      <span>{chamber.name}</span>
                    </div>
                    {!chamber.unlocked && <span className="text-xs">🔒</span>}
                  </div>
                  {chamber.unlocked && (
                    <div className="text-xs text-gray-400 mt-1">
                      Level {chamber.level} • {chamber.difficulty}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Current Chamber */}
        <div className="lg:col-span-2">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-green-400">
                {getTypeIcon(currentChamberData.type)} {currentChamberData.name}
              </h2>
              <div className={`text-sm font-semibold ${getDifficultyColor(currentChamberData.difficulty)}`}>
                {currentChamberData.difficulty.toUpperCase()}
              </div>
            </div>

            <div className="mb-6">
              <p className="text-gray-300 leading-relaxed">
                {currentChamberData.description}
              </p>
            </div>

            {/* Chamber Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="text-sm text-gray-400">Level</div>
                <div className="text-xl font-bold text-yellow-400">{currentChamberData.level}</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="text-sm text-gray-400">Energy Cost</div>
                <div className="text-xl font-bold text-blue-400">{currentChamberData.energyCost}</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="text-sm text-gray-400">XP Reward</div>
                <div className="text-xl font-bold text-green-400">{currentChamberData.experienceReward}</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="text-sm text-gray-400">Type</div>
                <div className="text-xl font-bold text-purple-400">{currentChamberData.type}</div>
              </div>
            </div>

            {/* Chamber Modifiers */}
            {currentChamberData.modifiers.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 text-orange-400">
                  Dimensional Modifiers
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {currentChamberData.modifiers.map((modifier) => (
                    <div
                      key={modifier}
                      className="bg-orange-900/30 border border-orange-500/50 rounded-lg p-3"
                    >
                      <span className="text-orange-300">⚡ {modifier}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Special Effects */}
            {currentChamberData.specialEffects.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 text-cyan-400">
                  Special Effects
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {currentChamberData.specialEffects.map((effect) => (
                    <div
                      key={effect}
                      className="bg-cyan-900/30 border border-cyan-500/50 rounded-lg p-3"
                    >
                      <span className="text-cyan-300">✨ {effect}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Chamber Actions */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-purple-400">
                Actions
              </h3>
              <div className="flex flex-wrap gap-2">
                {getChamberActions(currentChamberData).map((action) => (
                  <button
                    key={action}
                    onClick={() => handleChamberAction(action, currentChamberData)}
                    className={`px-4 py-2 rounded-lg transition-colors capitalize font-semibold ${
                      action === 'enter'
                        ? 'bg-green-600 hover:bg-green-700'
                        : action === 'upgrade'
                        ? 'bg-yellow-600 hover:bg-yellow-700'
                        : 'bg-purple-600 hover:bg-purple-700'
                    }`}
                  >
                    {action === 'enter' && '🚪 Enter Chamber'}
                    {action === 'upgrade' && '⚡ Upgrade Chamber'}
                    {action === 'craft' && '🔨 Craft Items'}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Feedback */}
            {selectedAction && (
              <div className={`rounded-lg p-4 text-center ${
                selectedAction.includes('insufficient')
                  ? 'bg-red-600'
                  : selectedAction.includes('upgraded') || selectedAction.includes('crafted')
                  ? 'bg-green-600'
                  : 'bg-blue-600'
              }`}>
                <p className="font-semibold">
                  {selectedAction === 'insufficient_energy' && '⚠️ Not enough energy to enter chamber!'}
                  {selectedAction === 'insufficient_xp' && '⚠️ Not enough experience to upgrade!'}
                  {selectedAction === 'chamber_upgraded' && '⚡ Chamber upgraded successfully!'}
                  {selectedAction === 'item_crafted' && '🔨 Dimensional item crafted!'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Player Status & Rewards */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4 text-orange-400">
              Player Status
            </h2>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm">
                  <span>Health</span>
                  <span>{player.health}/{player.maxHealth}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full transition-all"
                    style={{ width: `${(player.health / player.maxHealth) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm">
                  <span>Energy</span>
                  <span>{player.energy}/{player.maxEnergy}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${(player.energy / player.maxEnergy) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm">
                  <span>Level</span>
                  <span>{player.level}</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm">
                  <span>Experience</span>
                  <span>{player.experience}</span>
                </div>
              </div>
            </div>

            {/* Dimensional Rewards */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3 text-cyan-400">
                Dimensional Rewards
              </h3>
              <div className="space-y-2 text-sm">
                <div className="bg-gray-700 rounded-lg p-2">
                  <div className="flex justify-between">
                    <span>Reality Fragments</span>
                    <span className="text-blue-400">0</span>
                  </div>
                </div>
                <div className="bg-gray-700 rounded-lg p-2">
                  <div className="flex justify-between">
                    <span>Chronos Shards</span>
                    <span className="text-yellow-400">0</span>
                  </div>
                </div>
                <div className="bg-gray-700 rounded-lg p-2">
                  <div className="flex justify-between">
                    <span>Gravity Cores</span>
                    <span className="text-purple-400">0</span>
                  </div>
                </div>
                <div className="bg-gray-700 rounded-lg p-2">
                  <div className="flex justify-between">
                    <span>Dream Essence</span>
                    <span className="text-pink-400">0</span>
                  </div>
                </div>
                <div className="bg-gray-700 rounded-lg p-2">
                  <div className="flex justify-between">
                    <span>Void Essence</span>
                    <span className="text-red-400">0</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Hideout Upgrades */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3 text-green-400">
                Hideout Upgrades
              </h3>
              <div className="space-y-2 text-sm">
                <div className="bg-gray-700 rounded-lg p-2">
                  <div className="flex justify-between">
                    <span>Energy Efficiency</span>
                    <span className="text-yellow-400">100 XP</span>
                  </div>
                </div>
                <div className="bg-gray-700 rounded-lg p-2">
                  <div className="flex justify-between">
                    <span>Dimensional Stability</span>
                    <span className="text-yellow-400">200 XP</span>
                  </div>
                </div>
                <div className="bg-gray-700 rounded-lg p-2">
                  <div className="flex justify-between">
                    <span>Reality Anchoring</span>
                    <span className="text-yellow-400">500 XP</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
