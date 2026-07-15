import { EMPTY } from '@data/constants/string.constants';
import { CategoryComponentLocators } from '@locators/category.component.locators';
import { BasePage } from '@pages/base.page';
import { Locator, Page } from '@playwright/test';

export class CategoryComponents extends BasePage {

    readonly locators: CategoryComponentLocators;

    constructor(page: Page) {
        super(page);
        this.locators = new CategoryComponentLocators(page);
    }

    async getCategories(): Promise<string[]> {
        const categories: string[] = [];
        const categoryLocators = await this.locators.categoryAccordian.locator('span').all();
        for (const locator of categoryLocators) {
            const text = await locator.textContent() ?? EMPTY;
            if (text) {
                categories.push(text);
            }
        }
        return categories;
    }

    async expandCategory(category: string): Promise<void> {
        await this.click(this.locators.categoryLocatorByName(category));
    }

    async getSubCategories(category: string): Promise<string[]> {
        const subCategories: string[] = [];
        const subCategoriesLocators: Locator[] = await this.locators.subCategoriesLocatorsBycategory(category).getByRole('listitem').all();
        for (const locator of subCategoriesLocators) {
            const text = await locator.textContent() ?? EMPTY;
            if (text) {
                subCategories.push(text);
            }
        }
        return subCategories;
    }

    async selectSubCategory(subCategory: string): Promise<void> {
        await this.click(this.locators.subCategoryLocator(subCategory));
    }
}
