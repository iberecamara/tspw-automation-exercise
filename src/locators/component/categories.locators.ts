import { Locator, Page } from '@playwright/test';

export class CategoriesComponentLocators {

    readonly categoriesHeading: Locator;
    readonly categoriesAccordian: Locator;
    readonly categoryLocatorByName: Function;
    readonly subCategoriesLocatorsBycategory: Function;
    readonly subCategoryLocator: Function;

    constructor(page: Page) {
        this.categoriesHeading = page.getByText('Category');
        this.categoriesAccordian = page.getByTestId('accordian');
        this.categoryLocatorByName = (category: string) => { return page.getByRole('link', { name: ` ${category}` }) };
        this.subCategoriesLocatorsBycategory = (category: string) => { return page.locator(`#${category}`) };
        this.subCategoryLocator = (subCategory: string) => { return page.getByRole('link', { name: subCategory }) };
    }

}