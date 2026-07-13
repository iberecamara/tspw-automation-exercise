import { Locator, Page } from '@playwright/test';

export class SubscriptionLocators {

    readonly subscriptionHeading: Locator;
    readonly subscriptionEmailInput: Locator;
    readonly subscriptionEmailButton: Locator;
    readonly subscriptionMessage: Locator;

    constructor(page: Page) {
        this.subscriptionHeading = page.getByRole('heading', { name: 'Subscription' });
        this.subscriptionEmailInput = page.getByRole('textbox', { name: 'Your email address' });
        this.subscriptionEmailButton = page.locator('#subscribe');
        this.subscriptionMessage = page.getByText('You have been successfully subscribed!');
    }

}