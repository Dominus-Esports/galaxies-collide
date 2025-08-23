// Galaxies Collide - PoE2-Inspired Stat Calculation System

import { Player, PlayerStats, Equipment, Item, ItemStats, Skill, SkillEffect } from "@/types/GameTypes";

export class StatCalculationSystem {
  private player: Player;

  constructor(player: Player) {
    this.player = player;
  }

  // ===== CORE STAT CALCULATIONS =====

  public calculateTotalStats(): PlayerStats {
    const baseStats = this.player.stats;
    const equipmentStats = this.calculateEquipmentStats();
    const skillStats = this.calculateSkillStats();
    const buffStats = this.calculateBuffStats();

    return {
      strength: baseStats.strength + equipmentStats.strength + skillStats.strength + buffStats.strength,
      agility: baseStats.agility + equipmentStats.agility + skillStats.agility + buffStats.agility,
      intelligence: baseStats.intelligence + equipmentStats.intelligence + skillStats.intelligence + buffStats.intelligence,
      vitality: baseStats.vitality + equipmentStats.vitality + skillStats.vitality + buffStats.vitality,
      divinePower: baseStats.divinePower + equipmentStats.divinePower + skillStats.divinePower + buffStats.divinePower,
      abyssResistance: baseStats.abyssResistance + equipmentStats.abyssResistance + skillStats.abyssResistance + buffStats.abyssResistance
    };
  }

  private calculateEquipmentStats(): PlayerStats {
    const stats: PlayerStats = {
      strength: 0,
      agility: 0,
      intelligence: 0,
      vitality: 0,
      divinePower: 0,
      abyssResistance: 0
    };

    // Weapon stats
    if (this.player.equipment.weapon) {
      this.addItemStats(stats, this.player.equipment.weapon.stats);
    }

    // Armor stats
    if (this.player.equipment.armor) {
      this.addItemStats(stats, this.player.equipment.armor.stats);
    }

    // Accessory stats
    if (this.player.equipment.accessory) {
      this.addItemStats(stats, this.player.equipment.accessory.stats);
    }

    return stats;
  }

  private addItemStats(totalStats: PlayerStats, itemStats: ItemStats): void {
    if (itemStats.strength) totalStats.strength += itemStats.strength;
    if (itemStats.agility) totalStats.agility += itemStats.agility;
    if (itemStats.intelligence) totalStats.intelligence += itemStats.intelligence;
    if (itemStats.vitality) totalStats.vitality += itemStats.vitality;
    if (itemStats.divinePower) totalStats.divinePower += itemStats.divinePower;
    if (itemStats.abyssResistance) totalStats.abyssResistance += itemStats.abyssResistance;
  }

  private calculateSkillStats(): PlayerStats {
    const stats: PlayerStats = {
      strength: 0,
      agility: 0,
      intelligence: 0,
      vitality: 0,
      divinePower: 0,
      abyssResistance: 0
    };

    // Calculate stats from active skills
    for (const skill of this.player.skills) {
      for (const effect of skill.effects) {
        this.applySkillEffectToStats(stats, effect);
      }
    }

    return stats;
  }

  private applySkillEffectToStats(stats: PlayerStats, effect: SkillEffect): void {
    // Apply skill effects to stats
    // This would be more sophisticated in a real implementation
    switch (effect.type) {
      case "buff":
        stats.strength += effect.value * 0.1;
        stats.agility += effect.value * 0.1;
        break;
    }
  }

  private calculateBuffStats(): PlayerStats {
    // Calculate stats from active buffs
    // This would track active buffs and their effects
    return {
      strength: 0,
      agility: 0,
      intelligence: 0,
      vitality: 0,
      divinePower: 0,
      abyssResistance: 0
    };
  }

  // ===== DERIVED STATS =====

  public calculateDerivedStats(): DerivedStats {
    const totalStats = this.calculateTotalStats();

    return {
      // Combat Stats
      attackPower: this.calculateAttackPower(totalStats),
      defense: this.calculateDefense(totalStats),
      criticalChance: this.calculateCriticalChance(totalStats),
      criticalMultiplier: this.calculateCriticalMultiplier(totalStats),
      dodgeChance: this.calculateDodgeChance(totalStats),
      blockChance: this.calculateBlockChance(totalStats),

      // Health & Mana
      maxHealth: this.calculateMaxHealth(totalStats),
      maxMana: this.calculateMaxMana(totalStats),
      healthRegeneration: this.calculateHealthRegeneration(totalStats),
      manaRegeneration: this.calculateManaRegeneration(totalStats),

      // Movement & Utility
      movementSpeed: this.calculateMovementSpeed(totalStats),
      attackSpeed: this.calculateAttackSpeed(totalStats),
      castSpeed: this.calculateCastSpeed(totalStats),

      // Resistances
      divineResistance: this.calculateDivineResistance(totalStats),
      abyssResistance: totalStats.abyssResistance,
      physicalResistance: this.calculatePhysicalResistance(totalStats),
      magicalResistance: this.calculateMagicalResistance(totalStats)
    };
  }

