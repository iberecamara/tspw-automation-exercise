import { Locator, Page } from '@playwright/test';

export class CategoryComponentLocators {

    readonly categoryHeading: Locator;
    readonly categoryAccordian: Locator;
    readonly categoryLocatorByName: Function;
    readonly subCategoriesLocatorsBycategory: Function;
    readonly subCategoryLocator: Function;

    constructor(page: Page) {
        this.categoryHeading = page.getByText('Category');
        this.categoryAccordian = page.getByTestId('accordian');
        this.categoryLocatorByName = (category: string) => { return page.getByRole('link', { name: ` ${category}` }) };
        this.subCategoriesLocatorsBycategory = (category: string) => { return page.locator(`#${category}`) };
        this.subCategoryLocator = (subCategory: string) => { return page.getByRole('link', { name: subCategory }) };
    }

}