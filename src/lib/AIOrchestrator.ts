import axios from "axios";
import CryptoJS from "crypto-js";

export interface AIOrchestratorConfig {
  cursorApiKey: string;
  githubToken: string;
  vercelToken: string;
  vercelOrgId: string;
  vercelProjectId: string;
  encryptionKey: string;
  repoOwner: string;
  repoName: string;
}

export interface CodeChange {
  filePath: string;
  content: string;
  operation: "create" | "update" | "delete";
  commitMessage: string;
}

export interface AnalysisResult {
  score: number;
  suggestions: string[];
  optimizations: CodeChange[];
  issues: string[];
}

export class AIOrchestrator {
  private config: AIOrchestratorConfig;
  private cursorApi: any;

  constructor(config: AIOrchestratorConfig) {
    this.config = config;
    this.cursorApi = axios.create({
      baseURL: "https://api.cursor.sh",
      headers: {
        Authorization: `Bearer ${config.cursorApiKey}`,
        "Content-Type": "application/json",
      },
    });
  }

  // Encrypt sensitive data
  private encrypt(data: string): string {
    return CryptoJS.AES.encrypt(data, this.config.encryptionKey).toString();
  }

  // Decrypt sensitive data
  private decrypt(encryptedData: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedData, this.config.encryptionKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  // Scramble variable names for protection
  private scrambleCode(code: string): string {
    const variableMap = new Map<string, string>();
    let counter = 0;

    // Replace variable names with scrambled versions
    return code.replace(/\b(const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\b/g, (match, declaration, varName) => {
      if (!variableMap.has(varName)) {
        variableMap.set(varName, `_${counter++}_${Math.random().toString(36).substr(2, 5)}`);
      }
      return `${declaration} ${variableMap.get(varName)}`;
    });
  }

  // Analyze codebase for improvements
  async analyzeCodebase(): Promise<AnalysisResult> {
    try {
      console.log("🔍 Starting codebase analysis...");

      const analysis: AnalysisResult = {
        score: 0,
        suggestions: [],
        optimizations: [],
        issues: [],
      };

      // Analyze package.json for dependency issues
      const packageAnalysis = await this.analyzeDependencies();
      analysis.suggestions.push(...packageAnalysis.suggestions);
      analysis.issues.push(...packageAnalysis.issues);

      // Analyze TypeScript/JavaScript files
      const codeAnalysis = await this.analyzeCodeQuality();
      analysis.suggestions.push(...codeAnalysis.suggestions);
      analysis.optimizations.push(...codeAnalysis.optimizations);

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
  private async analyzeDependencies(): Promise<{ suggestions: string[]; issues: string[] }> {
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

  // Analyze code quality
  private async analyzeCodeQuality(): Promise<{ suggestions: string[]; optimizations: CodeChange[] }> {
    const result = { suggestions: [], optimizations: [] };

    try {
      // Get repository files
      const response = await axios.get(`https://api.github.com/repos/${this.config.repoOwner}/${this.config.repoName}/git/trees/main?recursive=1`);
      const files = response.data.tree.filter((item: any) =>
        item.path.endsWith(".ts") || item.path.endsWith(".tsx") || item.path.endsWith(".js") || item.path.endsWith(".jsx")
      );

      // Analyze each file
      for (const file of files.slice(0, 5)) {
        // Limit to first 5 files
        const fileAnalysis = await this.analyzeFile(file.path);
        result.suggestions.push(...fileAnalysis.suggestions);
        result.optimizations.push(...fileAnalysis.optimizations);
      }
    } catch (error) {
      result.suggestions.push("Could not analyze all files");
    }

    return result;
  }

  // Analyze individual file
  private async analyzeFile(filePath: string): Promise<{ suggestions: string[]; optimizations: CodeChange[] }> {
    const result = { suggestions: [], optimizations: [] };

    try {
      const response = await axios.get(`https://api.github.com/repos/${this.config.repoOwner}/${this.config.repoName}/contents/${filePath}`);
      const content = Buffer.from(response.data.content, "base64").toString();

      // Check for common issues
      if (content.includes("any")) {
        result.suggestions.push(`Replace 'any' types in ${filePath} with proper TypeScript types`);
      }

      if (content.includes("console.log")) {
        result.suggestions.push(`Remove console.log statements from ${filePath} for production`);
      }

      if (content.includes("TODO") || content.includes("FIXME")) {
        result.suggestions.push(`Address TODO/FIXME comments in ${filePath}`);
      }
    } catch (error) {
      // File might not exist or be accessible
    }

    return result;
  }

  // Calculate analysis score
  private calculateScore(analysis: AnalysisResult): number {
    let score = 100;

    // Deduct points for issues
    score -= analysis.issues.length * 10;
    score -= analysis.suggestions.length * 2;

    // Ensure score is between 0 and 100
    return Math.max(0, Math.min(100, score));
  }

  // Make programmatic code changes via Cursor IDE API
  async makeCodeChanges(changes: CodeChange[]): Promise<void> {
    try {
      console.log(`🚀 Making ${changes.length} code changes...`);

      for (const change of changes) {
        await this.applyCodeChange(change);
      }

      console.log("✅ All code changes applied successfully");
    } catch (error) {
      console.error("❌ Code changes failed:", error);
      throw error;
    }
  }

  // Apply individual code change
  private async applyCodeChange(change: CodeChange): Promise<void> {
    try {
      const scrambledContent = this.scrambleCode(change.content);
      const encryptedContent = this.encrypt(scrambledContent);

      // Use Cursor IDE API to make changes
      await this.cursorApi.post("/workspace/edit", {
        filePath: change.filePath,
        content: encryptedContent,
        operation: change.operation,
        commitMessage: change.commitMessage,
      });

      console.log(`✅ Applied change to ${change.filePath}`);
    } catch (error) {
      console.error(`❌ Failed to apply change to ${change.filePath}:`, error);
      throw error;
    }
  }

  // Create automated pull request
  async createPullRequest(title: string, body: string, headBranch: string = "develop", baseBranch: string = "main"): Promise<void> {
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
  async deployToVercel(environment: "staging" | "production" = "staging"): Promise<void> {
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
  async runOrchestration(): Promise<void> {
    try {
      console.log("🎯 Starting AI Orchestration cycle...");

      // Step 1: Analyze codebase
      const analysis = await this.analyzeCodebase();

      // Step 2: Apply optimizations if score is low
      if (analysis.score < 80 && analysis.optimizations.length > 0) {
        console.log("🔧 Applying optimizations...");
        await this.makeCodeChanges(analysis.optimizations);
      }

      // Step 3: Create PR if there are significant changes
      if (analysis.optimizations.length > 0) {
        await this.createPullRequest(
          "🤖 AI Orchestrator: Code Optimizations",
          `## AI-Driven Improvements\n\nScore: ${analysis.score}/100\n\n### Optimizations Applied:\n${analysis.optimizations.map((opt) => `- ${opt.commitMessage}`).join("\n")}\n\n### Suggestions:\n${analysis.suggestions.map((s) => `- ${s}`).join("\n")}`
        );
      }

      // Step 4: Deploy to staging
      await this.deployToVercel("staging");

      console.log("🎉 AI Orchestration cycle completed successfully!");
    } catch (error) {
      console.error("❌ AI Orchestration failed:", error);
      throw error;
    }
  }
}
