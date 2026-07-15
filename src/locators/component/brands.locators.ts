import { Locator, Page } from '@playwright/test';

export class BrandsComponentLocators {

    readonly brandsHeading: Locator;
    readonly brandsContainer: Locator;
    readonly brandLocatorByName: Function;

    constructor(page: Page) {
        this.brandsHeading = page.getByText('Brands');
        this.brandsContainer = page.locator('.brands-name');
        this.brandLocatorByName = (brand: string) => { return page.getByRole('link', { name: brand }) };
    }

}