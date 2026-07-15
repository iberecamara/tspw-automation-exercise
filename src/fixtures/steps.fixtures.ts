import { test as apis } from '@fixtures/api.fixtures';
import { test as logging } from '@fixtures/logging.fixtures';
import { test as pages } from '@fixtures/pages.fixtures';
import { ProductApiSteps } from '@steps/api/product.steps';
import { UserApiSteps } from '@steps/api/user.steps';
import { AccountCreatedDeletedSteps } from '@steps/ui/account-created-deleted.steps';
import { CartSteps } from '@steps/ui/cart.steps';
import { CategorySteps } from '@steps/ui/category.steps';
import { CheckoutSteps } from '@steps/ui/checkout.steps';
import { ContactUsSteps } from '@steps/ui/contact-us.steps';
import { HomeSteps } from '@steps/ui/home.steps';
import { PaymentSteps } from '@steps/ui/payment.steps';
import { ProductSteps } from '@steps/ui/product.steps';
import { ProductsSteps } from '@steps/ui/products.steps';
import { SharedSteps } from '@steps/ui/shared.steps';
import { SignupLoginSteps } from '@steps/ui/signup-login.steps';
import { SignupSteps } from '@steps/ui/signup.steps';
import { TestCasesSteps } from '@steps/ui/test-cases.steps';
import { TestAutomationLogger } from '@utils/logger.utils';
import { mergeTests } from 'playwright/test';

type StepConstructor<T, D> = new (logger: TestAutomationLogger, dependency: D) => T;

async function createStepFixture<T, D>(
    stepConstructor: StepConstructor<T, D>,
    logger: TestAutomationLogger,
    dependency: D,
    use: (value: T) => Promise<void>
) {
    const stepInstance = new stepConstructor(logger, dependency);
    await use(stepInstance);
}

type StepsFixtures = {
    // API
    userApiSteps: UserApiSteps,
    productApiSteps: ProductApiSteps,

    // UI
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
    // API
    userApiSteps: async ({ logger, userApi }, use) => createStepFixture(UserApiSteps, logger, userApi, use),
    productApiSteps: async ({ logger, productApi }, use) => createStepFixture(ProductApiSteps, logger, productApi, use),

    // UI
    homeSteps: async ({ logger, homePage }, use) => createStepFixture(HomeSteps, logger, homePage, use),
    signupLoginSteps: async ({ logger, signupLoginPage }, use) => createStepFixture(SignupLoginSteps, logger, signupLoginPage, use),
    signupSteps: async ({ logger, signupPage }, use) => createStepFixture(SignupSteps, logger, signupPage, use),
    accountCreatedDeletedSteps: async ({ logger, accountCreatedDeletedPage }, use) => createStepFixture(AccountCreatedDeletedSteps, logger, accountCreatedDeletedPage, use),
    contactUsSteps: async ({ logger, contactUsPage }, use) => createStepFixture(ContactUsSteps, logger, contactUsPage, use),
    testCaseSteps: async ({ logger, testCasesPage }, use) => createStepFixture(TestCasesSteps, logger, testCasesPage, use),
    productsSteps: async ({ logger, productsPage }, use) => createStepFixture(ProductsSteps, logger, productsPage, use),
    productSteps: async ({ logger, productPage }, use) => createStepFixture(ProductSteps, logger, productPage, use),
    sharedSteps: async ({ logger, page }, use) => createStepFixture(SharedSteps, logger, page, use),
    cartSteps: async ({ logger, cartPage }, use) => createStepFixture(CartSteps, logger, cartPage, use),
    checkoutSteps: async ({ logger, checkoutPage }, use) => createStepFixture(CheckoutSteps, logger, checkoutPage, use),
    paymentSteps: async ({ logger, paymentPage }, use) => createStepFixture(PaymentSteps, logger, paymentPage, use),
    categorySteps: async ({ logger, categoryPage }, use) => createStepFixture(CategorySteps, logger, categoryPage, use),
});