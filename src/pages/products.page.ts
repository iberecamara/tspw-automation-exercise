import { HeaderComponents } from '@components/header.components';
import { ProductsLocators } from '@locators/products.locators';
import { EMPTY } from '@data/constants/string.constants';
import { ProductType } from '@data/model/product.model';
import { BasePage } from '@pages/base.page';
import { expect, Locator, Page } from '@playwright/test';
import { TestAutomationException } from '../exceptions/test-automation.exception';

export class ProductsPage extends BasePage {

    readonly locators: ProductsLocators;
    readonly header: HeaderComponents;

    constructor(page: Page) {
        super(page);
        this.locators = new ProductsLocators(page);
        this.header = new HeaderComponents(page);
    }

    async getProducts(): Promise<ProductType[]> {
        const products: ProductType[] = [];
        const locators: Locator[] = await this.locators.productsContainer.locator('.single-products').all();
        for (const locator of locators) {
            products.push(await this.getProductDetails({ locator: locator }));
        }
        return products;
    }

    async getProductsCount(): Promise<number> {
        return await this.locators.productsContainer.locator('.single-products').count();
    }

    async getProductDetails(options: { locator?: Locator, productName?: string }): Promise<ProductType> {
        if (!options.locator && !options.productName) {
            throw new TestAutomationException('Please provide either a locator or a product name.');
        }
        if (options.productName) {
            options.locator = await this.locators.productLocator(options.productName);
        }
        const price = await options?.locator?.locator('h2').first().textContent() ?? EMPTY;
        const name = await options?.locator?.locator('p').first().textContent() ?? EMPTY;
        return {
            name: name,
            price: +price.replace('Rs. ', EMPTY),
        }
    }

    async clickProductView(productIndex: number): Promise<void> {
        this.click(this.locators.productViewLink(productIndex));
    }

    async searchProducts(terms: string): Promise<void> {
        await this.fill(this.locators.searchProductsInput, terms);
        await this.click(this.locators.searchProductsButton);
    }

    async hoverProduct(productName: string): Promise<void> {
        await this.hover(await this.locators.productLocator(productName));
    }

    async clickAddToCartFromHover(productName: string): Promise<void> {
        const productLocator: Locator = await this.locators.productLocator(productName);
        const overlayLocator: Locator = productLocator.locator('.product-overlay');
        const addToCartLocator: Locator = overlayLocator.getByText('Add to cart');
        await this.click(addToCartLocator);
    }

    async clickContinueShopping(): Promise<void> {
        await expect(this.locators.continueShoppingButton).toBeVisible();
        await this.click(this.locators.continueShoppingButton);
    }

}