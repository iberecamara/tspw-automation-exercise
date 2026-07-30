import { test as apis } from "@fixtures/apis.fixtures";
import { test as logging } from "@fixtures/logging.fixtures";
import { test as pages } from "@fixtures/pages.fixtures";
import { BrandApiSteps } from "@steps/api/brand.steps";
import { LoginApiSteps } from "@steps/api/login.steps";
import { ProductApiSteps } from "@steps/api/product.steps";
import { UserApiSteps } from "@steps/api/user.steps";
import { CommonSteps } from "@steps/ui/common/common.steps";
import { BrandComponentSteps } from "@steps/ui/components/brand.component.steps";
import { CategoryComponentSteps } from "@steps/ui/components/category.component.steps";
import { FooterComponentSteps } from "@steps/ui/components/footer.component.steps";
import { HeaderComponentSteps } from "@steps/ui/components/header.component.steps";
import { ProductListingComponentSteps } from "@steps/ui/components/product-listing.component.steps";
import { AccountCreatedDeletedSteps } from "@steps/ui/pages/account-created-deleted.steps";
import { BrandSteps } from "@steps/ui/pages/brand.steps";
import { CartSteps } from "@steps/ui/pages/cart.steps";
import { CategorySteps } from "@steps/ui/pages/category.steps";
import { CheckoutSteps } from "@steps/ui/pages/checkout.steps";
import { ContactUsSteps } from "@steps/ui/pages/contact-us.steps";
import { HomeSteps } from "@steps/ui/pages/home.steps";
import { PaymentSteps } from "@steps/ui/pages/payment.steps";
import { ProductSteps } from "@steps/ui/pages/product.steps";
import { ProductsSteps } from "@steps/ui/pages/products.steps";
import { SignupLoginSteps } from "@steps/ui/pages/signup-login.steps";
import { SignupSteps } from "@steps/ui/pages/signup.steps";
import { TestCasesSteps } from "@steps/ui/pages/test-cases.steps";
import { VisualSteps } from "@steps/ui/visual/visual.steps";
import { mergeTests } from "playwright/test";

/**
 * One fixture per Steps class — both UI (page-driving and component-driving) and API — each
 * built from the corresponding page/component/API-client fixture below.
 */
interface StepsFixtures {
  // API
  userApiSteps: UserApiSteps;
  productApiSteps: ProductApiSteps;
  brandApiSteps: BrandApiSteps;
  loginApiSteps: LoginApiSteps;

  // UI
  // Pages
  commonSteps: CommonSteps;
  homeSteps: HomeSteps;
  signupLoginSteps: SignupLoginSteps;
  signupSteps: SignupSteps;
  accountCreatedDeletedSteps: AccountCreatedDeletedSteps;
  contactUsSteps: ContactUsSteps;
  testCaseSteps: TestCasesSteps;
  productsSteps: ProductsSteps;
  productSteps: ProductSteps;
  cartSteps: CartSteps;
  checkoutSteps: CheckoutSteps;
  paymentSteps: PaymentSteps;
  categorySteps: CategorySteps;
  brandSteps: BrandSteps;

  // Components
  headerComponentSteps: HeaderComponentSteps;
  categoryComponentSteps: CategoryComponentSteps;
  brandComponentSteps: BrandComponentSteps;
  productListingComponentSteps: ProductListingComponentSteps;
  footerComponentSteps: FooterComponentSteps;

  // Visual
  visualSteps: VisualSteps;
}

/** Base fixture set every Steps fixture below is built on top of (API clients, pages, logging). */
const merged = mergeTests(apis, pages, logging);

/** Extends the merged base with one fixture per Steps class, ready to `mergeTests()` with the rest. */
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

  // UI - Page steps
  commonSteps: async ({ page }, use) => {
    await use(new CommonSteps(page));
  },
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

  // UI - Component steps
  headerComponentSteps: async ({ page }, use) => {
    await use(new HeaderComponentSteps(page));
  },
  categoryComponentSteps: async ({}, use) => {
    await use(new CategoryComponentSteps());
  },
  brandComponentSteps: async ({ page }, use) => {
    await use(new BrandComponentSteps(page));
  },
  productListingComponentSteps: async ({}, use) => {
    await use(new ProductListingComponentSteps());
  },
  footerComponentSteps: async ({}, use) => {
    await use(new FooterComponentSteps());
  },

  // UI - Visual steps
  visualSteps: async ({ page }, use) => {
    await use(new VisualSteps(page));
  },
});
