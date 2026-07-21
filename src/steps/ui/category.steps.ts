import { CategoryPage } from "@pages/category.page";
import { BaseSteps } from "@steps/base.steps";
import test, { expect } from "playwright/test";

export class CategorySteps extends BaseSteps {
  readonly categoryPage: CategoryPage;

  constructor(categoryPage: CategoryPage) {
    super();
    this.categoryPage = categoryPage;
  }

  async validateCategoryPageHeading(
    category: string,
    subcategory: string,
  ): Promise<void> {
    this.logger.verbose(
      `Validating Category heading for ${category} - ${subcategory}.`,
    );
    const headingText = `${category} - ${subcategory} Products`;

    await test.step(`Validate Category heading for ${category} - ${subcategory}.`, async () => {
      await expect
        .soft(
          this.categoryPage.page.getByText(headingText),
          `Category page heading should match the expected '${headingText}'.`,
        )
        .toBeVisible();
    });
  }
}
