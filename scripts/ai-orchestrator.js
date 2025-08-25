#!/usr/bin/env node

const { AIOrchestrator } = require("./AIOrchestrator.ts");
const { AIOrchestratorConfigManager } = require("./AIOrchestratorConfig.ts");

async function main() {
  try {
    console.log("🤖 Starting AI Orchestrator...");

    // Load configuration
    const configManager = AIOrchestratorConfigManager.getInstance();
    const config = configManager.loadFromEnvironment();

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
        console.log(`🔧 Optimizations: ${analysis.optimizations.length}`);
        console.log(`❌ Issues: ${analysis.issues.length}`);
        break;

      case "optimize":
        console.log("🔧 Running optimizations...");
        const analysisForOpt = await orchestrator.analyzeCodebase();
        if (analysisForOpt.score < 80 && analysisForOpt.optimizations.length > 0) {
          await orchestrator.makeCodeChanges(analysisForOpt.optimizations);
          console.log("✅ Optimizations applied");
        } else {
          console.log("✅ Code quality is good, no optimizations needed");
        }
        break;

      case "deploy":
        console.log("🚀 Deploying to staging...");
        await orchestrator.deployToVercel("staging");
        console.log("✅ Deployed to staging");
        break;

      case "pr":
        console.log("🚀 Creating pull request...");
        await orchestrator.createPullRequest(
          "🤖 AI Orchestrator: Automated Improvements",
          "## AI-Driven Improvements\n\nThis PR was automatically created by the AI Orchestrator system."
        );
        console.log("✅ Pull request created");
        break;

      case "run":
      default:
        console.log("�� Running full orchestration cycle...");
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