  private calculateAttackPower(stats: PlayerStats): number {
    let attackPower = 0;

    // Base attack power from strength
    attackPower += stats.strength * 2;

    // Weapon attack power
    if (this.player.equipment.weapon) {
      attackPower += this.player.equipment.weapon.stats.attack || 0;
    }

    // Divine power bonus
    attackPower += stats.divinePower * 1.5;

    return Math.max(1, attackPower);
  }

  private calculateDefense(stats: PlayerStats): number {
    let defense = 0;

    // Base defense from vitality
    defense += stats.vitality * 1.5;

    // Armor defense
    if (this.player.equipment.armor) {
      defense += this.player.equipment.armor.stats.defense || 0;
    }

    // Abyss resistance provides some defense
    defense += stats.abyssResistance * 0.5;

    return Math.max(0, defense);
  }

  private calculateCriticalChance(stats: PlayerStats): number {
    let critChance = 0.05; // Base 5%

    // Agility increases crit chance
    critChance += stats.agility * 0.001; // 0.1% per agility point

    // Equipment crit chance
    if (this.player.equipment.weapon) {
      critChance += this.player.equipment.weapon.stats.criticalChance || 0;
    }

    return Math.min(0.95, critChance); // Max 95%
  }

  private calculateCriticalMultiplier(stats: PlayerStats): number {
    let critMultiplier = 1.5; // Base 150%

    // Strength increases crit multiplier
    critMultiplier += stats.strength * 0.01; // 1% per strength point

    // Equipment crit multiplier
    if (this.player.equipment.weapon) {
      critMultiplier += this.player.equipment.weapon.stats.criticalMultiplier || 0;
    }

    return Math.max(1.0, critMultiplier);
  }

  private calculateDodgeChance(stats: PlayerStats): number {
    let dodgeChance = 0.05; // Base 5%

    // Agility increases dodge chance
    dodgeChance += stats.agility * 0.002; // 0.2% per agility point

    // Equipment dodge chance
    if (this.player.equipment.armor) {
      dodgeChance += this.player.equipment.armor.stats.dodgeChance || 0;
    }

    return Math.min(0.75, dodgeChance); // Max 75%
  }

  private calculateBlockChance(stats: PlayerStats): number {
    let blockChance = 0;

    // Vitality provides some block chance
    blockChance += stats.vitality * 0.001; // 0.1% per vitality point

    // Equipment block chance
    if (this.player.equipment.armor) {
      blockChance += this.player.equipment.armor.stats.blockChance || 0;
    }

    return Math.min(0.5, blockChance); // Max 50%
  }

  private calculateMaxHealth(stats: PlayerStats): number {
    let maxHealth = 100; // Base health

    // Vitality increases max health
    maxHealth += stats.vitality * 10;

    // Strength provides some health
    maxHealth += stats.strength * 5;

    // Equipment health bonus
    if (this.player.equipment.armor) {
      maxHealth += this.player.equipment.armor.stats.health || 0;
    }

    return Math.max(1, maxHealth);
  }

  private calculateMaxMana(stats: PlayerStats): number {
    let maxMana = 50; // Base mana

    // Intelligence increases max mana
    maxMana += stats.intelligence * 8;

    // Divine power provides some mana
    maxMana += stats.divinePower * 5;

    // Equipment mana bonus
    if (this.player.equipment.accessory) {
      maxMana += this.player.equipment.accessory.stats.mana || 0;
    }

    return Math.max(0, maxMana);
  }

  private calculateHealthRegeneration(stats: PlayerStats): number {
    let healthRegen = 1; // Base 1 HP per second

    // Vitality increases health regeneration
    healthRegen += stats.vitality * 0.1;

    // Divine power provides some health regeneration
    healthRegen += stats.divinePower * 0.05;

    return Math.max(0, healthRegen);
  }

  private calculateManaRegeneration(stats: PlayerStats): number {
    let manaRegen = 2; // Base 2 MP per second

    // Intelligence increases mana regeneration
    manaRegen += stats.intelligence * 0.2;

    // Divine power provides some mana regeneration
    manaRegen += stats.divinePower * 0.1;

    return Math.max(0, manaRegen);
  }

