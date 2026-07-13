import { ProductType } from '@data/model/product.model';
import { test } from '@fixtures/fixtures';
import { CartPage } from '@pages/cart.page';
import { expect, Page } from '@playwright/test';
import { TestAutomationLogger } from '@utils/logger.utils';

export class CartSteps {

    // Actions
    async getCartProducts(logger: TestAutomationLogger, cartPage: CartPage): Promise<ProductType[]> {
        logger.debug('Retrieveing all products details');
        const products: ProductType[] = [];
        await test.step('Retrieve all products', async () => {
            products.push(...await cartPage.getCartItems());
        });
        logger.debug('Retrieved all products details');
        return products;
    }

    async proceedToCheckout(logger: TestAutomationLogger, cartPage: CartPage) {
        logger.debug('Clicking Proceed to Checkout');
        await test.step('Click Proceed to Checkout', async () => {
            await cartPage.click(cartPage.locators.proceedToCheckoutButton);
        });
        logger.debug('Clicked Proceed to Checkout');
    }

    async registerUserFromCheckout(logger: TestAutomationLogger, cartPage: CartPage) {
        logger.debug('Clicking Register / Login');
        await test.step('Click Register / Login', async () => {
            await cartPage.click(cartPage.locators.registerFromCheckoutLink);
        });
        logger.debug('Clicked Register / Login');
    }

    // Validations
    async validateCartTitle(logger: TestAutomationLogger, page: Page): Promise<void> {
        logger.debug('Validating Cart page title.');
        await test.step('Validate that Cart page have the expected title', async () => {
            await expect.soft(
                page,
                'Cart page should have the expected title'
            ).toHaveTitle('Automation Exercise - Checkout');
        });
    }

    async validateCartItems(logger: TestAutomationLogger, cartItems: ProductType[], addedItems: ProductType[]) {
        logger.debug('Validating all products in cart.');
        await test.step('Validate all products', async () => {
            expect.soft(
                cartItems,
                'Cart items must match added items.'
            ).toEqual(
                expect.arrayContaining(addedItems)
            );
        });
    }

    async validateProductQuantity(logger: TestAutomationLogger, cartPage: CartPage, quantity: number): Promise<void> {
        logger.debug(`Validating product quantity in cart to be ${quantity}.`);
        await test.step('Validate product quantity in cart', async () => {
            const product = (await cartPage.getCartItems()).at(0);
            expect.soft(
                product?.quantity,
                `Product quantity in cart should be ${quantity}.`
            ).toBe(quantity);
        });
    }

}