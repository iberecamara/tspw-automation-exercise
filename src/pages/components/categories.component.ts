import { EMPTY } from "@data/constants/string.constants";
import { CategoriesComponentLocators } from "@locators/component/categories.locators";
import { BasePage } from "@pages.base/base.page";
import { Locator, Page } from "@playwright/test";

export class CategoriesComponent extends BasePage {
  readonly locators: CategoriesComponentLocators;

  constructor(page: Page) {
    super(page);
    this.locators = new CategoriesComponentLocators(page);
  }

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

  async expandCategory(category: string): Promise<void> {
    await this.click(this.locators.categoryByName(category));
  }

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

  async selectSubCategory(subCategory: string): Promise<void> {
    await this.click(this.locators.subCategory(subCategory));
  }
}