  private calculateMovementSpeed(stats: PlayerStats): number {
    let movementSpeed = 1.0; // Base movement speed

    // Agility increases movement speed
    movementSpeed += stats.agility * 0.01; // 1% per agility point

    // Equipment movement speed bonus
    if (this.player.equipment.armor) {
      movementSpeed += this.player.equipment.armor.stats.movementSpeed || 0;
    }

    return Math.max(0.5, Math.min(2.0, movementSpeed)); // Between 50% and 200%
  }

  private calculateAttackSpeed(stats: PlayerStats): number {
    let attackSpeed = 1.0; // Base attack speed

    // Agility increases attack speed
    attackSpeed += stats.agility * 0.01; // 1% per agility point

    // Equipment attack speed bonus
    if (this.player.equipment.weapon) {
      attackSpeed += this.player.equipment.weapon.stats.attackSpeed || 0;
    }

    return Math.max(0.5, Math.min(2.0, attackSpeed)); // Between 50% and 200%
  }

  private calculateCastSpeed(stats: PlayerStats): number {
    let castSpeed = 1.0; // Base cast speed

    // Intelligence increases cast speed
    castSpeed += stats.intelligence * 0.01; // 1% per intelligence point

    // Divine power provides some cast speed
    castSpeed += stats.divinePower * 0.005; // 0.5% per divine power point

    return Math.max(0.5, Math.min(2.0, castSpeed)); // Between 50% and 200%
  }

  private calculateDivineResistance(stats: PlayerStats): number {
    let divineResistance = 0;

    // Divine power provides divine resistance
    divineResistance += stats.divinePower * 0.5;

    // Equipment divine resistance
    if (this.player.equipment.armor) {
      divineResistance += this.player.equipment.armor.stats.divineResistance || 0;
    }

    return Math.min(0.8, divineResistance); // Max 80%
  }

  private calculatePhysicalResistance(stats: PlayerStats): number {
    let physicalResistance = 0;

    // Vitality provides some physical resistance
    physicalResistance += stats.vitality * 0.01; // 1% per vitality point

    // Equipment physical resistance
    if (this.player.equipment.armor) {
      physicalResistance += this.player.equipment.armor.stats.physicalResistance || 0;
    }

    return Math.min(0.8, physicalResistance); // Max 80%
  }

  private calculateMagicalResistance(stats: PlayerStats): number {
    let magicalResistance = 0;

    // Intelligence provides some magical resistance
    magicalResistance += stats.intelligence * 0.01; // 1% per intelligence point

    // Equipment magical resistance
    if (this.player.equipment.armor) {
      magicalResistance += this.player.equipment.armor.stats.magicalResistance || 0;
    }

    return Math.min(0.8, magicalResistance); // Max 80%
  }

  // ===== STAT MODIFIERS =====

  public applyStatModifier(modifier: StatModifier): void {
    // Apply temporary stat modifiers
    // This would be used for buffs, debuffs, etc.
  }

  public removeStatModifier(modifierId: string): void {
    // Remove temporary stat modifiers
  }

  // ===== STAT DISPLAY =====

  public getStatSummary(): StatSummary {
    const totalStats = this.calculateTotalStats();
    const derivedStats = this.calculateDerivedStats();

    return {
      baseStats: this.player.stats,
      totalStats,
      derivedStats,
      equipment: this.player.equipment,
      level: this.player.level,
      experience: this.player.experience
    };
  }
}

// ===== STAT TYPES =====

export interface DerivedStats {
  // Combat Stats
  attackPower: number;
  defense: number;
  criticalChance: number;
  criticalMultiplier: number;
  dodgeChance: number;
  blockChance: number;

  // Health & Mana
  maxHealth: number;
  maxMana: number;
  healthRegeneration: number;
  manaRegeneration: number;

  // Movement & Utility
  movementSpeed: number;
  attackSpeed: number;
  castSpeed: number;

  // Resistances
  divineResistance: number;
  abyssResistance: number;
  physicalResistance: number;
  magicalResistance: number;
}

export interface StatModifier {
  id: string;
  type: "buff" | "debuff";
  stats: Partial<PlayerStats>;
  duration: number;
  source: string;
}

export interface StatSummary {
  baseStats: PlayerStats;
  totalStats: PlayerStats;
  derivedStats: DerivedStats;
  equipment: Equipment;
  level: number;
  experience: number;
}

// Extend ItemStats interface
declare module "@/types/GameTypes" {
  interface ItemStats {
    criticalChance?: number;
    criticalMultiplier?: number;
    dodgeChance?: number;
    blockChance?: number;
    movementSpeed?: number;
    attackSpeed?: number;
    divineResistance?: number;
    physicalResistance?: number;
    magicalResistance?: number;
  }
}
