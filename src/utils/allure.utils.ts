import { Environment } from "@configs/environment.config";
import {
  ALLURE_REPORT_DIR,
  ALLURE_REPORT_SINGLE_FILE_DIR,
  ALLURE_RESULTS_DIR,
} from "@configs/paths";
import { NEWLINE } from "@data/constants/string.constants";
import type { Attachment, TestResult } from "allure-js-commons";
import * as fs from "fs";
import { execSync } from "node:child_process";
import * as path from "path";

/**
 * Generates, opens, and prunes Allure reports.
 *
 * {@link allureRemoveResults} is the only function exported for programmatic use elsewhere in
 * the codebase (called by `AllureCleanupReporter`); `generate`/`open`/`exportSingleFile`/`all`
 * are only reachable through this module's CLI dispatch (`npm run report:allure:*`), not as
 * importable functions.
 */

/**
 * Removes raw Allure result files (and their attachments) whose test status matches
 * `Environment.ALLURE_REPORT_REMOVE_STATUS`, so the generated report only surfaces actionable
 * results (e.g. hiding `passed`/`skipped` entries). No-ops if `ALLURE_REPORT_REMOVE_STATUS` is
 * unset, or if the results directory doesn't exist yet.
 */
export function allureRemoveResults(): void {
  const resultsDir = ALLURE_RESULTS_DIR;
  if (!fs.existsSync(resultsDir)) {
    console.info("No allure-results directory found. Skipping cleanup.");
    return;
  }

  const files = fs.readdirSync(resultsDir);

  files.forEach((file) => {
    if (file.endsWith("-result.json")) {
      const filePath = path.join(resultsDir, file);
      try {
        const fileContent = fs.readFileSync(filePath, "utf8");
        const testResult: TestResult = JSON.parse(fileContent) as TestResult;
        if (
          Environment.ALLURE_REPORT_REMOVE_STATUS &&
          Environment.ALLURE_REPORT_REMOVE_STATUS === testResult.status
        ) {
          fs.unlinkSync(filePath);
          if (testResult.attachments) {
            testResult.attachments.forEach((attachment: Attachment) => {
              const attachmentPath = path.join(resultsDir, attachment.source);
              if (fs.existsSync(attachmentPath)) {
                fs.unlinkSync(attachmentPath);
              }
            });
          }
        }
      } catch (error) {
        console.error(`Failed to process '${file}'`, error);
      }
    }
  });

  if (Environment.ALLURE_REPORT_REMOVE_STATUS) {
    console.info(
      `Allure Results Cleanup complete, status results removed: '${Environment.ALLURE_REPORT_REMOVE_STATUS}'.`,
    );
  } else {
    console.info("Allure Results Cleanup will not be executed.");
  }
}

function run(cmd: string): void {
  execSync(cmd, { stdio: "inherit" });
}

function generate(): void {
  run(
    `npx allure generate '${ALLURE_RESULTS_DIR}' -o '${ALLURE_REPORT_DIR}' --config src/configs/allurerc.mjs`,
  );
}

function open(): void {
  run(`npx allure open '${ALLURE_REPORT_DIR}'`);
}

function exportSingleFile(): void {
  run(
    `npx allure awesome generate '${ALLURE_RESULTS_DIR}' -o '${ALLURE_REPORT_SINGLE_FILE_DIR}' --single-file --config src/configs/allurerc.mjs`,
  );
}

function all(): void {
  generate();
  open();
}

if (require.main === module) {
  type Command = "generate" | "open" | "export" | "all";
  const command = process.argv[2] as Command | undefined;

  switch (command) {
    case "generate":
      generate();
      break;
    case "open":
      open();
      break;
    case "export":
      exportSingleFile();
      break;
    case "all":
      all();
      break;
    default:
      console.error(
        `Unknown or missing command: '${String(command) ?? ""}'${NEWLINE}Expected one of: generate | open | export | all`,
      );
  }
}
