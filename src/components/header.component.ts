import { HeaderComponentLocators } from '@locators/component/header.locators';
import { BasePage } from '@pages/base.page';
import { Page } from '@playwright/test';

export class HeaderComponent extends BasePage {

    readonly locators: HeaderComponentLocators;

    constructor(page: Page) {
        super(page);
        this.locators = new HeaderComponentLocators(page);
    }

    async clickHome(): Promise<void> {
        await this.click(this.locators.signupLoginButton);
    }

    async clickSignupLogin(): Promise<void> {
        await this.click(this.locators.signupLoginButton);
    }

    async clickDeleteAccount(): Promise<void> {
        await this.click(this.locators.deleteAccountLink);
    }

    async clickLogout(): Promise<void> {
        await this.click(this.locators.logoutLink);
    }

    async clickContactUs(): Promise<void> {
        await this.click(this.locators.contactUsLink);
    }

    async clickTestCases(): Promise<void> {
        await this.click(this.locators.testCasesLink);
    }

    async clickProducts(): Promise<void> {
        await this.click(this.locators.productsLink);
    }

    async clickCart(): Promise<void> {
        await this.click(this.locators.cartLink);
    }

}
