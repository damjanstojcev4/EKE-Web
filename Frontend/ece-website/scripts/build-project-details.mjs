// Separate opt-in artifact; the existing static export and CI stay unchanged.
import { spawnSync } from "node:child_process";
const result = spawnSync(process.execPath, ["node_modules/next/dist/bin/next", "build", "project-details-runtime", "--webpack"], {
  stdio: "inherit", windowsHide: true,
  env: { ...process.env, PROJECT_DETAILS_SERVER: "true", SEO_ENVIRONMENT: "staging" },
});
process.exit(result.status ?? 1);
