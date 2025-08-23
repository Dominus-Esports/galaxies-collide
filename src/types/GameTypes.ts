// Galaxies Collide - Core Game Types

import { Vector3, Quaternion } from "@babylonjs/core";

// ===== CORE GAME TYPES =====

export interface GameState {
  player: Player;
  currentZone: GameZone;
  gameTime: number;
  difficulty: number;
  progression: ProgressionData;
  inventory: Inventory;
  skills: SkillTree;
}

export interface Player {
  id: string;
  name: string;
  level: number;
  experience: number;
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  position: Vector3;
  rotation: Quaternion;
  stats: PlayerStats;
  equipment: Equipment;
  skills: Skill[];
  realm: Realm;
  dimension: Dimension;
}

export interface PlayerStats {
  strength: number;
  agility: number;
  intelligence: number;
  vitality: number;
  divinePower: number;
  abyssResistance: number;
}

export interface Equipment {
  weapon: Item | null;
  armor: Item | null;
  accessory: Item | null;
  gemSlots: GemSlot[];
}

export interface Item {
  id: string;
  name: string;
  type: ItemType;
  rarity: ItemRarity;
  level: number;
  stats: ItemStats;
  gemSlots: number;
  linkedSlots: number[];
}

export interface GemSlot {
  id: string;
  item: Item | null;
  linkedTo: string[];
}

export interface Skill {
  id: string;
  name: string;
  type: SkillType;
  level: number;
  cooldown: number;
  manaCost: number;
  damage: number;
  range: number;
  effects: SkillEffect[];
}

export interface SkillTree {
  divine: SkillNode[];
  abyss: SkillNode[];
  hybrid: SkillNode[];
}

export interface SkillNode {
  id: string;
  name: string;
  description: string;
  cost: number;
  unlocked: boolean;
  dependencies: string[];
  effects: SkillEffect[];
}

// ===== GAME ZONES & REALMS =====

export interface GameZone {
  id: string;
  name: string;
  type: ZoneType;
  difficulty: number;
  level: number;
  enemies: Enemy[];
  environment: Environment;
  rewards: Reward[];
  procedural: ProceduralConfig;
}

export enum ZoneType {
  SAFE_ZONE = "safe_zone",
  COMBAT_ZONE = "combat_zone",
  BOSS_ZONE = "boss_zone",
  REALM_PORTAL = "realm_portal"
}

export interface Environment {
  terrain: TerrainType;
  weather: WeatherType;
  lighting: LightingType;
  hazards: Hazard[];
  resources: Resource[];
}

export enum TerrainType {
  MOUNTAIN = "mountain",
  FOREST = "forest",
  DESERT = "desert",
  OCEAN = "ocean",
  COSMIC = "cosmic",
  VOID = "void"
}

export enum WeatherType {
  CLEAR = "clear",
  STORM = "storm",
  COSMIC_WIND = "cosmic_wind",
  VOID_STORM = "void_storm",
  DIVINE_LIGHT = "divine_light"
}

export enum LightingType {
  DAY = "day",
  NIGHT = "night",
  COSMIC = "cosmic",
  VOID = "void",
  DIVINE = "divine"
}

// ===== ENEMIES & COMBAT =====

export interface Enemy {
  id: string;
  name: string;
  type: EnemyType;
  level: number;
  health: number;
  maxHealth: number;
  position: Vector3;
  rotation: Quaternion;
  stats: EnemyStats;
  abilities: EnemyAbility[];
  ai: AIBehavior;
  drops: DropTable;
}

export enum EnemyType {
  ABYSS_CREATURE = "abyss_creature",
  CORRUPTED_HUMAN = "corrupted_human",
  VOID_ENTITY = "void_entity",
  COSMIC_HORROR = "cosmic_horror",
  DIVINE_SENTINEL = "divine_sentinel"
}

export interface EnemyStats {
  attack: number;
  defense: number;
  speed: number;
  intelligence: number;
  divineResistance: number;
  abyssPower: number;
}

export interface EnemyAbility {
  id: string;
  name: string;
  type: AbilityType;
  cooldown: number;
  damage: number;
  range: number;
  effects: AbilityEffect[];
}

export interface AIBehavior {
  type: AIBehaviorType;
  aggression: number;
  intelligence: number;
  groupBehavior: boolean;
  retreatThreshold: number;
}

export enum AIBehaviorType {
  PASSIVE = "passive",
  AGGRESSIVE = "aggressive",
  PACK_HUNTER = "pack_hunter",
  BOSS = "boss",
  SENTINEL = "sentinel"
}

// ===== PROGRESSION & SYSTEMS =====

export interface ProgressionData {
  level: number;
  experience: number;
  skillPoints: number;
  attributePoints: number;
  completedZones: string[];
  achievements: Achievement[];
  reputation: ReputationData;
}

export interface Inventory {
  items: Item[];
  maxSlots: number;
  gold: number;
  materials: Material[];
}

