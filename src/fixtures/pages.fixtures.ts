
import { AccountCreatedDeletedPage } from '@pages/account-created-deleted.page';
import { CartPage } from '@pages/cart.page';
import { CategoryPage } from '@pages/category.page';
import { CheckoutPage } from '@pages/checkout.page';
import { ContactUsPage } from '@pages/contact-us.page';
import { HomePage } from '@pages/home.page';
import { PaymentPage } from '@pages/payment.page';
import { ProductPage } from '@pages/product.page';
import { ProductsPage } from '@pages/products.page';
import { SignupLoginPage } from '@pages/signup-login.page';
import { SignupPage } from '@pages/signup.page';
import { TestCasesPage } from '@pages/test-cases.page';
import { test as base, Page } from '@playwright/test';

type PageConstructor<PageClass> = new (page: Page) => PageClass;

function createPageFixture<PageClass>(pageConstructor: PageConstructor<PageClass>) {
    return async ({ page }: { page: Page }, use: (value: PageClass) => Promise<void>) => {
        const pageInstance = new pageConstructor(page);
        await use(pageInstance);
    };
}

type PageFixtures = {
    adblocker: void;
    homePage: HomePage,
    signupLoginPage: SignupLoginPage,
    signupPage: SignupPage,
    accountCreatedDeletedPage: AccountCreatedDeletedPage,
    contactUsPage: ContactUsPage,
    testCasesPage: TestCasesPage,
    productsPage: ProductsPage,
    productPage: ProductPage,
    cartPage: CartPage,
    checkoutPage: CheckoutPage,
    paymentPage: PaymentPage,
    categoryPage: CategoryPage,
};

export const test = base.extend<PageFixtures>({
    adblocker: [
        async ({ page }, use) => {
            await page.route('**/*', route => {
                route.request().url().startsWith('https://googleads.') ?
                    route.abort() : route.continue();
                return;
            });
            use();
        }, {
            auto: true
        }
    ],
    homePage: createPageFixture(HomePage),
    signupLoginPage: createPageFixture(SignupLoginPage),
    signupPage: createPageFixture(SignupPage),
    accountCreatedDeletedPage: createPageFixture(AccountCreatedDeletedPage),
    contactUsPage: createPageFixture(ContactUsPage),
    testCasesPage: createPageFixture(TestCasesPage),
    productsPage: createPageFixture(ProductsPage),
    productPage: createPageFixture(ProductPage),
    cartPage: createPageFixture(CartPage),
    checkoutPage: createPageFixture(CheckoutPage),
    paymentPage: createPageFixture(PaymentPage),
    categoryPage: createPageFixture(CategoryPage),
});