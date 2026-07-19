import { TestAutomationLogger } from "@utils/logger.utils";

export class BaseApi {
  readonly logger: TestAutomationLogger;

  constructor() {
    this.logger = TestAutomationLogger.getInstance();
  }
}
