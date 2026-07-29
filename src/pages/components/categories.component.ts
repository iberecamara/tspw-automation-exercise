import { EMPTY } from "@data/constants/string.constants";
import { CategoriesComponentLocators } from "@locators/component/categories.component.locators";
import { BasePage } from "@pages.base/base.page";
import { Locator, Page } from "@playwright/test";
/** Implemented by any page object that composes a {@link CategoriesComponent}, so steps can accept "any page with a categories sidebar" without depending on a specific page class. */
export interface HasCategories {
  categories: CategoriesComponent;
}

/** The categories accordion sidebar (shown on the products/category/brand listing pages), listing top-level categories that expand to reveal sub-categories. */
export class CategoriesComponent extends BasePage {
  readonly locators: CategoriesComponentLocators;

  constructor(page: Page) {
    super(page);
    this.locators = new CategoriesComponentLocators(page);
  }

  /**
   * Reads every top-level category name currently listed in the accordion.
   *
   * @returns The category names, in display order.
   */
  async getCategories(): Promise<string[]> {
    const categories: string[] = [];
    const categoryLocators = await this.locators.categories.all();
    for (const locator of categoryLocators) {
      const text = (await locator.textContent()) ?? EMPTY;
      if (text) {
        categories.push(text);
      }
    }
    return categories;
  }

  /**
   * Expands a top-level category in the accordion, revealing its sub-categories.
   *
   * @param category - Exact category name to expand.
   */
  async expandCategory(category: string): Promise<void> {
    await this.click(this.locators.categoryByName(category));
  }

  /**
   * Reads every sub-category name listed under an (already expanded) top-level category.
   *
   * @param category - Exact top-level category name.
   * @returns The sub-category names, in display order.
   */
  async getSubCategories(category: string): Promise<string[]> {
    const subCategories: string[] = [];
    const subCategoriesLocators: Locator[] = await this.locators
      .subCategoriesBycategory(category)
      .getByRole("listitem")
      .all();
    for (const locator of subCategoriesLocators) {
      const text = (await locator.textContent()) ?? EMPTY;
      if (text) {
        subCategories.push(text);
      }
    }
    return subCategories;
  }

  /**
   * Clicks a sub-category, navigating to that sub-category's filtered product listing.
   *
   * @param subCategory - Exact sub-category name to select.
   */
  async selectSubCategory(subCategory: string): Promise<void> {
    await this.click(this.locators.subCategory(subCategory));
  }
}
