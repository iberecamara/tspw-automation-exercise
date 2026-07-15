import { Locator, Page } from '@playwright/test';

export class HomeLocators {

    readonly productsContainer: Locator;
    readonly productViewLink: Function;
    readonly productLocator: Function;
    readonly indexOffset = 1;


    constructor(page: Page) {
        this.productsContainer = page.locator('.features_items');
        this.productLocator = (name: string): Locator => {
            return page.locator('.single-products').filter({ hasText: name });
        };
        this.productViewLink = (index: number): Locator => {
            return page.getByRole('link', { name: ' View Product' }).nth(index - this.indexOffset);
        };
    }

}