import { BrandsComponent } from '@components/brands.component';
import { ContinueShoppingViewCartComponent } from '@components/continueshopping-viewcart.component';
import { HeaderComponent } from '@components/header.component';
import { ProductComponent } from '@components/product.component';
import { ProductsLocators } from '@locators/page/products.locators';
import { BasePage } from '@pages.base/base.page';
import { expect, Page } from '@playwright/test';

export class ProductsPage extends BasePage {

    readonly locators: ProductsLocators;
    readonly header: HeaderComponent;
    readonly products: ProductComponent;
    readonly continueShoppingViewCart: ContinueShoppingViewCartComponent;
    readonly brands: BrandsComponent;

    constructor(page: Page) {
        super(page);
        this.locators = new ProductsLocators(page);
        this.header = new HeaderComponent(page);
        this.products = new ProductComponent(page);
        this.continueShoppingViewCart = new ContinueShoppingViewCartComponent(page);
        this.brands = new BrandsComponent(page);
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