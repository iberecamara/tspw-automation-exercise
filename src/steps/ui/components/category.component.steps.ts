import { HasCategories } from "@components/categories.component";
import { BaseSteps } from "@steps/base.steps";
import { expect } from "playwright/test";

/** Readable, logged steps driving the categories accordion sidebar, reached through any page object implementing {@link HasCategories}. */
export class CategoryComponentSteps extends BaseSteps {
  // Actions

  /** Expands a top-level category, revealing its sub-categories. */
  async expandCategory(
    pageObject: HasCategories,
    category: string,
  ): Promise<void> {
    await this.step(`Expand Category '${category}'`, async () => {
      await pageObject.categories.expandCategory(category);
    });
  }

  /** Retrieves every sub-category name listed under an (already expanded) top-level category. */
  async getSubCategories(
    pageObject: HasCategories,
    category: string,
  ): Promise<string[]> {
    return await this.step(
      `Retrieve Category '${category}' subcategories`,
      async () => {
        return await pageObject.categories.getSubCategories(category);
      },
    );
  }

  /** Clicks a sub-category, navigating to that sub-category's filtered listing. */
  async selectSubCategory(
    pageObject: HasCategories,
    subCategory: string,
  ): Promise<void> {
    await this.step(`Select Sub Category '${subCategory}'`, async () => {
      await pageObject.categories.selectSubCategory(subCategory);
    });
  }

  // Validations

  /** Validates the "Category" sidebar heading is displayed with the expected text. */
  async validateCategorySection(pageObject: HasCategories): Promise<void> {
    await this.step(
      "Validate that Category Section have the expected heading",
      async () => {
        await expect
          .soft(
            pageObject.categories.locators.categoriesHeading,
            "Categories section should be displayed.",
          )
          .toBeVisible();
        const headingText = "Category";
        await expect
          .soft(
            pageObject.categories.locators.categoriesHeading,
            `Categories section text should be '${headingText}'.`,
          )
          .toHaveText(headingText);
      },
    );
  }
}
