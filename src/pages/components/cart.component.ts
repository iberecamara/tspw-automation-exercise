import { CATEGORY_DELIMITER, CATEGORY_PREFIX, EMPTY, ID, PRODUCT_PREFIX, RUPEES } from '@data/constants/constants';
import { ProductCategoryType } from '@data/model/product-category.model';
import { ProductType } from '@data/model/product.model';
import { CartLocators } from '@locators/component/cart.locators';
import { BasePage } from '@pages.base/base.page';
import { expect, Locator, Page } from '@playwright/test';

export class CartComponent extends BasePage {

    readonly locators: CartLocators;

    constructor(page: Page) {
        super(page);
        this.locators = new CartLocators(page);
    }

    async getCartItems(): Promise<ProductType[]> {
        const cartItems: ProductType[] = []
        const itemLocators: Locator[] = await this.locators.cartItemsTableProducts.all();
        for (const itemLocator of itemLocators) {
            const product: ProductType = await this.parseProduct(itemLocator);
            cartItems.push(product);
        }
        return cartItems;
    }

    private async parseProduct(locator: Locator): Promise<ProductType> {
        const id = await locator.getAttribute(ID) ?? EMPTY;
        const name = await this.locators.productName(locator).textContent() ?? EMPTY;
        let rawCategory = await this.locators.productCategory(locator).textContent() ?? EMPTY;
        rawCategory = rawCategory.replace(CATEGORY_PREFIX, EMPTY);
        const category: ProductCategoryType = {
            usertype: {
                usertype: rawCategory.slice(0, rawCategory.indexOf(CATEGORY_DELIMITER))
            },
            category: rawCategory.slice(rawCategory.indexOf(CATEGORY_DELIMITER) + CATEGORY_DELIMITER.length)
        };
        const price = await this.locators.productPrice(locator).textContent() ?? EMPTY;
        const quantity = await this.locators.productQuantity(locator).textContent() ?? EMPTY;
        const totalPrice = await this.locators.productTotalPrice(locator).textContent() ?? EMPTY;
        return {
            id: +id.replace(PRODUCT_PREFIX, EMPTY),
            name: name,
            category: category,
            price: +price.replace(RUPEES, EMPTY),
            quantity: +quantity,
            totalPrice: +totalPrice.replace(RUPEES, EMPTY),
        }
    }

    async removeProduct(index: number): Promise<void> {
        const locator = this.locators.removeProductFromCartButton(index);
        await this.click(locator);
        await expect(locator).not.toBeAttached();
    }

}
