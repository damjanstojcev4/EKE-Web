import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  workers: 1,
  use: { baseURL: "http://127.0.0.1:3198", channel: process.platform === "win32" ? "msedge" : undefined, timezoneId: "Europe/Skopje" },
  webServer: {
    command: "node scripts/serve.mjs",
    url: "http://127.0.0.1:3198",
    env: { PORT: "3198" },
    reuseExistingServer: false,
  },
});
