import { ContinueShoppingViewCartLocators } from '@locators/continueshopping-viewcart.component.locators';
import { BasePage } from '@pages/base.page';
import { expect, Page } from '@playwright/test';

export class ContinueShoppingViewCartComponents extends BasePage {

    readonly locators: ContinueShoppingViewCartLocators;

    constructor(page: Page) {
        super(page);
        this.locators = new ContinueShoppingViewCartLocators(page);
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