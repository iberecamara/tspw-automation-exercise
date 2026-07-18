import { Locator, Page } from '@playwright/test';

export class CategoriesComponentLocators {

    readonly categoriesHeading: Locator;
    readonly categoriesAccordian: Locator;
    readonly categoryByName: (category: string) => Locator;
    readonly subCategoriesBycategory: (category: string) => Locator;
    readonly subCategory: (category: string) => Locator;
    readonly categories: Locator;

    constructor(page: Page) {
        this.categoriesHeading = page.getByText('Category');
        this.categoriesAccordian = page.getByTestId('accordian');
        this.categoryByName = (category: string) => { return page.getByRole('link', { name: ` ${category}` }) };
        this.subCategoriesBycategory = (category: string) => { return page.locator(`#${category}`) };
        this.subCategory = (subCategory: string) => { return page.getByRole('link', { name: subCategory }) };
        this.categories = this.categoriesAccordian.locator('span');
    }

}