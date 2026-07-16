import { EMPTY, RUPEES } from '@data/constants/constants';
import { ProductType } from '@data/model/product.model';
import { ProductComponentLocators } from '@locators/component/product.locators';
import { BasePage } from '@pages.base/base.page';
import { Locator, Page } from 'playwright-core';
import { TestAutomationException } from '../../exceptions/test-automation.exception';

export class ProductComponent extends BasePage {

    readonly locators: ProductComponentLocators;

    constructor(page: Page) {
        super(page);
        this.locators = new ProductComponentLocators(page);
    }

    async getProductsCount(): Promise<number> {
        return await this.locators.products.count();
    }

    async getProducts(): Promise<ProductType[]> {
        const products: ProductType[] = [];
        const locators: Locator[] = await this.locators.products.all();
        for (const locator of locators) {
            products.push(await this.getProductDetails({ locator: locator }));
        }
        return products;
    }

    async getProductDetails(options: { locator?: Locator, productName?: string }): Promise<ProductType> {
        if (!options.locator && !options.productName) {
            throw new TestAutomationException('Please provide either a locator or a product name.');
        }
        const product: Locator = options.productName ?
            await this.locators.productLocator(options.productName) :
            options.locator;
        const price = await this.locators.productName(product).textContent() ?? EMPTY;
        const name = await this.locators.productPrice(product).textContent() ?? EMPTY;
        return {
            name: name,
            price: +price.replace(RUPEES, EMPTY),
        }
    }

    async clickProductView(productIndex: number): Promise<void> {
        this.click(this.locators.productViewLink(productIndex));
    }

    async hoverProduct(productName: string): Promise<void> {
        await this.hover(await this.locators.productLocator(productName));
    }

    async clickAddToCartFromHover(productName: string): Promise<void> {
        await this.click(this.locators.productAddFromOverlay(productName));
    }

}