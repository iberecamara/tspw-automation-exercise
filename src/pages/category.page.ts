import { CategoryComponents } from '@components/category.components';
import { CategoryLocators } from '@locators/category.locators';
import { BasePage } from '@pages/base.page';
import { Page } from '@playwright/test';

export class CategoryPage extends BasePage {

    readonly locators: CategoryLocators;
    readonly category: CategoryComponents;

    constructor(page: Page) {
        super(page);
        this.locators = new CategoryLocators(page);
        this.category = new CategoryComponents(page);
    }

}