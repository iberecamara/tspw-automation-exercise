import { test as pages } from '@fixtures/pages.fixtures';
import { test as apis } from '@fixtures/api.fixtures';
import { test as logging } from '@fixtures/logging.fixtures';
import { mergeTests } from 'playwright/test';
import { AccountCreatedDeletedSteps } from '@steps/account-created-deleted.steps';
import { ApiSteps } from '@steps/api.steps';
import { CartSteps } from '@steps/cart.steps';
import { CheckoutSteps } from '@steps/checkout.steps';
import { ContactUsSteps } from '@steps/contact-us.steps';
import { HomeSteps } from '@steps/home.steps';
import { PaymentSteps } from '@steps/payment.steps';
import { ProductSteps } from '@steps/product.steps';
import { ProductsSteps } from '@steps/products.steps';
import { SharedSteps } from '@steps/shared.steps';
import { SignupLoginSteps } from '@steps/signup-login.steps';
import { SignupSteps } from '@steps/signup.steps';
import { TestCasesSteps } from '@steps/test-cases.steps';
import { CategorySteps } from '@steps/category.steps';

type StepsFixtures = {
    apiSteps: ApiSteps,
    homeSteps: HomeSteps,
    signupLoginSteps: SignupLoginSteps,
    signupSteps: SignupSteps,
    accountCreatedDeletedSteps: AccountCreatedDeletedSteps,
    contactUsSteps: ContactUsSteps,
    testCaseSteps: TestCasesSteps,
    productsSteps: ProductsSteps,
    productSteps: ProductSteps,
    sharedSteps: SharedSteps,
    cartSteps: CartSteps,
    checkoutSteps: CheckoutSteps,
    paymentSteps: PaymentSteps,
    categorySteps: CategorySteps,
};

const merged = mergeTests(apis, pages, logging);

export const test = merged.extend<StepsFixtures>({
    apiSteps: async ({ logger, productApi, userApi }, use) => {
        const stepInstance = new ApiSteps(logger, productApi, userApi);
        await use(stepInstance);
    },
    homeSteps: async ({ logger, homePage }, use) => {
        const stepInstance = new HomeSteps(logger, homePage);
        await use(stepInstance);
    },
    signupLoginSteps: async ({ logger, signupLoginPage }, use) => {
        const stepInstance = new SignupLoginSteps(logger, signupLoginPage);
        await use(stepInstance);
    },
    signupSteps: async ({ logger, signupPage }, use) => {
        const stepInstance = new SignupSteps(logger, signupPage);
        await use(stepInstance);
    },
    accountCreatedDeletedSteps: async ({ logger, accountCreatedDeletedPage }, use) => {
        const stepInstance = new AccountCreatedDeletedSteps(logger, accountCreatedDeletedPage);
        await use(stepInstance);
    },
    contactUsSteps: async ({ logger, contactUsPage }, use) => {
        const stepInstance = new ContactUsSteps(logger, contactUsPage);
        await use(stepInstance);
    },
    testCaseSteps: async ({ logger, testCasesPage }, use) => {
        const stepInstance = new TestCasesSteps(logger, testCasesPage);
        await use(stepInstance);
    },
    productsSteps: async ({ logger, productsPage }, use) => {
        const stepInstance = new ProductsSteps(logger, productsPage);
        await use(stepInstance);
    },
    productSteps: async ({ logger, productPage }, use) => {
        const stepInstance = new ProductSteps(logger, productPage);
        await use(stepInstance);
    },
    sharedSteps: async ({ logger, page }, use) => {
        const stepInstance = new SharedSteps(logger, page);
        await use(stepInstance);
    },
    cartSteps: async ({ logger, cartPage }, use) => {
        const stepInstance = new CartSteps(logger, cartPage);
        await use(stepInstance);
    },
    checkoutSteps: async ({ logger, checkoutPage }, use) => {
        const stepInstance = new CheckoutSteps(logger, checkoutPage);
        await use(stepInstance);
    },
    paymentSteps: async ({ logger, paymentPage }, use) => {
        const stepInstance = new PaymentSteps(logger, paymentPage);
        await use(stepInstance);
    },
    categorySteps: async ({ logger, categoryPage }, use) => {
        const stepInstance = new CategorySteps(logger, categoryPage);
        await use(stepInstance);
    },
});