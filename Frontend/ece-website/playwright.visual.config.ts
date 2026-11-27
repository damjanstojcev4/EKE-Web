import { defineConfig } from "@playwright/test";

// Opt-in suite: the existing integration-test configuration stays unchanged.
export default defineConfig({
  testDir: "./tests/visual",
  testMatch: "**/*.visual.ts",
  workers: 1,
  retries: 0,
  outputDir: "test-results/visual",
  snapshotPathTemplate: "{testDir}/snapshots/{platform}/{projectName}/{arg}{ext}",
  expect: { toHaveScreenshot: { maxDiffPixels: 0, threshold: 0 } },
  use: {
    baseURL: "http://127.0.0.1:3199",
    channel: process.platform === "win32" ? "msedge" : undefined,
    // Approved Privacy captures use Intel UHD / GaneshGL. On this hybrid-GPU
    // host automatic selection can switch to NVIDIA / Graphite between runs.
    launchOptions: { args: ["--force_low_power_gpu"] },
    locale: "en-GB",
    timezoneId: "Europe/Skopje",
    deviceScaleFactor: 1,
    reducedMotion: "reduce",
    colorScheme: "light",
  },
  projects: [
    { name: "desktop", use: { viewport: { width: 1440, height: 1000 } } },
    { name: "tablet", use: { viewport: { width: 820, height: 1180 } } },
    { name: "mobile", use: { viewport: { width: 390, height: 844 } } },
  ],
  webServer: {
    command: "node scripts/serve.mjs",
    url: "http://127.0.0.1:3199",
    env: { PORT: "3199", API_PROXY_TARGET: "" },
    reuseExistingServer: false,
  },
});
