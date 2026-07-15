import { Locator, Page } from '@playwright/test';

export class ContinueShoppingViewCartComponentLocators {

    readonly continueShoppingButton: Locator;
    readonly viewCartLink: Locator;

    constructor(page: Page) {
        this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping' });
        this.viewCartLink = page.locator('.modal-body').getByRole('link', { name: 'View Cart' });
    }

}