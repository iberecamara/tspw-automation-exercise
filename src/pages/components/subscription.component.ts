import { SubscriptionLocators } from '@locators/page/subscription.locators';
import { BasePage } from '@pages.base/base.page';
import { Page } from '@playwright/test';

export class SubscriptionComponent extends BasePage {

    readonly locators: SubscriptionLocators;

    constructor(page: Page) {
        super(page);
        this.locators = new SubscriptionLocators(page);
    }

    async enterSubscriptionEmail(email: string): Promise<void> {
        await this.fill(this.locators.subscriptionEmailInput, email);
    }

    async clickSubscribe(): Promise<void> {
        await this.click(this.locators.subscriptionEmailButton);
    }

}
