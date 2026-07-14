import { ProductType } from '@data/model/product.model';
import { test } from '@fixtures/fixtures';
import { CartPage } from '@pages/cart.page';
import { expect } from '@playwright/test';
import { TestAutomationLogger } from '@utils/logger.utils';

export class CartSteps {

    readonly logger: TestAutomationLogger;
    readonly cartPage: CartPage;

    constructor(logger: TestAutomationLogger, cartPage: CartPage) {
        this.logger = logger;
        this.cartPage = cartPage;
    }

    // Actions
    async getCartProducts(): Promise<ProductType[]> {
        this.logger.debug('Retrieveing all products details');
        const products: ProductType[] = [];
        await test.step('Retrieve all products', async () => {
            products.push(...await this.cartPage.getCartItems());
        });
        this.logger.debug('Retrieved all products details');
        return products;
    }

    async proceedToCheckout() {
        this.logger.debug('Clicking Proceed to Checkout');
        await test.step('Click Proceed to Checkout', async () => {
            await this.cartPage.click(this.cartPage.locators.proceedToCheckoutButton);
        });
        this.logger.debug('Clicked Proceed to Checkout');
    }

    async registerUserFromCheckout() {
        this.logger.debug('Clicking Register / Login');
        await test.step('Click Register / Login', async () => {
            await this.cartPage.click(this.cartPage.locators.registerFromCheckoutLink);
        });
        this.logger.debug('Clicked Register / Login');
    }

    // Validations
    async validateCartItems(cartItems: ProductType[], addedItems: ProductType[]) {
        this.logger.debug('Validating all products in cart.');
        await test.step('Validate all products', async () => {
            expect.soft(
                cartItems,
                'Cart items must match added items.'
            ).toEqual(
                expect.arrayContaining(addedItems)
            );
        });
    }

    async validateProductQuantity(quantity: number): Promise<void> {
        this.logger.debug(`Validating product quantity in cart to be ${quantity}.`);
        await test.step('Validate product quantity in cart', async () => {
            const product = (await this.cartPage.getCartItems()).at(0);
            expect.soft(
                product?.quantity,
                `Product quantity in cart should be ${quantity}.`
            ).toBe(quantity);
        });
    }

}