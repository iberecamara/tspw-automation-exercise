import { ProductType } from "@data/model/product.model";
import { HomePage } from "@pages/home.page";
import { BaseSteps } from "@steps/ui/common/base.steps";
import { expect } from "playwright/test";

export class HomeSteps extends BaseSteps {
  readonly homePage: HomePage;

  constructor(homePage: HomePage) {
    super();
    this.homePage = homePage;
  }

  // Actions
  async getRecommendedItems(): Promise<ProductType[]> {
    return await this.step("Retrieve displayed Recommended Items", async () => {
      return await this.homePage.getRecommendedItems();
    });
  }

  async addRecommendedItem(item: ProductType): Promise<void> {
    await this.step("Add Recommended Item to Cart", async () => {
      await this.homePage.addRecommendedItem(item);
    });
  }

  async scrollUp(): Promise<void> {
    await this.step("Click Scroll Up button", async () => {
      await this.homePage.clickScrollUp();
    });
  }

  // Validations
  async validateRecommendedItems(): Promise<void> {
    await this.step(
      "Validate that Recommended Items section is displayed",
      async () => {
        await expect
          .soft(
            this.homePage.locators.recommendedItemsHeading,
            "Recommended Items should be displayed",
          )
          .toBeVisible();
      },
    );
  }

  async validateSubHeading(): Promise<void> {
    await this.step("Validate that sub heading is displayed", async () => {
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
