import { HTML_REPORTS_DIR } from "@configs/paths";
import { NEWLINE } from "@data/constants/string.constants";
import { execSync } from "node:child_process";

/**
 * Opens the Playwright HTML report.
 *
 * Module doubles as a CLI entry point (`npm run report:html:open`): when run directly, dispatches
 * on `process.argv[2]` (`"open"` is the only supported command).
 */

/** Runs a shell command, streaming its output to the current process's stdio. */
function run(cmd: string): void {
  execSync(cmd, { stdio: "inherit" });
}

/** Opens the Playwright HTML report (`artifacts/reports/playwright/html`) in a browser. */
export function open(): void {
  run(`npx playwright show-report '${HTML_REPORTS_DIR}'`);
}

if (require.main === module) {
  type Command = "open";
  const command = process.argv[2] as Command | undefined;

  switch (command) {
    case "open":
      open();
      break;
    default:
      console.error(
        `Unknown or missing command: '${String(command) ?? ""}'${NEWLINE}Expected one of: open`,
      );
  }
}
