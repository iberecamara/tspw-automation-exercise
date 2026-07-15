import { BrandPage } from "@pages/brand.page";
import { TestAutomationLogger } from "@utils/logger.utils";

export class BrandSteps {

    readonly logger: TestAutomationLogger;
    readonly brandPage: BrandPage;

    constructor(logger: TestAutomationLogger, brandPage: BrandPage) {
        this.logger = logger;
        this.brandPage = brandPage;
    }

}