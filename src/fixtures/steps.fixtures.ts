
import { test as base } from '@playwright/test';
import { AccountCreatedDeletedSteps } from '@steps/account-created-deleted.steps';
import { ApiSteps } from '@steps/api.steps';
import { CartSteps } from '@steps/cart.steps';
import { SharedSteps } from '@steps/shared.steps';
import { ContactUsSteps } from '@steps/contact-us.steps';
import { HomeSteps } from '@steps/home.steps';
import { ProductSteps } from '@steps/product.steps';
import { ProductsSteps } from '@steps/products.steps';
import { SignupLoginSteps } from '@steps/signup-login.steps';
import { SignupSteps } from '@steps/signup.steps';
import { TestCasesSteps } from '@steps/test-cases.steps';
import { CheckoutSteps } from '@steps/checkout.steps';
import { PaymentSteps } from '@steps/payment.steps';

type StepsConstructor<T> = new () => T;

function createStepFixture<T>(stepConstructor: StepsConstructor<T>) {
    return async ({ }, use: (value: T) => Promise<void>) => {
        const stepInstance = new stepConstructor();
        await use(stepInstance);
    };
}

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
};

export const test = base.extend<StepsFixtures>({
    apiSteps: createStepFixture(ApiSteps),
    homeSteps: createStepFixture(HomeSteps),
    signupLoginSteps: createStepFixture(SignupLoginSteps),
    signupSteps: createStepFixture(SignupSteps),
    accountCreatedDeletedSteps: createStepFixture(AccountCreatedDeletedSteps),
    contactUsSteps: createStepFixture(ContactUsSteps),
    testCaseSteps: createStepFixture(TestCasesSteps),
    productsSteps: createStepFixture(ProductsSteps),
    productSteps: createStepFixture(ProductSteps),
    sharedSteps: createStepFixture(SharedSteps),
    cartSteps: createStepFixture(CartSteps),
    checkoutSteps: createStepFixture(CheckoutSteps),
    paymentSteps: createStepFixture(PaymentSteps),
});