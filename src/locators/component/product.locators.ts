import { Locator, Page } from 'playwright-core';

export class ProductComponentLocators {

    readonly productsContainer: Locator;
    readonly productViewLink: Function;
    readonly productLocator: Function;
    readonly productAddFromOverlay: Function;
    readonly indexOffset = 1;
    readonly products: Locator;
    readonly productName: Function;
    readonly productPrice: Function;

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
        this.products = this.productsContainer.locator('.single-products');
        this.productName = (locator: Locator) => { return locator.locator('h2').first() };
        this.productPrice = (locator: Locator) => { return locator.locator('p').first() };
    }

}