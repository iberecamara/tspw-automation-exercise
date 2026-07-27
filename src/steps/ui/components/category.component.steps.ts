import { HasCategories } from "@components/categories.component";
import { BaseSteps } from "@steps/ui/common/base.steps";
import { expect } from "playwright/test";

export class CategoryComponentSteps extends BaseSteps {
  // Actions
  async expandCategory(
    pageObject: HasCategories,
    category: string,
  ): Promise<void> {
    await this.step(`Expand Category '${category}'`, async () => {
      await pageObject.categories.expandCategory(category);
    });
  }

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

  async selectSubCategory(
    pageObject: HasCategories,
    subCategory: string,
  ): Promise<void> {
    await this.step(`Select Sub Category '${subCategory}'`, async () => {
      await pageObject.categories.selectSubCategory(subCategory);
    });
  }

  // Validations
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
