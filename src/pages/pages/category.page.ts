import { CategoriesComponent } from '@components/categories.component';
import { CategoryLocators } from '@locators/page/category.locators';
import { BasePage } from '@pages.base/base.page';
import { Page } from '@playwright/test';

export class CategoryPage extends BasePage {

    readonly locators: CategoryLocators;
    readonly categories: CategoriesComponent;

    constructor(page: Page) {
        super(page);
        this.locators = new CategoryLocators(page);
        this.categories = new CategoriesComponent(page);
    }

}