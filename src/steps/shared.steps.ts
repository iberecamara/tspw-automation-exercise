import { HeaderComponents } from '@components/header.components';
import { Environment } from '@configs/environment.config';
import { DOWN, EMPTY, PAGES_TITLES } from '@data/constants/constants';
import { ProductType } from '@data/model/product.model';
import { UserType } from '@data/model/user.model';
import { SitePages } from '@data/types/site-pages.type';
import { faker } from '@faker-js/faker';
import { test } from '@fixtures/fixtures';
import { BasePage } from '@pages/base.page';
import { CartPage } from '@pages/cart.page';
import { HomePage } from '@pages/home.page';
import { ProductPage } from '@pages/product.page';
import { ProductsPage } from '@pages/products.page';
import { expect, Page } from '@playwright/test';
import { ArraysUtils } from '@utils/arrays.utils';
import { TestAutomationLogger } from '@utils/logger.utils';

export class SharedSteps {

    readonly logger: TestAutomationLogger;

    constructor(logger: TestAutomationLogger,) {
        this.logger = logger;
    }

    // Actions
    async navigateHome<T extends BasePage>(pageObject: T): Promise<void> {
        this.logger.debug(`Navigating to home page at '${Environment.BASE_URL}'.`);
        await test.step('Navigate to application home page', async () => {
            await pageObject.goToHome();
        });
        this.logger.debug('Navigated to home page.');
    };

    async clickHome(header: HeaderComponents): Promise<void> {
        this.logger.debug(`Clicking 'Home' button in header`);
        await test.step(`Click 'Home' button in header`, async () => {
            await header.clickHome();
        });
        this.logger.debug(`Clicked 'Home' button in header`);
    }

    async clickSignupLogin(header: HeaderComponents): Promise<void> {
        this.logger.debug(`Clicking 'Signup / Login' button in header`);
        await test.step(`Click 'Signup / Login' button in header`, async () => {
            await header.clickSignupLogin();
        });
        this.logger.debug(`Clicked 'Signup / Login' button in header`);
    }

    async clickDeleteAccount(header: HeaderComponents): Promise<void> {
        this.logger.debug(`Clicking 'Delete Account' in header`);
        await test.step(`Click 'Delete Account' in header`, async () => {
            await header.clickDeleteAccount();
        });
        this.logger.debug(`Clicked 'Delete Account' in header`);
    }

    async clickLogout(header: HeaderComponents): Promise<void> {
        this.logger.debug(`Clicking 'Logout' in header`);
        await test.step(`Click 'Logout' in header`, async () => {
            await header.clickLogout();
        });
        this.logger.debug(`Clicked 'Logout' in header`);
    }

    async clickContactUs(header: HeaderComponents): Promise<void> {
        this.logger.debug(`Clicking 'Contact us' in header`);
        await test.step(`Click 'Contact us' in header`, async () => {
            await header.clickContactUs();
        });
        this.logger.debug(`Clicked 'Contact us' in header`);
    }

    async clickTestCases(header: HeaderComponents): Promise<void> {
        this.logger.debug(`Clicking 'Test Cases' in header`);
        await test.step(`Click 'Test Cases' in header`, async () => {
            await header.clickTestCases();
        });
        this.logger.debug(`Clicked 'Test Cases' in header`);
    }

    async clickProducts(header: HeaderComponents): Promise<void> {
        this.logger.debug(`Cicking 'Products' in header`);
        await test.step(`Click 'Products' in header`, async () => {
            await header.clickProducts();
        });
        this.logger.debug(`Clicked 'Products' in header`);
    }

    async clickCart(header: HeaderComponents): Promise<void> {
        this.logger.debug(`Clicking 'Cart' in header`);
        await test.step(`Click 'Cart' in header`, async () => {
            await header.clickCart();
        });
        this.logger.debug(`Clicked 'Cart' in header`);
    }

    async scrolling<T extends BasePage>(pageObject: T, direction: string): Promise<void> {
        this.logger.debug(`Scrolling to ${direction.toLowerCase() === DOWN ? 'bottom' : 'top'} of page.`);
        await test.step(`Scrolling to ${direction.toLowerCase() === DOWN ? 'bottom' : 'top'} of page.`, async () => {
            await pageObject.scroll(direction);
        });
        this.logger.debug(`Scrolled to ${direction.toLowerCase() === DOWN ? 'bottom' : 'top'} of page.`);
    };

    async subscribeEmail(pageObject: HomePage | CartPage, email: string): Promise<void> {
        this.logger.debug('Subscribing email in page');
        this.logger.debug(`Using email '${email}'`);
        await test.step('Subscribing email in page', async () => {
            await pageObject.subscription.enterSubscriptionEmail(email);
            await pageObject.subscription.clickSubscribe();
        });
        this.logger.debug('Subscribed email in page');
    }

    async continueShopping(pageObject: HomePage | ProductsPage | ProductPage): Promise<void> {
        this.logger.debug('Clicking Continue Shopping.');
        await test.step('Click Continue Shopping', async () => {
            await pageObject.continueShoppingViewCart.clickContinueShopping();
        });
        this.logger.debug('Clicked Continue Shopping.');
    }

    async hoverProduct(pageObject: HomePage | ProductsPage, productName: string): Promise<void> {
        this.logger.debug(`Hovering over product '${productName}'.`);
        await test.step(`Hover over product '${productName}'.`, async () => {
            await pageObject.product.hoverProduct(productName);
        });
        this.logger.debug(`Hovered over product '${productName}'.`);
    }

