import { Locator, Page } from '@playwright/test';

export class ProductLocators {

    readonly productDetailContainer: Locator;
    readonly productQuantityInput: Locator;
    readonly addToCartButton: Locator;

    readonly productsContainer: Locator;
    readonly productViewLink: Function;
    readonly productLocator: Function;
    readonly indexOffset = 1;
    readonly continueShoppingButton: Locator;
    readonly viewCartLink: Locator;

    constructor(page: Page) {
        this.productDetailContainer = page.locator('.product-details');
        this.productQuantityInput = page.locator('#quantity');
        this.addToCartButton = page.getByRole('button', { name: ' Add to cart' });

        this.productsContainer = page.locator('.features_items');
        this.productLocator = (name: string): Locator => {
            return page.locator('.single-products').filter({ hasText: name });
        };
        this.productViewLink = (index: number): Locator => {
            return page.getByRole('link', { name: ' View Product' }).nth(index - this.indexOffset);
        };
        this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping' });
        this.viewCartLink = page.locator('.modal-body').getByRole('link', { name: 'View Cart' });
    }

}