export interface Material {
  id: string;
  name: string;
  type: MaterialType;
  rarity: ItemRarity;
  quantity: number;
}

export interface Reward {
  experience: number;
  gold: number;
  items: Item[];
  materials: Material[];
  reputation: ReputationGain;
}

// ===== REALMS & DIMENSIONS =====

export interface Realm {
  id: string;
  name: string;
  type: RealmType;
  difficulty: number;
  level: number;
  zones: GameZone[];
  portals: Portal[];
}

export interface Dimension {
  id: string;
  name: string;
  type: DimensionType;
  timePeriod: TimePeriod;
  stability: number;
  corruption: number;
}

export enum RealmType {
  EARTH = "earth",
  COSMIC = "cosmic",
  VOID = "void",
  DIVINE = "divine",
  ABYSS = "abyss"
}

export enum DimensionType {
  PAST = "past",
  PRESENT = "present",
  FUTURE = "future",
  ALTERNATE = "alternate",
  PARALLEL = "parallel"
}

export enum TimePeriod {
  ANCIENT = "ancient",
  MEDIEVAL = "medieval",
  MODERN = "modern",
  FUTURISTIC = "futuristic",
  TIMELESS = "timeless"
}

// ===== PROCEDURAL GENERATION =====

export interface ProceduralConfig {
  seed: number;
  complexity: number;
  size: number;
  biome: BiomeType;
  modifiers: ZoneModifier[];
  enemyDensity: number;
  resourceDensity: number;
  hazardDensity: number;
}

export enum BiomeType {
  MOUNTAIN_RANGE = "mountain_range",
  COSMIC_FOREST = "cosmic_forest",
  VOID_DESERT = "void_desert",
  DIVINE_CITY = "divine_city",
  ABYSS_CAVES = "abyss_caves"
}

export interface ZoneModifier {
  type: ModifierType;
  intensity: number;
  duration: number;
}

export enum ModifierType {
  ENEMY_BUFF = "enemy_buff",
  PLAYER_DEBUFF = "player_debuff",
  ENVIRONMENTAL_HAZARD = "environmental_hazard",
  RESOURCE_BOOST = "resource_boost",
  EXPERIENCE_BOOST = "experience_boost"
}

// ===== UTILITY TYPES =====

export enum ItemType {
  WEAPON = "weapon",
  ARMOR = "armor",
  ACCESSORY = "accessory",
  CONSUMABLE = "consumable",
  MATERIAL = "material",
  GEM = "gem"
}

export enum ItemRarity {
  COMMON = "common",
  UNCOMMON = "uncommon",
  RARE = "rare",
  EPIC = "epic",
  LEGENDARY = "legendary",
  DIVINE = "divine"
}

export enum SkillType {
  ATTACK = "attack",
  DEFENSE = "defense",
  SUPPORT = "support",
  ULTIMATE = "ultimate",
  PASSIVE = "passive"
}

export enum AbilityType {
  MELEE = "melee",
  RANGED = "ranged",
  MAGIC = "magic",
  BUFF = "buff",
  DEBUFF = "debuff"
}

export interface ItemStats {
  attack?: number;
  defense?: number;
  health?: number;
  mana?: number;
  strength?: number;
  agility?: number;
  intelligence?: number;
  divinePower?: number;
  abyssResistance?: number;
}

export interface SkillEffect {
  type: EffectType;
  value: number;
  duration: number;
  target: EffectTarget;
}

export interface AbilityEffect {
  type: EffectType;
  value: number;
  duration: number;
  target: EffectTarget;
}

export enum EffectType {
  DAMAGE = "damage",
  HEAL = "heal",
  BUFF = "buff",
  DEBUFF = "debuff",
  STUN = "stun",
  SLOW = "slow",
  DOT = "dot",
  HOT = "hot"
}

export enum EffectTarget {
  SELF = "self",
  ENEMY = "enemy",
  ALLY = "ally",
  AREA = "area"
}

export interface DropTable {
  guaranteed: Item[];
  random: DropItem[];
  materials: Material[];
}

export interface DropItem {
  item: Item;
  chance: number;
  minQuantity: number;
  maxQuantity: number;
}

export interface Hazard {
  type: HazardType;
  position: Vector3;
  damage: number;
  duration: number;
  radius: number;
}

export enum HazardType {
  VOID_POOL = "void_pool",
  COSMIC_STORM = "cosmic_storm",
  DIVINE_LIGHTNING = "divine_lightning",
  ABYSS_CORRUPTION = "abyss_corruption"
}

export interface Resource {
  type: ResourceType;
  position: Vector3;
  quantity: number;
  respawnTime: number;
}

export enum ResourceType {
  DIVINE_CRYSTAL = "divine_crystal",
  VOID_ESSENCE = "void_essence",
  COSMIC_METAL = "cosmic_metal",
  ABYSS_SHARD = "abyss_shard"
}

export interface Portal {
  id: string;
  name: string;
  type: PortalType;
  position: Vector3;
  destination: PortalDestination;
  requirements: PortalRequirement[];
}

