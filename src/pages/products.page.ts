import { ContinueShoppingViewCartComponents } from '@components/continueshopping-viewcart.components';
import { HeaderComponents } from '@components/header.components';
import { ProductComponents } from '@components/product.components';
import { ProductsLocators } from '@locators/products.locators';
import { BasePage } from '@pages/base.page';
import { expect, Page } from '@playwright/test';

export class ProductsPage extends BasePage {

    readonly locators: ProductsLocators;
    readonly header: HeaderComponents;
    readonly product: ProductComponents;
    readonly continueShoppingViewCart: ContinueShoppingViewCartComponents;

    constructor(page: Page) {
        super(page);
        this.locators = new ProductsLocators(page);
        this.header = new HeaderComponents(page);
        this.product = new ProductComponents(page);
        this.continueShoppingViewCart = new ContinueShoppingViewCartComponents(page);
    }

    async searchProducts(terms: string): Promise<void> {
        await this.fill(this.locators.searchProductsInput, terms);
        await this.click(this.locators.searchProductsButton);
    }

    async clickContinueShopping(): Promise<void> {
        await expect(this.locators.continueShoppingButton).toBeVisible();
        await this.click(this.locators.continueShoppingButton);
    }

}