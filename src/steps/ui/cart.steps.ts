import { ProductType } from '@data/model/product.model';
import { test } from '@fixtures/fixtures';
import { CartPage } from '@pages/cart.page';
import { expect } from '@playwright/test';
import { BaseSteps } from '@steps/base.steps';
import { StringUtils } from '@utils/string.utils';

export class CartSteps extends BaseSteps {

    readonly cartPage: CartPage;

    constructor(cartPage: CartPage) {
        super();
        this.cartPage = cartPage;
    }

    // Actions
    async getCartProducts(): Promise<ProductType[]> {
        this.logger.debug('Retrieving all products details');
        const products: ProductType[] = [];

        await test.step('Retrieve all products', async () => {
            products.push(...await this.cartPage.cart.getCartItems());
        });

        this.logger.debug('Retrieved all products details');
        return products;
    }

    async removeProducts(products: ProductType[]): Promise<void> {
        this.logger.debug('Removing products from cart');

        await test.step('Remove products from cart', async () => {
            for (const product of products) {
                expect(
                    product.id,
                    `Cannot remove product '${product.name}' from cart: missing id.`
                ).toBeDefined();
                this.logger.debug(`Removing product: ${StringUtils.prettyJson(product)}`);
                const productId = product.id ?? -1;
                await this.cartPage.cart.removeProduct(productId);
            }
        });

        this.logger.debug('Removed products from cart');
    }

    async proceedToCheckout(): Promise<void> {
        this.logger.debug('Clicking Proceed to Checkout');

        await test.step('Click Proceed to Checkout', async () => {
            await this.cartPage.clickProceedToCheckoutButton();
        });

        this.logger.debug('Clicked Proceed to Checkout');
    }

    async registerUserFromCheckout(): Promise<void> {
        this.logger.debug('Clicking Register / Login');

        await test.step('Click Register / Login', async () => {
            await this.cartPage.clickRegisterFromCheckoutLink();
        });

        this.logger.debug('Clicked Register / Login');
    }

    // Validations
    async validateCartItems(cartItems: ProductType[], addedItems: ProductType[], options?: { partial?: boolean }): Promise<void> {
        this.logger.debug(`Validating all (${cartItems.length}) products in cart match all (${addedItems.length}) expected products.`);

        await test.step('Validate all products length', () => {
            expect.soft(
                cartItems,
                'Cart items must match added items count.'
            ).toHaveLength(addedItems.length);
        });

        if (options?.partial === true) {
            await test.step('Validate all products - partial product match', () => {
                for (const item of addedItems) {
                    expect.soft(
                        cartItems.filter((cartItem: ProductType) => cartItem.name === item.name),
                        'Cart items must match added items by name.'
                    ).toBeTruthy();
                }
            });
        } else {
            await test.step('Validate all products length - full product match', () => {
                expect.soft(
                    cartItems,
                    'Cart items must match added items.'
                ).toEqual(
                    expect.arrayContaining(addedItems)
                );
            });
        }
    }

    async validateProductQuantity(quantity: number): Promise<void> {
        this.logger.debug(`Validating product quantity in cart to be ${quantity}.`);

        await test.step('Validate product quantity in cart', async () => {
            const product = (await this.cartPage.cart.getCartItems()).at(0);
            expect.soft(
                product?.quantity,
                `Product quantity in cart should be ${quantity}.`
            ).toBe(quantity);
        });
    }

}