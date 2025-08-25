#!/usr/bin/env node

const axios = require("axios");
const CryptoJS = require("crypto-js");

class AIOrchestrator {
  constructor(config) {
    this.config = config;
    this.cursorApi = axios.create({
      baseURL: "https://api.cursor.sh",
      headers: {
        Authorization: `Bearer ${config.cursorApiKey}`,
        "Content-Type": "application/json",
      },
    });
  }

  // Analyze codebase for improvements
  async analyzeCodebase() {
    try {
      console.log("🔍 Starting codebase analysis...");

      const analysis = {
        score: 0,
        suggestions: [],
        optimizations: [],
        issues: [],
      };

      // Analyze package.json for dependency issues
      const packageAnalysis = await this.analyzeDependencies();
      analysis.suggestions.push(...packageAnalysis.suggestions);
      analysis.issues.push(...packageAnalysis.issues);

      // Calculate overall score
      analysis.score = this.calculateScore(analysis);

      console.log(`📊 Analysis complete. Score: ${analysis.score}/100`);
      return analysis;
    } catch (error) {
      console.error("❌ Analysis failed:", error);
      throw error;
    }
  }

  // Analyze dependencies
  async analyzeDependencies() {
    const result = { suggestions: [], issues: [] };

    try {
      // Check for outdated dependencies
      const response = await axios.get(`https://api.github.com/repos/${this.config.repoOwner}/${this.config.repoName}/contents/package.json`);
      const packageJson = JSON.parse(Buffer.from(response.data.content, "base64").toString());

      // Check for security vulnerabilities
      if (packageJson.dependencies) {
        Object.keys(packageJson.dependencies).forEach((dep) => {
          if (dep.includes("lodash") && !dep.includes("@types/lodash")) {
            result.suggestions.push(`Add @types/lodash for better TypeScript support`);
          }
        });
      }

      // Check for missing dev dependencies
      if (!packageJson.devDependencies?.["@types/node"]) {
        result.suggestions.push("Add @types/node for better Node.js type support");
      }
    } catch (error) {
      result.issues.push("Could not analyze dependencies");
    }

    return result;
  }

  // Calculate analysis score
  calculateScore(analysis) {
    let score = 100;

    // Deduct points for issues
    score -= analysis.issues.length * 10;
    score -= analysis.suggestions.length * 2;

    // Ensure score is between 0 and 100
    return Math.max(0, Math.min(100, score));
  }

  // Create automated pull request
  async createPullRequest(title, body, headBranch = "develop", baseBranch = "main") {
    try {
      console.log("🚀 Creating automated pull request...");

      const response = await axios.post(
        `https://api.github.com/repos/${this.config.repoOwner}/${this.config.repoName}/pulls`,
        {
          title,
          body,
          head: headBranch,
          base: baseBranch,
        },
        {
          headers: {
            Authorization: `token ${this.config.githubToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );

      console.log(`✅ Pull request created: ${response.data.html_url}`);
    } catch (error) {
      console.error("❌ Failed to create pull request:", error);
      throw error;
    }
  }

  // Deploy to Vercel
  async deployToVercel(environment = "staging") {
    try {
      console.log(`🚀 Deploying to Vercel ${environment}...`);

      const response = await axios.post(`https://api.vercel.com/v1/integrations/deploy/${this.config.vercelProjectId}`, {
        ref: environment === "production" ? "main" : "develop",
        token: this.config.vercelToken,
      });

      console.log(`✅ Deployed to ${environment}: ${response.data.url}`);
    } catch (error) {
      console.error(`❌ Failed to deploy to ${environment}:`, error);
      throw error;
    }
  }

  // Run full orchestration cycle
  async runOrchestration() {
    try {
      console.log("🎯 Starting AI Orchestration cycle...");

      // Step 1: Analyze codebase
      const analysis = await this.analyzeCodebase();

      // Step 2: Create PR if there are significant changes
      if (analysis.suggestions.length > 0) {
        await this.createPullRequest(
          "🤖 AI Orchestrator: Code Analysis",
          `## AI-Driven Analysis\n\nScore: ${analysis.score}/100\n\n### Suggestions:\n${analysis.suggestions.map((s) => `- ${s}`).join("\n")}\n\n### Issues:\n${analysis.issues.map((i) => `- ${i}`).join("\n")}`
        );
      }

      // Step 3: Deploy to staging
      await this.deployToVercel("staging");

      console.log("🎉 AI Orchestration cycle completed successfully!");
    } catch (error) {
      console.error("❌ AI Orchestration failed:", error);
      throw error;
    }
  }
}

async function main() {
  try {
    console.log("🤖 Starting AI Orchestrator...");

    // Load configuration from environment variables
    const config = {
      cursorApiKey: process.env.CURSOR_GC || "",
      githubToken: process.env.GH_TOKEN || "",
      vercelToken: process.env.VERCEL_TOKEN || "",
      vercelOrgId: process.env.VERCEL_ORG_ID || "",
      vercelProjectId: process.env.VERCEL_PROJECT_ID || "",
      encryptionKey: process.env.ENCRYPTION_KEY || "default-key",
      repoOwner: process.env.GITHUB_REPOSITORY?.split("/")[0] || "Dominus-Esports",
      repoName: process.env.GITHUB_REPOSITORY?.split("/")[1] || "galaxies-collide",
    };

    console.log("✅ Configuration loaded");
    console.log(`📁 Repository: ${config.repoOwner}/${config.repoName}`);

    // Initialize orchestrator
    const orchestrator = new AIOrchestrator(config);

    // Get command line arguments
    const args = process.argv.slice(2);
    const command = args[0] || "run";

    switch (command) {
      case "analyze":
        console.log("🔍 Running codebase analysis...");
        const analysis = await orchestrator.analyzeCodebase();
        console.log(`📊 Analysis Score: ${analysis.score}/100`);
        console.log(`💡 Suggestions: ${analysis.suggestions.length}`);
        console.log(`❌ Issues: ${analysis.issues.length}`);
        break;

      case "deploy":
        console.log("🚀 Deploying to staging...");
        await orchestrator.deployToVercel("staging");
        console.log("✅ Deployed to staging");
        break;

      case "pr":
        console.log("🚀 Creating pull request...");
        await orchestrator.createPullRequest(
          "🤖 AI Orchestrator: Automated Analysis",
          "## AI-Driven Analysis\n\nThis PR was automatically created by the AI Orchestrator system."
        );
        console.log("✅ Pull request created");
        break;

      case "run":
      default:
        console.log("🎯 Running full orchestration cycle...");
        await orchestrator.runOrchestration();
        console.log("🎉 Full orchestration completed");
        break;
    }
  } catch (error) {
    console.error("❌ AI Orchestrator failed:", error.message);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

// Run the orchestrator
main();
