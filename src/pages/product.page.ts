import { ProductLocators } from '@locators/product.locators';
import { EMPTY } from '@data/constants/string.constants';
import { ProductCategoryType } from '@data/model/product-category.model';
import { ProductType } from '@data/model/product.model';
import { BasePage } from '@pages/base.page';
import { expect, Page } from '@playwright/test';

export class ProductPage extends BasePage {

    readonly locators: ProductLocators;

    constructor(page: Page) {
        super(page);
        this.locators = new ProductLocators(page);
    }

    async getProductDetails(): Promise<ProductType> {
        const index = await this.locators.productDetailContainer.locator('#product_id').first().getAttribute('value') ?? EMPTY;
        const name = await this.locators.productDetailContainer.locator('h2').first().textContent() ?? EMPTY;
        let rawCategory = await this.locators.productDetailContainer.locator('p').first().textContent() ?? EMPTY;
        rawCategory = rawCategory.replace('Category: ', EMPTY);
        const price = await this.locators.productDetailContainer.locator('span').first().locator('span').first().textContent() ?? EMPTY;
        const availability = await this.locators.productDetailContainer.locator('p').nth(1).textContent() ?? EMPTY;
        const condition = await this.locators.productDetailContainer.locator('p').nth(2).textContent() ?? EMPTY;
        const brand = await this.locators.productDetailContainer.locator('p').nth(3).textContent() ?? EMPTY;
        const categoryDelimiter = ' > ';
        const category: ProductCategoryType = {
            usertype: {
                usertype: rawCategory.slice(0, rawCategory.indexOf(categoryDelimiter))
            },
            category: rawCategory.slice(rawCategory.indexOf(categoryDelimiter) + categoryDelimiter.length)
        };
        return {
            index: +index,
            name: name,
            category: category,
            price: +price.replace('Rs. ', EMPTY),
            availability: availability.replace('Availability: ', EMPTY),
            condition: condition.replace('Condition: ', EMPTY),
            brand: brand.replace('Brand: ', EMPTY)
        }
    }

    async setQuantity(quantity: number): Promise<void> {
        await this.fill(this.locators.productQuantityInput, quantity.toString());
    }

    async clickAddToCart(): Promise<void> {
        await this.click(this.locators.addToCartButton);
    }

    async clickContinueShopping(): Promise<void> {
        await expect(this.locators.continueShoppingButton).toBeVisible();
        await this.click(this.locators.continueShoppingButton);
    }

    async clickViewCart(): Promise<void> {
        await expect(this.locators.viewCartLink).toBeVisible();
        await this.click(this.locators.viewCartLink);
    }

}
