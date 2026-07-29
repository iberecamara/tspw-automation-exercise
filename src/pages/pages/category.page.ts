import {
  CategoriesComponent,
  HasCategories,
} from "@components/categories.component";
import { BasePage } from "@pages.base/base.page";
import { CategoryLocators } from "@pages.base/locators/page/category.locators";
import { Page } from "@playwright/test";

/** The category-filtered products listing page, reached by expanding a category and selecting a sub-category in the {@link CategoriesComponent} sidebar. */
export class CategoryPage extends BasePage implements HasCategories {
  readonly locators: CategoryLocators;
  readonly categories: CategoriesComponent;

  constructor(page: Page) {
    super(page);
    this.locators = new CategoryLocators(page);
    this.categories = new CategoriesComponent(page);
  }
}
