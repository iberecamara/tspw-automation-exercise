import { TestAutomationLogger } from "@utils/logger.utils";
import { APIRequestContext } from "playwright";

/**
 * Base class every API client (`UserApi`, `ProductApi`, `BrandApi`, `LoginApi`) extends.
 *
 * Provides each subclass with the shared `TestAutomationLogger` singleton (`this.logger`) and
 * the Playwright `APIRequestContext` (`this.request`) used to make raw HTTP calls against
 * `automationexercise.com/api`, so individual API client classes don't need to wire up either
 * dependency themselves.
 */
export class BaseApi {
  /** The shared `TestAutomationLogger` singleton for this worker. */
  readonly logger: TestAutomationLogger;
  /** The Playwright request context used to issue HTTP requests. */
  protected readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.logger = TestAutomationLogger.getInstance();
    this.request = request;
  }
}
