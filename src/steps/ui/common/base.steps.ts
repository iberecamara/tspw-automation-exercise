import { test } from "@playwright/test";
import { TestAutomationLogger } from "@utils/logger.utils";

export class BaseSteps {
  readonly logger: TestAutomationLogger;

  constructor() {
    this.logger = TestAutomationLogger.getInstance();
  }

  /**
   * Wraps an action in a Playwright `test.step` and logs start/finish at
   * verbose level, deriving both from a single label to avoid drift/typos
   * between the step name and the surrounding log lines.
   */
  protected async step<T>(
    label: string,
    action: () => Promise<T> | T,
  ): Promise<T> {
    label = label.trim();
    this.logger.verbose(`${label}...`);

    const result = await test.step(label, action);

    this.logger.verbose(`${label}: done.`);
    return result;
  }
}
