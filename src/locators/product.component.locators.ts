import { Locator, Page } from 'playwright-core';

export class ProductComponentsLocators {

    readonly productsContainer: Locator;
    readonly productViewLink: Function;
    readonly productLocator: Function;
    readonly productAddFromOverlay: Function;
    readonly indexOffset = 1;

    constructor(page: Page) {
        this.productsContainer = page.locator('.features_items');
        this.productLocator = (name: string): Locator => {
            return page.locator('div.product-image-wrapper > div.single-products').filter({ hasText: name }).first();
        };
        this.productAddFromOverlay = (name: string): Locator => {
            return this.productLocator(name).locator('div.overlay-content > .btn');
        };
        this.productViewLink = (index: number): Locator => {
            return page.getByRole('link', { name: ' View Product' }).nth(index - this.indexOffset);
        };
    }

}