import { HeaderActions } from '@actions/header.actions';
import { Environment } from '@configs/environment.config';
import { DOWN } from '@data/constants/constants';
import { ProductType } from '@data/model/product.model';
import { UserType } from '@data/model/user.model';
import { test } from '@fixtures/fixtures';
import { BasePage } from '@pages/base.page';
import { CartPage } from '@pages/cart.page';
import { HomePage } from '@pages/home.page';
import { ProductPage } from '@pages/product.page';
import { ProductsPage } from '@pages/products.page';
import { expect } from '@playwright/test';
import { TestAutomationLogger } from '@utils/logger.utils';

export class SharedSteps {

    // Actions
    async navigateHome<T extends BasePage>(logger: TestAutomationLogger, pageObject: T): Promise<void> {
        logger.debug(`Navigating to home page at '${Environment.BASE_URL}'.`);
        await test.step('Navigate to application home page', async () => {
            await pageObject.goToHome();
        });
        logger.debug('Navigated to home page.');
    };

    async clickHome(logger: TestAutomationLogger, actions: HeaderActions): Promise<void> {
        logger.debug('Clicking "Home" button in header');
        await test.step('Click "Home" button in header', async () => {
            await actions.clickHome();
        });
        logger.debug('Clicked "Home" button in header');
    }

    async clickSignupLogin(logger: TestAutomationLogger, actions: HeaderActions): Promise<void> {
        logger.debug('Clicking "Signup / Login" button in header');
        await test.step('Click "Signup / Login" button in header', async () => {
            await actions.clickSignupLogin();
        });
        logger.debug('Clicked "Signup / Login" button in header');
    }

    async clickDeleteAccount(logger: TestAutomationLogger, actions: HeaderActions): Promise<void> {
        logger.debug('Clicking "Delete Account" in header');
        await test.step('Click "Delete Account" in header', async () => {
            await actions.clickDeleteAccount();
        });
        logger.debug('Clicked "Delete Account" in header');
    }

    async clickLogout(logger: TestAutomationLogger, actions: HeaderActions): Promise<void> {
        logger.debug('Clicking "Logout" in header');
        await test.step('Click "Logout" in header', async () => {
            await actions.clickLogout();
        });
        logger.debug('Clicked "Logout" in header');
    }

    async clickContactUs(logger: TestAutomationLogger, actions: HeaderActions): Promise<void> {
        logger.debug('Clicking "Contact us" in header');
        await test.step('Click "Contact us" in header', async () => {
            await actions.clickContactUs();
        });
        logger.debug('Clicked "Contact us" in header');
    }

    async clickTestCases(logger: TestAutomationLogger, actions: HeaderActions): Promise<void> {
        logger.debug('Clicking "Test Cases" in header');
        await test.step('Click "Test Cases" in header', async () => {
            await actions.clickTestCases();
        });
        logger.debug('Clicked "Test Cases" in header');
    }

    async clickProducts(logger: TestAutomationLogger, actions: HeaderActions): Promise<void> {
        logger.debug('Clicking "Products" in header');
        await test.step('Click "Products" in header', async () => {
            await actions.clickProducts();
        });
        logger.debug('Clicked "Products" in header');
    }

    async clickCart(logger: TestAutomationLogger, actions: HeaderActions): Promise<void> {
        logger.debug('Clicking "Cart" in header');
        await test.step('Click "Cart" in header', async () => {
            await actions.clickCart();
        });
        logger.debug('Clicked "Cart" in header');
    }

    async scrolling<T extends BasePage>(logger: TestAutomationLogger, pageObject: T, direction: string): Promise<void> {
        logger.debug(`Scrolling to ${direction.toLowerCase() === DOWN ? 'bottom' : 'top'} of page.`);
        await test.step(`Scrolling to ${direction.toLowerCase() === DOWN ? 'bottom' : 'top'} of page.`, async () => {
            await pageObject.scroll(direction);
        });
        logger.debug(`Scrolled to ${direction.toLowerCase() === DOWN ? 'bottom' : 'top'} of page.`);
    };

    async subscribeEmail(logger: TestAutomationLogger, pageObject: HomePage | CartPage, email: string): Promise<void> {
        logger.debug('Subscribing email in page');
        logger.debug(`Using email '${email}'`);
        await test.step('Subscribing email in page', async () => {
            await pageObject.subscription.enterSubscriptionEmail(email);
            await pageObject.subscription.clickSubscribe();
        });
        logger.debug('Subscribed email in page');
    }

    async continueShopping(logger: TestAutomationLogger, pageObject: HomePage | ProductsPage | ProductPage): Promise<void> {
        logger.debug('Clicking Continue Shopping.');
        await test.step('Click Continue Shopping', async () => {
            await pageObject.clickContinueShopping();
        });
        logger.debug('Clicked Continue Shopping.');
    }

    async hoverProduct(logger: TestAutomationLogger, pageObject: HomePage | ProductsPage, productName: string): Promise<void> {
        logger.debug(`Hovering over product '${productName}'.`);
        await test.step(`Hover over product '${productName}'.`, async () => {
            await pageObject.hoverProduct(productName);
        });
        logger.debug(`Hovered over product '${productName}'.`);
    }

    async addProductToCartFromHover(logger: TestAutomationLogger, pageObject: HomePage | ProductsPage, productName: string): Promise<void> {
        logger.debug(`Adding product '${productName}' to cart from hover overlay.`);
        await test.step(`Add product '${productName}' to cart from hover overlay.`, async () => {
            await pageObject.clickAddToCartFromHover(productName);
        });
        logger.debug(`Added product '${productName}' to cart from hover overlay.`);
    }

    async addProductsToCart(logger: TestAutomationLogger, pageObject: HomePage, products: ProductType[]): Promise<void> {
        logger.debug(`Adding ${products.length} products to cart...`);
        for (const product of products) {
            await this.hoverProduct(logger, pageObject, product.name);
            await this.addProductToCartFromHover(logger, pageObject, product.name);
            await this.continueShopping(logger, pageObject);
        }
    }

    // Validations
    async validateSubscriptionHeading(logger: TestAutomationLogger, pageObject: HomePage | CartPage): Promise<void> {
        logger.debug('Validating that page have the Subscription heading');
        await test.step('Validate that page have the Subscription heading', async () => {
            await expect.soft(
                pageObject.subscription.locators.subscriptionHeading,
                'Page should have the expected Subscription heading'
            ).toBeVisible();
        });
    };

    async validateSubscriptionMessage(logger: TestAutomationLogger, pageObject: HomePage | CartPage): Promise<void> {
        logger.debug('Validating that the Subscription message is displayed');
        await test.step('Validate that the Subscription message is displayed', async () => {
            await expect.soft(
                pageObject.subscription.locators.subscriptionMessage,
                'Subscription message should be displayed'
            ).toBeVisible();
        });
    };

    async validateUserLoggedText(logger: TestAutomationLogger, actions: HeaderActions, user: UserType): Promise<void> {
        logger.debug('Validating that "Logged in as <username>" text is displayed');
        await test.step('Validate that "Logged in as <username>" text is displayed', async () => {
            await expect.soft(
                actions.locators.loggedInText(user.name),
                `"Logged in as ${user.name}" text should be visible`
            ).toBeVisible();
        });
    }

}