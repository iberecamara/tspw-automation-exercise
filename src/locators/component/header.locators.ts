import { Locator, Page } from '@playwright/test';

export class HeaderComponentLocators {

    readonly homeButton: Locator;
    readonly signupLoginButton: Locator;
    readonly loggedInText: Function;
    readonly deleteAccountLink: Locator;
    readonly logoutLink: Locator;
    readonly contactUsLink: Locator;
    readonly testCasesLink: Locator;
    readonly productsLink: Locator;
    readonly cartLink: Locator;

    constructor(page: Page) {
        this.homeButton = page.getByRole('link', { name: ' Home' });
        this.signupLoginButton = page.getByRole('link', { name: ' Signup / Login' });
        this.loggedInText = (username: string): Locator => {
            return page.getByText(`Logged in as ${username}`);
        }
        this.deleteAccountLink = page.getByRole('link', { name: ' Delete Account' });
        this.logoutLink = page.getByRole('link', { name: ' Logout' });
        this.contactUsLink = page.getByRole('link', { name: ' Contact us' });
        this.testCasesLink = page.getByRole('link', { name: ' Test Cases' });
        this.productsLink = page.getByRole('link', { name: ' Products' });
        this.cartLink = page.getByRole('link', { name: ' Cart' });
    }

}