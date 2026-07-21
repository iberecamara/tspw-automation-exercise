import { ProductType } from "@data/model/product.model";
import { test } from "@fixtures/fixtures";
import { HomePage } from "@pages/home.page";
import { BaseSteps } from "@steps/base.steps";
import { StringUtils } from "@utils/string.utils";
import { expect } from "playwright/test";

export class HomeSteps extends BaseSteps {
  readonly homePage: HomePage;

  constructor(homePage: HomePage) {
    super();
    this.homePage = homePage;
  }

  // Actions
  async getRecommendedItems(): Promise<ProductType[]> {
    this.logger.verbose("Retrieving displayed Recommended Items");
    const recommendedItems: ProductType[] = [];

    await test.step("Retrieve displayed Recommended Items", async () => {
      recommendedItems.push(...(await this.homePage.getRecommendedItems()));
    });

    this.logger.verbose("Retrieved displayed Recommended Items");
    return recommendedItems;
  }

  async addRecommendedItem(item: ProductType): Promise<void> {
    this.logger.verbose("Adding Recommended Item to Cart");
    this.logger.verbose(`Adding Item: ${StringUtils.prettyJson(item)}`);

    await test.step("Add Recommended Item to Cart", async () => {
      await this.homePage.addRecommendedItem(item);
    });

    this.logger.verbose("Added Recommended Item to Cart");
  }

  async scrollUp(): Promise<void> {
    this.logger.verbose("Clicking Scroll Up button");

    await test.step("Click Scroll Up button", async () => {
      await this.homePage.clickScrollUp();
    });

    this.logger.verbose("Clicked Scroll Up button");
  }

  // Validations
  async validateRecommendedItems(): Promise<void> {
    this.logger.verbose("Validating that Recommended Items section is displayed");

    await test.step("Validate that Recommended Items section is displayed", async () => {
      await expect
        .soft(
          this.homePage.locators.recommendedItemsHeading,
          "Recommended Items should be displayed",
        )
        .toBeVisible();
    });
  }

  async validateSubHeading(): Promise<void> {
    this.logger.verbose("Validating that sub heading is displayed");

    await test.step("Validate that sub heading is displayed", async () => {
      await expect
        .soft(
          this.homePage.locators.subheading,
          `Sub heading 'Full-Fledged practice website for Automation Engineers' is displayed`,
        )
        .toBeVisible();
      await expect
        .soft(
          this.homePage.locators.subheading,
          `Sub heading 'Full-Fledged practice website for Automation Engineers' is in current viewport`,
        )
        .toBeInViewport();
    });
  }
}