export enum PortalType {
  REALM = "realm",
  DIMENSION = "dimension",
  ZONE = "zone",
  SAFE_ZONE = "safe_zone"
}

export interface PortalDestination {
  realmId: string;
  dimensionId: string;
  zoneId: string;
  position: Vector3;
}

export interface PortalRequirement {
  type: RequirementType;
  value: number;
  item?: Item;
}

export enum RequirementType {
  LEVEL = "level",
  ITEM = "item",
  REPUTATION = "reputation",
  SKILL = "skill"
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  progress: number;
  maxProgress: number;
  rewards: Reward;
}

export interface ReputationData {
  divine: number;
  abyss: number;
  cosmic: number;
  void: number;
  neutral: number;
}

export interface ReputationGain {
  divine?: number;
  abyss?: number;
  cosmic?: number;
  void?: number;
  neutral?: number;
}

// ===== AUTO-SCALING & EXPANSIVE LOGIC =====

export interface ScalingConfig {
  baseDifficulty: number;
  playerLevelMultiplier: number;
  zoneLevelMultiplier: number;
  timeMultiplier: number;
  complexityMultiplier: number;
  enemyScaling: EnemyScaling;
  rewardScaling: RewardScaling;
}

export interface EnemyScaling {
  healthMultiplier: number;
  damageMultiplier: number;
  speedMultiplier: number;
  intelligenceMultiplier: number;
  abilityUnlockLevels: number[];
}

export interface RewardScaling {
  experienceMultiplier: number;
  goldMultiplier: number;
  itemRarityMultiplier: number;
  materialQuantityMultiplier: number;
}

export interface WorldState {
  globalDifficulty: number;
  corruptionLevel: number;
  divineInfluence: number;
  abyssInfluence: number;
  timeProgression: number;
  realmStability: Record<string, number>;
  dimensionStability: Record<string, number>;
}

// ===== PERFORMANCE & MOBILE OPTIMIZATION =====

export interface PerformanceConfig {
  targetFPS: number;
  maxDrawDistance: number;
  textureQuality: TextureQuality;
  shadowQuality: ShadowQuality;
  particleDensity: number;
  lodDistance: number;
}

export enum TextureQuality {
  LOW = "low",      // 320p equivalent
  MEDIUM = "medium", // 720p equivalent
  HIGH = "high",    // 1080p equivalent
  ULTRA = "ultra"   // 4K+ equivalent
}

export enum ShadowQuality {
  OFF = "off",
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high"
}

// ===== BLOCKCHAIN & DATA PERSISTENCE =====

export interface BlockchainData {
  playerId: string;
  ownership: Item[];
  achievements: Achievement[];
  reputation: ReputationData;
  transactions: Transaction[];
}

export interface Transaction {
  id: string;
  type: TransactionType;
  timestamp: number;
  data: any;
  hash: string;
}

export enum TransactionType {
  ITEM_MINT = "item_mint",
  ACHIEVEMENT_UNLOCK = "achievement_unlock",
  REPUTATION_UPDATE = "reputation_update",
  OWNERSHIP_TRANSFER = "ownership_transfer"
}

// ===== AI ORCHESTRATION =====

export interface AIOrchestration {
  masterController: MasterController;
  gameInstances: GameInstance[];
  contentGeneration: ContentGeneration;
  analytics: AnalyticsData;
}

export interface MasterController {
  id: string;
  status: ControllerStatus;
  gameInstances: string[];
  loadBalancing: LoadBalancingConfig;
}

export enum ControllerStatus {
  ONLINE = "online",
  OFFLINE = "offline",
  MAINTENANCE = "maintenance",
  OVERLOADED = "overloaded"
}

export interface GameInstance {
  id: string;
  status: InstanceStatus;
  playerCount: number;
  maxPlayers: number;
  performance: PerformanceMetrics;
}

export enum InstanceStatus {
  ACTIVE = "active",
  IDLE = "idle",
  SHUTDOWN = "shutdown",
  ERROR = "error"
}

export interface ContentGeneration {
  proceduralMaps: boolean;
  dynamicEnemies: boolean;
  adaptiveDifficulty: boolean;
  personalizedContent: boolean;
}

export interface AnalyticsData {
  playerMetrics: PlayerMetrics;
  gameMetrics: GameMetrics;
  performanceMetrics: PerformanceMetrics;
}

export interface PlayerMetrics {
  activePlayers: number;
  averageSessionTime: number;
  retentionRate: number;
  progressionRate: number;
}

export interface GameMetrics {
  zonesCompleted: number;
  enemiesDefeated: number;
  itemsCrafted: number;
  achievementsUnlocked: number;
}

export interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  cpuUsage: number;
  networkLatency: number;
}

export interface LoadBalancingConfig {
  maxInstances: number;
  minInstances: number;
  scaleUpThreshold: number;
  scaleDownThreshold: number;
}

