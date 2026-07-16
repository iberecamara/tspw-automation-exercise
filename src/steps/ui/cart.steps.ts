import { ProductType } from '@data/model/product.model';
import { test } from '@fixtures/fixtures';
import { CartPage } from '@pages/cart.page';
import { expect } from '@playwright/test';
import { TestAutomationLogger } from '@utils/logger.utils';
import { StringUtils } from '@utils/string.utils';

export class CartSteps {

    readonly logger: TestAutomationLogger;
    readonly cartPage: CartPage;

    constructor(logger: TestAutomationLogger, cartPage: CartPage) {
        this.logger = logger;
        this.cartPage = cartPage;
    }

    // Actions
    async getCartProducts(): Promise<ProductType[]> {
        this.logger.debug('Retrieving all products details');
        const products: ProductType[] = [];
        await test.step('Retrieve all products', async () => {
            products.push(...await this.cartPage.getCartItems());
        });
        this.logger.debug('Retrieved all products details');
        return products;
    }

    async removeProducts(products: ProductType[]): Promise<void> {
        this.logger.debug('Removing products from cart');
        await test.step('Remove products from cart', async () => {
            for (const product of products) {
                this.logger.debug(`Removing product: ${StringUtils.prettyJson(product)}`);
                await this.cartPage.removeProduct(product.id!);
            }
        });
        this.logger.debug('Removed products from cart');
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
    async validateCartItems(cartItems: ProductType[], addedItems: ProductType[], options?: { partial?: boolean }) {
        this.logger.debug(`Validating all (${cartItems.length}) products in cart match all (${addedItems.length}) expected products.`);
        await test.step('Validate all products', async () => {
            expect.soft(
                cartItems.length,
                'Cart items length must match added items length.'
            ).toEqual(
                addedItems.length
            );
            if (options?.partial === true) {
                for (const item of addedItems) {
                    expect.soft(
                        cartItems.filter((cartItem: ProductType) => cartItem.name === item.name),
                        'Cart items must match added items by name.'
                    ).toBeTruthy();
                }
            } else {
                expect.soft(
                    cartItems,
                    'Cart items must match added items.'
                ).toEqual(
                    expect.arrayContaining(addedItems)
                );
            }
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