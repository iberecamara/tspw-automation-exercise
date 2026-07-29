import { CategoryPage } from "@pages/category.page";
import { BaseSteps } from "@steps/base.steps";
import { expect } from "playwright/test";

/** Readable, logged steps driving {@link CategoryPage}. */
export class CategorySteps extends BaseSteps {
  readonly categoryPage: CategoryPage;

  constructor(categoryPage: CategoryPage) {
    super();
    this.categoryPage = categoryPage;
  }

  /**
   * Validates the category/sub-category page heading is displayed with the expected
   * `"<Category> - <Subcategory> Products"` text.
   */
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
