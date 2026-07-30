import path from "node:path";

/**
 * Centralized filesystem paths for the framework's generated artifacts (logs, reports).
 *
 * Keeping every path derived from `ROOT_DIR` here — rather than hardcoded relative paths spread
 * across `playwright.config.ts`, `AllureUtils`, `HtmlReportUtils`, the logger, etc. — means the
 * artifacts directory layout can be restructured in one place without hunting through the codebase.
 */

/** Absolute path to the project root (two levels up from `src/configs/`). */
export const ROOT_DIR = path.resolve(__dirname, "..", "..");

/** Root directory for all generated, git-ignored run artifacts. */
export const ARTIFACTS_DIR = path.join(ROOT_DIR, "artifacts");

/** Directory where per-worker Winston log files are written (see `logger.utils.ts`). */
export const LOGS_DIR = path.join(ARTIFACTS_DIR, "logs");

export const REPORTS_DIR = path.join(ARTIFACTS_DIR, "reports");
export const ALLURE_DIR = path.join(REPORTS_DIR, "allure");

/**
 * Directory Playwright writes its per-test output into (traces, videos, screenshots) — this is
 * Playwright's own `outputDir`, not to be confused with the HTML/JSON/Allure report directories
 * below. Namespaced per shard via `SHARD_INDEX` (see docker-compose.yml / docker.compose.utils.ts)
 * because Playwright clears and recreates `outputDir` at the start of every run. When sharded
 * containers all shared one un-namespaced `PLAYWRIGHT_REPORTS_DIR`, a later-starting shard's
 * startup cleanup could delete another shard's in-progress or already-written failure artifacts
 * (videos, traces) before they were ever read — a race, not a Playwright bug. Un-sharded local
 * runs (no SHARD_INDEX set) fall back to the plain, un-suffixed path.
 */
export const PLAYWRIGHT_REPORTS_DIR = path.join(
  REPORTS_DIR,
  "playwright",
  process.env.SHARD_INDEX ? `shard-${process.env.SHARD_INDEX}` : "",
);

// HTML/JSON reports are always the final MERGED output — never sharded, never suffixed.
// During a sharded run, each shard instead writes to BLOB_REPORTS_DIR (below); the merge step
// (see `report:playwright:merge` in package.json) consumes those blobs and writes here.
export const HTML_REPORTS_DIR = path.join(REPORTS_DIR, "html");
export const JSON_REPORTS_DIR = path.join(REPORTS_DIR, "json");
export const JSON_REPORTS_FILE = path.join(JSON_REPORTS_DIR, "report.json");

/**
 * Intermediate Playwright "blob" reports used only during sharded runs — one uniquely-named
 * .zip per shard, written here concurrently by every shard container. The filename itself is
 * derived automatically by Playwright from the --shard=N/M flag (see playwright.config.ts's
 * blob reporter comment), so no manual per-shard subfolder or fileName is needed here; every
 * shard safely shares this single directory. Consumed and then deleted by the merge step
 * (report:playwright:merge + report:cleanup:shards) — never a final artifact itself.
 */
export const BLOB_REPORTS_DIR = path.join(REPORTS_DIR, "blob");
export const BLOB_REPORTS_SHARD_DIR = process.env.SHARD_INDEX
  ? path.join(BLOB_REPORTS_DIR, `shard-${process.env.SHARD_INDEX}`)
  : BLOB_REPORTS_DIR;

/** Raw Allure result files produced by the `allure-playwright` reporter during a run. */
export const ALLURE_RESULTS_DIR = path.join(ALLURE_DIR, "allure-results");
/** Multi-page Allure HTML report, generated from ALLURE_RESULTS_DIR via `allure generate`. */
export const ALLURE_REPORT_DIR = path.join(ALLURE_DIR, "allure-report");
/** Single-file, portable Allure report (used by CI for the artifact upload / GitHub Pages publish). */
export const ALLURE_REPORT_SINGLE_FILE_DIR = path.join(
  ALLURE_DIR,
  "allure-report-single",
);

/** Path to the custom Playwright reporter that prunes unwanted Allure result statuses post-run. */
export const ALLURE_CLEANUP_REPORTER_PATH = path.join(
  __dirname,
  "..",
  "reporters",
  "allure-cleanup.reporter.ts",
);

/** Path to the Playwright `globalTeardown` module (finalizes/splits per-worker logs). */
export const GLOBAL_TEARDOWN_PATH = path.join(
  __dirname,
  "..",
  "global",
  "global.teardown",
);

/** Single object grouping every path above, for convenient `import { PATHS } from "@configs/paths"` usage. */
export const PATHS = {
  ROOT_DIR,
  ARTIFACTS_DIR,
  LOGS_DIR,
  REPORTS_DIR,
  ALLURE_DIR,
  ALLURE_RESULTS_DIR,
  ALLURE_REPORT_DIR,
  ALLURE_REPORT_SINGLE_FILE_DIR,
  ALLURE_CLEANUP_REPORTER_PATH,
  GLOBAL_TEARDOWN_PATH,
  HTML_REPORTS_DIR,
  JSON_REPORTS_DIR,
  JSON_REPORTS_FILE,
  PLAYWRIGHT_REPORTS_DIR,
  BLOB_REPORTS_DIR,
  BLOB_REPORTS_SHARD_DIR,
} as const;
