import { HomePage } from "@pages/home.page";
import { TestAutomationLogger } from "@utils/logger.utils";

export class HomeSteps {

    readonly logger: TestAutomationLogger;
    readonly homePage: HomePage;

    constructor(logger: TestAutomationLogger, homePage: HomePage) {
        this.logger = logger;
        this.homePage = homePage;
    }

}