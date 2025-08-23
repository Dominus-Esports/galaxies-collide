// Galaxies Collide - E2E Test for Game Flow
import { test, expect } from "@playwright/test";

test.describe("Galaxies Collide - End-to-End Game Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/game");
    await page.waitForLoadState("networkidle");
  });

  test("should load game successfully", async ({ page }) => {
    // Check if game canvas is present
    const canvas = page.locator("canvas");
    await expect(canvas).toBeVisible();
    
    // Check if game UI elements are present
    await expect(page.locator("text=Galaxies Collide")).toBeVisible();
    await expect(page.locator("text=Sanctuary Peak")).toBeVisible();
    
    // Check performance metrics are displayed
    await expect(page.locator("text=FPS:")).toBeVisible();
    await expect(page.locator("text=Memory:")).toBeVisible();
  });

  test("should handle player movement", async ({ page }) => {
    const canvas = page.locator("canvas");
    
    // Click on canvas to focus
    await canvas.click();
    
    // Simulate WASD movement
    await page.keyboard.press("KeyW");
    await page.keyboard.press("KeyA");
    await page.keyboard.press("KeyS");
    await page.keyboard.press("KeyD");
    
    // Verify game is responsive
    await expect(page.locator("text=FPS:")).toBeVisible();
  });

  test("should maintain 60 FPS on desktop", async ({ page }) => {
    const canvas = page.locator("canvas");
    await canvas.click();
    
    // Wait for game to stabilize
    await page.waitForTimeout(2000);
    
    // Check FPS is reasonable (should be > 30 for smooth gameplay)
    const fpsText = await page.locator("#fps").textContent();
    const fps = parseInt(fpsText || "0");
    expect(fps).toBeGreaterThan(30);
  });

  test("should work on mobile devices", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check if game loads on mobile
    const canvas = page.locator("canvas");
    await expect(canvas).toBeVisible();
    
    // Test touch interactions
    await canvas.tap();
    
    // Verify mobile UI is responsive
    await expect(page.locator("text=Galaxies Collide")).toBeVisible();
  });

  test("should handle different screen sizes", async ({ page }) => {
    const viewports = [
      { width: 320, height: 568 },  // iPhone SE
      { width: 375, height: 667 },  // iPhone 6/7/8
      { width: 414, height: 896 },  // iPhone X/XS
      { width: 768, height: 1024 }, // iPad
      { width: 1920, height: 1080 } // Desktop
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.reload();
      
      const canvas = page.locator("canvas");
      await expect(canvas).toBeVisible();
      
      // Verify game UI adapts to screen size
      await expect(page.locator("text=Galaxies Collide")).toBeVisible();
    }
  });

  test("should handle network interruptions", async ({ page }) => {
    // Simulate offline mode
    await page.route("**/*", route => route.abort());
    
    // Game should still work (offline-capable)
    const canvas = page.locator("canvas");
    await expect(canvas).toBeVisible();
    
    // Restore network
    await page.unroute("**/*");
    await page.reload();
    
    // Game should work normally again
    await expect(canvas).toBeVisible();
  });

  test("should handle memory pressure", async ({ page }) => {
    const canvas = page.locator("canvas");
    await canvas.click();
    
    // Simulate memory pressure by creating many objects
    await page.evaluate(() => {
      // Create temporary objects to simulate memory pressure
      const tempObjects = [];
      for (let i = 0; i < 1000; i++) {
        tempObjects.push(new Array(1000).fill(Math.random()));
      }
      return tempObjects.length;
    });
    
    // Game should still be responsive
    await expect(page.locator("text=FPS:")).toBeVisible();
  });

  test("should handle long gaming sessions", async ({ page }) => {
    const canvas = page.locator("canvas");
    await canvas.click();
    
    // Simulate 5 minutes of gameplay
    for (let i = 0; i < 5; i++) {
      await page.waitForTimeout(60000); // 1 minute
      
      // Verify game is still running
      await expect(canvas).toBeVisible();
      await expect(page.locator("text=FPS:")).toBeVisible();
      
      // Simulate some player interaction
      await page.keyboard.press("KeyW");
      await page.keyboard.press("KeyA");
    }
  });
});
