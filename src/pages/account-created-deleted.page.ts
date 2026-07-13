import { Page } from '@playwright/test';
import { BasePage } from '@pages/base.page';
import { AccountCreatedDeletedLocators } from '@locators/account-created-deleted.locators';

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