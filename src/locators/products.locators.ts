import { Locator, Page } from '@playwright/test';

export class ProductsLocators {

    readonly productsContainer: Locator;
    readonly productViewLink: Function;
    readonly productLocator: Function;
    readonly indexOffset = 1;
    readonly searchProductsInput: Locator;
    readonly searchProductsButton: Locator;
    readonly continueShoppingButton: Locator;

    constructor(page: Page) {
        this.productsContainer = page.locator('.features_items');
        this.productLocator = (name: string): Locator => {
            return page.locator('.single-products').filter({ hasText: name });
        };
        this.productViewLink = (index: number): Locator => {
            return page.getByRole('link', { name: ' View Product' }).nth(index - this.indexOffset);
        };
        this.searchProductsInput = page.getByPlaceholder('Search Product');
        this.searchProductsButton = page.locator('#submit_search');
        this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping' });
    }

}