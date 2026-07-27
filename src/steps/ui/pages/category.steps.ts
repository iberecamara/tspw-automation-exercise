import { CategoryPage } from "@pages/category.page";
import { BaseSteps } from "@steps/ui/common/base.steps";
import { expect } from "playwright/test";

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
    await this.step(
      `Validate Category heading for ${category} - ${subcategory}`,
      async () => {
        const headingText = `${category} - ${subcategory} Products`;
        const element = this.categoryPage.page.getByText(headingText);
        await expect
          .soft(element, `Category page heading should be displayed.`)
          .toBeVisible();
        await expect
          .soft(
            element,
            `Category page heading text should match the expected '${headingText}'.`,
          )
          .toHaveText(headingText);
      },
    );
  }
}
