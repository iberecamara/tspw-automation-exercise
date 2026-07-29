import { test } from "@playwright/test";
import { TestAutomationLogger } from "@utils/logger.utils";

/**
 * Base class every `*.steps.ts` class (both `steps/ui/` and `steps/api/`) extends.
 *
 * Provides each subclass with the shared `TestAutomationLogger` singleton (`this.logger`) and
 * the `step()` helper below, so individual step classes only need to accept the page/component/API
 * client they drive in their own constructor — never `logger` as a parameter.
 */
export class BaseSteps {
  /** The shared `TestAutomationLogger` singleton for this worker. */
  readonly logger: TestAutomationLogger;

  constructor() {
    this.logger = TestAutomationLogger.getInstance();
  }

  /**
   * Wraps an action in a Playwright `test.step` and logs start/finish at
   * verbose level, deriving both from a single label to avoid drift/typos
   * between the step name and the surrounding log lines.
   *
   * @param label - Readable description of the action, used as both the `test.step()` title and
   * the surrounding verbose log lines (trimmed automatically).
   * @param action - The action to perform, sync or async. Its return value (if any) is returned
   * to the caller once the step completes.
   * @returns Whatever `action` returns.
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
