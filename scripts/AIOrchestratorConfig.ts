import { AIOrchestratorConfig } from "./AIOrchestrator";

export class AIOrchestratorConfigManager {
  private static instance: AIOrchestratorConfigManager;
  private config: AIOrchestratorConfig | null = null;

  private constructor() {}

  static getInstance(): AIOrchestratorConfigManager {
    if (!AIOrchestratorConfigManager.instance) {
      AIOrchestratorConfigManager.instance = new AIOrchestratorConfigManager();
    }
    return AIOrchestratorConfigManager.instance;
  }

  // Load configuration from environment variables
  loadFromEnvironment(): AIOrchestratorConfig {
    const config: AIOrchestratorConfig = {
      cursorApiKey: process.env.CURSOR_GC || "",
      githubToken: process.env.GH_TOKEN || "",
      vercelToken: process.env.VERCEL_TOKEN || "",
      vercelOrgId: process.env.VERCEL_ORG_ID || "",
      vercelProjectId: process.env.VERCEL_PROJECT_ID || "",
      encryptionKey: process.env.ENCRYPTION_KEY || this.generateEncryptionKey(),
      repoOwner: process.env.GITHUB_REPOSITORY?.split("/")[0] || "Dominus-Esports",
      repoName: process.env.GITHUB_REPOSITORY?.split("/")[1] || "galaxies-collide",
    };

    // Validate required fields
    this.validateConfig(config);

    this.config = config;
    return config;
  }

  // Load configuration from GitHub secrets
  async loadFromGitHubSecrets(): Promise<AIOrchestratorConfig> {
    try {
      // This would typically use GitHub API to fetch secrets
      // For now, we'll use environment variables as fallback
      return this.loadFromEnvironment();
    } catch (error) {
      console.error("Failed to load from GitHub secrets, using environment variables");
      return this.loadFromEnvironment();
    }
  }

  // Generate encryption key if not provided
  private generateEncryptionKey(): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // Validate configuration
  private validateConfig(config: AIOrchestratorConfig): void {
    const requiredFields = ["cursorApiKey", "githubToken", "vercelToken", "vercelOrgId", "vercelProjectId"];

    const missingFields = requiredFields.filter((field) => !config[field as keyof AIOrchestratorConfig]);

    if (missingFields.length > 0) {
      throw new Error(`Missing required configuration fields: ${missingFields.join(", ")}`);
    }
  }

  // Get current configuration
  getConfig(): AIOrchestratorConfig {
    if (!this.config) {
      throw new Error("Configuration not loaded. Call loadFromEnvironment() first.");
    }
    return this.config;
  }

  // Update configuration
  updateConfig(updates: Partial<AIOrchestratorConfig>): void {
    if (!this.config) {
      throw new Error("Configuration not loaded. Call loadFromEnvironment() first.");
    }

    this.config = { ...this.config, ...updates };
    this.validateConfig(this.config);
  }

  // Export configuration for external use
  exportConfig(): string {
    if (!this.config) {
      throw new Error("Configuration not loaded. Call loadFromEnvironment() first.");
    }

    // Return a sanitized version without sensitive data
    const { cursorApiKey, githubToken, vercelToken, encryptionKey, ...safeConfig } = this.config;
    return JSON.stringify(safeConfig, null, 2);
  }
}
