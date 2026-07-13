import { HeaderComponents } from '@components/header.components';
import { SubscriptionComponents } from '@components/subscription.components';
import { HomeLocators } from '@locators/home.locators';
import { BasePage } from '@pages/base.page';
import { expect, Locator, Page } from '@playwright/test';

export class HomePage extends BasePage {

    readonly locators: HomeLocators;
    readonly header: HeaderComponents;
    readonly subscription: SubscriptionComponents;

    constructor(page: Page) {
        super(page);
        this.locators = new HomeLocators(page);
        this.header = new HeaderComponents(page);
        this.subscription = new SubscriptionComponents(page);
    }

    async clickProductView(productIndex: number): Promise<void> {
        this.click(this.locators.productViewLink(productIndex));
    }

    async hoverProduct(productName: string): Promise<void> {
        await this.hover(await this.locators.productLocator(productName).first());
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
        await expect(this.locators.continueShoppingButton).toBeHidden();
    }

}