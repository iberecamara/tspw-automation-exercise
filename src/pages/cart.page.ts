import { SubscriptionComponents } from '@components/subscription.components';
import { CartLocators } from '@locators/cart.locators';
import { EMPTY } from '@data/constants/string.constants';
import { ProductCategoryType } from '@data/model/product-category.model';
import { ProductType } from '@data/model/product.model';
import { BasePage } from '@pages/base.page';
import { Locator, Page } from '@playwright/test';

export class CartPage extends BasePage {

    readonly locators: CartLocators;
    readonly subscription: SubscriptionComponents;

    constructor(page: Page) {
        super(page);
        this.locators = new CartLocators(page);
        this.subscription = new SubscriptionComponents(page);
    }

    async getCartItems(): Promise<ProductType[]> {
        const cartItems: ProductType[] = []
        const itemLocators: Locator[] = await this.locators.cartItemsTable.locator('tbody').locator('tr').all();
        for (const itemLocator of itemLocators) {
            const index = await itemLocator.getAttribute('id') ?? EMPTY;
            const name = await itemLocator.locator('.cart_description').getByRole('link').textContent() ?? EMPTY;
            let rawCategory = await itemLocator.locator('.cart_description').locator('p').textContent() ?? EMPTY;
            rawCategory = rawCategory.replace('Category: ', EMPTY);
            const price = await itemLocator.locator('.cart_price').locator('p').textContent() ?? EMPTY;
            const quantity = await itemLocator.locator('.cart_quantity').getByRole('button').textContent() ?? EMPTY;
            const totalPrice = await itemLocator.locator('.cart_total_price').textContent() ?? EMPTY;
            const categoryDelimiter = ' > ';
            const category: ProductCategoryType = {
                usertype: {
                    usertype: rawCategory.slice(0, rawCategory.indexOf(categoryDelimiter))
                },
                category: rawCategory.slice(rawCategory.indexOf(categoryDelimiter) + categoryDelimiter.length)
            };
            cartItems.push({
                index: +index.replace('product-', EMPTY),
                name: name,
                category: category,
                price: +price.replace('Rs. ', EMPTY),
                quantity: +quantity,
                totalPrice: +totalPrice.replace('Rs. ', EMPTY),
            });
        }
        return cartItems;
    }

}
