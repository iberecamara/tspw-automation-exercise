import { ProductType } from "@data/model/product.model";
import { test } from "@fixtures/fixtures";
import { HomePage } from "@pages/home.page";
import { TestAutomationLogger } from "@utils/logger.utils";
import { StringUtils } from "@utils/string.utils";
import { expect } from "playwright/test";

export class HomeSteps {

    readonly logger: TestAutomationLogger;
    readonly homePage: HomePage;

    constructor(logger: TestAutomationLogger, homePage: HomePage) {
        this.logger = logger;
        this.homePage = homePage;
    }

    // Actions
    async getRecommendedItems(): Promise<ProductType[]> {
        this.logger.debug('Retrieving displayed Recommended Items');
        const recommendedItems: ProductType[] = [];
        await test.step('Retrieve displayed Recommended Items', async () => {
            recommendedItems.push(...await this.homePage.getRecommendedItems());
        });
        this.logger.debug('Retrieved displayed Recommended Items');
        return recommendedItems;
    }

    async addRecommendedItem(item: ProductType): Promise<void> {
        this.logger.debug('Adding Recommended Item to Cart');
        this.logger.debug(`Adding Item: ${StringUtils.prettyJson(item)}`);
        await test.step('Add Recommended Item to Cart', async () => {
            await this.homePage.addRecommendedItem(item);
        });
        this.logger.debug('Added Recommended Item to Cart');
    }

    // Validations
    async validateRecommendedItems(): Promise<void> {
        this.logger.debug('Validating that Recommended Items section is displayed');
        await test.step('Validate that Recommended Items section is displayed', async () => {
            await expect.soft(
                this.homePage.locators.recommendedItemsHeading,
                'Recommended Items should be displayed'
            ).toBeVisible();
        });
    }

}