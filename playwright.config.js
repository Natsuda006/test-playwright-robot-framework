import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",

  timeout: 60 * 1000,

  fullyParallel: false,

  reporter: [["html", { open: "never" }], ["list"]],

  use: {
    baseURL:
      process.env.PLAYWRIGHT_BASE_URL || "https://t-check-two.vercel.app",

    headless: false,

    launchOptions: {
      slowMo: 1000,
    },

    video: "on",

    screenshot: "on",

    trace: "retain-on-failure",
  },

  projects: [
    {
      name: "setup",
      testMatch: /auth\.setup\.js/,
    },

    {
      name: "admin",
      dependencies: ["setup"],

      use: {
        storageState: "playwright/.auth/admin.json",
      },

      testMatch: /admin-dashboard\.spec\.js/,
    },
  ],
});
