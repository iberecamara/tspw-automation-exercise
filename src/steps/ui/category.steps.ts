import { CategoryPage } from "@pages/category.page";
import { TestAutomationLogger } from "@utils/logger.utils";
import test, { expect } from "playwright/test";

export class CategorySteps {

    readonly logger: TestAutomationLogger;
    readonly categoryPage: CategoryPage;

    constructor(logger: TestAutomationLogger, categoryPage: CategoryPage) {
        this.logger = logger;
        this.categoryPage = categoryPage;
    }

    async validateCategoryPageHeading(category: string, subcategory: string): Promise<void> {
        this.logger.debug(`Validating Category heading for ${category} - ${subcategory}.`);
        const headingText = `${category} - ${subcategory} Products`;
        await test.step(`Validate Category heading for ${category} - ${subcategory}.`, async () => {
            await expect.soft(
                this.categoryPage.page.getByText(headingText),
                `Category page heading should match the expected '${headingText}'.`
            ).toBeVisible();
        });
    }
}