    async addProductToCartFromHover(pageObject: HomePage | ProductsPage, productName: string): Promise<void> {
        this.logger.debug(`Adding product '${productName}' to cart from hover overlay.`);
        await test.step(`Add product '${productName}' to cart from hover overlay.`, async () => {
            await pageObject.product.clickAddToCartFromHover(productName);
        });
        this.logger.debug(`Added product '${productName}' to cart from hover overlay.`);
    }

    async addProductsToCart(pageObject: HomePage, products: ProductType[]): Promise<void> {
        this.logger.debug(`Adding ${products.length} products to cart.`);
        for (const product of products) {
            await this.hoverProduct(pageObject, product.name);
            await this.addProductToCartFromHover(pageObject, product.name);
            await this.continueShopping(pageObject);
        }
    }

    async selectRandomProducts(products: ProductType[]): Promise<ProductType[]> {
        const quantity = faker.number.int({ min: 1, max: 3 });
        const selectedProducts: ProductType[] = [];
        this.logger.debug(`Selecting ${quantity} products from the list.`);
        await test.step(`Select ${quantity} products from the list`, async () => {
            const count = 1;
            selectedProducts.push(...ArraysUtils.getRandomElements(products, { quantity: quantity, indexLimit: 10 }));
            this.logger.debug(`Adding ${count} to each product quantity.`);
            this.logger.debug(`Adding ${count} times product price to each product total price.`);
            this.logger.debug(`Removing unecessary 'brand' field from each product to match validations.`);
            for (const product of selectedProducts) {
                product.quantity = 1;
                product.totalPrice = 1 * product.price;
                delete product.brand;
            }
        });
        this.logger.debug(`Selected ${quantity} products from the list.`);
        return selectedProducts;
    }

    async viewProduct(pageObject: HomePage | ProductsPage, productIndex: number): Promise<void> {
        this.logger.debug(`Clicking 'View Product' in home page`);
        await test.step(`Click 'View Product' in home page`, async () => {
            await pageObject.product.clickProductView(productIndex);
        });
        this.logger.debug(`Clicked 'View Product' in home page`);
    }

    async navigateToProductView(pageObject: ProductsPage | HomePage, productIndex: number): Promise<void> {
        this.logger.debug(`Navigating to product #${productIndex}`);
        await test.step('Navigating to product view', async () => {
            await pageObject.product.clickProductView(productIndex);
        });
        this.logger.debug(`Navigated to product #${productIndex}`);
    }

    async getProducts(pageObject: ProductsPage | HomePage): Promise<ProductType[]> {
        this.logger.debug('Retrieveing all products details');
        const products: ProductType[] = [];
        await test.step('Retrieve all products', async () => {
            products.push(...await pageObject.product.getProducts());
        });
        this.logger.debug('Retrieved all products details');
        return products;
    }

    async getProductDetails(pageObject: ProductsPage | HomePage | ProductPage, productName: string): Promise<ProductType> {
        this.logger.debug(`Retrieving products details for '${productName}'.`);
        let product: ProductType = { name: EMPTY, price: 0 };
        await test.step(`Retrieve product details for '${productName}'`, async () => {
            product = await pageObject.product.getProductDetails({ productName: productName });
        });
        this.logger.debug(`Retried products details for '${productName}'.`);
        return product;
    }

    async getProductsCount(pageObject: ProductsPage | HomePage): Promise<number> {
        this.logger.debug('Getting the number of Products displayed');
        let count: number;
        await test.step('Getting the number of Products displayed', async () => {
            count = await pageObject.product.getProductsCount();
        });
        this.logger.debug(`Found ${count!} Products in page`);
        return count!;
    }

    // Validations
    async validateSubscriptionHeading(pageObject: HomePage | CartPage): Promise<void> {
        this.logger.debug('Validating that page have the Subscription heading');
        await test.step('Validate that page have the Subscription heading', async () => {
            await expect.soft(
                pageObject.subscription.locators.subscriptionHeading,
                'Page should have the expected Subscription heading'
            ).toBeVisible();
        });
    };

    async validateProductsCount(count: number, expectedCount: number): Promise<void> {
        this.logger.debug('Validating count of Products in page.');
        await test.step('Validate that Products page have the expected amout of products', async () => {
            expect.soft(
                count,
                'Products page should have the expected amout of products'
            ).toBe(expectedCount);
        });
    }

    async validateSubscriptionMessage(pageObject: HomePage | CartPage): Promise<void> {
        this.logger.debug('Validating that the Subscription message is displayed');
        await test.step('Validate that the Subscription message is displayed', async () => {
            await expect.soft(
                pageObject.subscription.locators.subscriptionMessage,
                'Subscription message should be displayed'
            ).toBeVisible();
        });
    };

    async validateUserLoggedText(header: HeaderComponents, user: UserType): Promise<void> {
        this.logger.debug(`Validating that 'Logged in as < username > ' text is displayed`);
        await test.step(`Validate that 'Logged in as < username > ' text is displayed`, async () => {
            await expect.soft(
                header.locators.loggedInText(user.name),
                `'Logged in as ${user.name}' text should be visible`
            ).toBeVisible();
        });
    }

    // Validations
    async validateTitle(page: Page, sitePage: SitePages): Promise<void> {
        this.logger.debug(`Validating that application ${sitePage} page have the expected title`);
        await test.step(`Validate that application ${sitePage} page have the expected title`, async () => {
            await expect.soft(
                page,
                `${sitePage} page should have the expected title: ${Environment.APPLICATION} `
            ).toHaveTitle(PAGES_TITLES[sitePage]);
        });
    };

}