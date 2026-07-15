import { Locator, Page } from '@playwright/test';

export class ProductLocators {

    readonly productDetailContainer: Locator;
    readonly productQuantityInput: Locator;
    readonly addToCartButton: Locator;
    readonly continueShoppingButton: Locator;


    constructor(page: Page) {
        this.productDetailContainer = page.locator('.product-details');
        this.productQuantityInput = page.locator('#quantity');
        this.addToCartButton = page.getByRole('button', { name: ' Add to cart' });
        this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping' });
    }

}