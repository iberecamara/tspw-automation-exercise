import { AccountCreatedDeletedLocators } from '@locators/account-created-deleted.locators';
import { BasePage } from '@pages/base.page';
import { Page } from '@playwright/test';

export class AccountCreatedDeletedPage extends BasePage {

    readonly locators: AccountCreatedDeletedLocators;

    constructor(page: Page) {
        super(page);
        this.locators = new AccountCreatedDeletedLocators(page);
    }

    async clickContinue(): Promise<void> {
        await this.click(this.locators.continueButton);
    }

}