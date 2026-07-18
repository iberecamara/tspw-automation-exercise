import { test as apis } from "@fixtures/api.fixtures";
import { test as logging } from "@fixtures/logging.fixtures";
import { test as pages } from "@fixtures/pages.fixtures";
import { BrandApiSteps } from "@steps/api/brand.steps";
import { LoginApiSteps } from "@steps/api/login.steps";
import { ProductApiSteps } from "@steps/api/product.steps";
import { UserApiSteps } from "@steps/api/user.steps";
import { AccountCreatedDeletedSteps } from "@steps/ui/account-created-deleted.steps";
import { BrandSteps } from "@steps/ui/brand.steps";
import { CartSteps } from "@steps/ui/cart.steps";
import { CategorySteps } from "@steps/ui/category.steps";
import { CheckoutSteps } from "@steps/ui/checkout.steps";
import { ContactUsSteps } from "@steps/ui/contact-us.steps";
import { HomeSteps } from "@steps/ui/home.steps";
import { PaymentSteps } from "@steps/ui/payment.steps";
import { ProductSteps } from "@steps/ui/product.steps";
import { ProductsSteps } from "@steps/ui/products.steps";
import { SharedSteps } from "@steps/ui/shared.steps";
import { SignupLoginSteps } from "@steps/ui/signup-login.steps";
import { SignupSteps } from "@steps/ui/signup.steps";
import { TestCasesSteps } from "@steps/ui/test-cases.steps";
import { mergeTests } from "playwright/test";

type StepsFixtures = {
  // API
  userApiSteps: UserApiSteps;
  productApiSteps: ProductApiSteps;
  brandApiSteps: BrandApiSteps;
  loginApiSteps: LoginApiSteps;

  // UI
  homeSteps: HomeSteps;
  signupLoginSteps: SignupLoginSteps;
  signupSteps: SignupSteps;
  accountCreatedDeletedSteps: AccountCreatedDeletedSteps;
  contactUsSteps: ContactUsSteps;
  testCaseSteps: TestCasesSteps;
  productsSteps: ProductsSteps;
  productSteps: ProductSteps;
  sharedSteps: SharedSteps;
  cartSteps: CartSteps;
  checkoutSteps: CheckoutSteps;
  paymentSteps: PaymentSteps;
  categorySteps: CategorySteps;
  brandSteps: BrandSteps;
};

const merged = mergeTests(apis, pages, logging);

export const test = merged.extend<StepsFixtures>({
  // API
  userApiSteps: async ({ userApi }, use) => {
    await use(new UserApiSteps(userApi));
  },
  productApiSteps: async ({ productApi }, use) => {
    await use(new ProductApiSteps(productApi));
  },
  brandApiSteps: async ({ brandApi }, use) => {
    await use(new BrandApiSteps(brandApi));
  },
  loginApiSteps: async ({ loginApi }, use) => {
    await use(new LoginApiSteps(loginApi));
  },

  // UI
  homeSteps: async ({ homePage }, use) => {
    await use(new HomeSteps(homePage));
  },
  signupLoginSteps: async ({ signupLoginPage }, use) => {
    await use(new SignupLoginSteps(signupLoginPage));
  },
  signupSteps: async ({ signupPage }, use) => {
    await use(new SignupSteps(signupPage));
  },
  accountCreatedDeletedSteps: async ({ accountCreatedDeletedPage }, use) => {
    await use(new AccountCreatedDeletedSteps(accountCreatedDeletedPage));
  },
  contactUsSteps: async ({ contactUsPage }, use) => {
    await use(new ContactUsSteps(contactUsPage));
  },
  testCaseSteps: async ({ testCasesPage }, use) => {
    await use(new TestCasesSteps(testCasesPage));
  },
  productsSteps: async ({ productsPage }, use) => {
    await use(new ProductsSteps(productsPage));
  },
  productSteps: async ({ productPage }, use) => {
    await use(new ProductSteps(productPage));
  },
  sharedSteps: async ({ page }, use) => {
    await use(new SharedSteps(page));
  },
  cartSteps: async ({ cartPage }, use) => {
    await use(new CartSteps(cartPage));
  },
  checkoutSteps: async ({ checkoutPage }, use) => {
    await use(new CheckoutSteps(checkoutPage));
  },
  paymentSteps: async ({ paymentPage }, use) => {
    await use(new PaymentSteps(paymentPage));
  },
  categorySteps: async ({ categoryPage }, use) => {
    await use(new CategorySteps(categoryPage));
  },
  brandSteps: async ({ brandPage }, use) => {
    await use(new BrandSteps(brandPage));
  },
});
