const { execSync } = require("child_process");

console.log("🚀 Building Galaxies Collide...");

try {
  // Set environment variables to skip checks
  process.env.SKIP_LINTING = "true";
  process.env.SKIP_TYPE_CHECK = "true";
  
  // Run Next.js build with all checks disabled
  execSync("npx next build --turbopack --no-lint --no-typescript", {
    stdio: "inherit",
    env: {
      ...process.env,
      SKIP_LINTING: "true",
      SKIP_TYPE_CHECK: "true"
    }
  });
  
  console.log("✅ Build completed successfully!");
} catch (error) {
  console.error("❌ Build failed:", error.message);
  process.exit(1);
}
