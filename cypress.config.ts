// Cypress Configuration for E2E Testing
const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    supportFile: "tests/e2e/support/e2e.ts",
    specPattern: "tests/e2e/**/*.cy.{js,jsx,ts,tsx}",
    video: true,
    screenshot: true,
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    pageLoadTimeout: 30000,
    watchForFileChanges: false,
    chromeWebSecurity: false,
    experimentalModifyObstructiveThirdPartyCode: true,
    experimentalSessionAndOrigin: true,
    experimentalRunAllSpecs: true,
    experimentalMemoryManagement: true,
    experimentalInteractiveRunEvents: true,
    experimentalSkipDomainInjection: ["*.google.com"],
    experimentalSourceRewriting: true,
    experimentalModifyObstructiveThirdPartyCode: true,
    experimentalSessionAndOrigin: true,
    experimentalRunAllSpecs: true,
    experimentalMemoryManagement: true,
    experimentalInteractiveRunEvents: true,
    experimentalSkipDomainInjection: ["*.google.com"],
    experimentalSourceRewriting: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
    specPattern: "tests/unit/**/*.cy.{js,jsx,ts,tsx}",
  },
});
