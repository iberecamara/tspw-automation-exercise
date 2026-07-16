import { Locator, Page } from '@playwright/test';

export class BrandsComponentLocators {

    readonly brandsHeading: Locator;
    readonly brandsContainer: Locator;
    readonly brands: Locator;
    readonly brandByName: Function;

    constructor(page: Page) {
        this.brandsHeading = page.getByText('Brands');
        this.brandsContainer = page.locator('.brands-name');
        this.brandByName = (brand: string) => { return page.getByRole('link', { name: brand }) };
        this.brands = this.brandsContainer.getByRole('link');
    }

}