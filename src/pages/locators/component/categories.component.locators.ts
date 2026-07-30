import { Locator, Page } from "@playwright/test";

/** Raw `Locator` definitions for the shared categories accordion sidebar, used by `CategoriesComponent`. */
export class CategoriesComponentLocators {
  readonly categoriesContainer: Locator;
  readonly categoriesHeading: Locator;
  readonly categoriesAccordian: Locator;
  readonly categoryByName: (category: string) => Locator;
  readonly subCategoriesBycategory: (category: string) => Locator;
  readonly subCategory: (category: string) => Locator;
  readonly categories: Locator;

  constructor(page: Page) {
    this.categoriesContainer = page.locator(".panel-group category-products");
    this.categoriesHeading = page.getByText("Category");
    this.categoriesAccordian = page.locator("#accordian");
    this.categoryByName = (category: string) => {
      return page.getByRole("link", { name: ` ${category}` });
    };
    this.subCategoriesBycategory = (category: string) => {
      return page.locator(`#${category}`);
    };
    this.subCategory = (subCategory: string) => {
      return page.getByRole("link", { name: subCategory });
    };
    this.categories = this.categoriesAccordian.locator("span");
  }
}
