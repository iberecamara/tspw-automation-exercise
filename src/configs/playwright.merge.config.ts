import { PATHS } from "@configs/paths";
import { defineConfig } from "@playwright/test";

// Used only by `report:html:merge` (see package.json) — reads the per-shard blob
// reports and writes the single, final, unsharded html+json output. Deliberately excludes
// the allure-playwright and cleanup reporters (those have their own separate merge path via
// `report:allure:export`) to avoid re-processing/duplicating Allure results during this step.
export default defineConfig({
  reporter: [
    ["html", { open: "never", outputFolder: PATHS.HTML_REPORTS_DIR }],
    ["json", { outputFile: PATHS.JSON_REPORTS_FILE }],
  ],
});
