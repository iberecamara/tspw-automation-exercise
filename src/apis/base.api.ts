import { TestAutomationLogger } from "@utils/logger.utils";
import { APIRequestContext } from "playwright";

export class BaseApi {
  readonly logger: TestAutomationLogger;
  protected readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.logger = TestAutomationLogger.getInstance();
    this.request = request;
  }
}
