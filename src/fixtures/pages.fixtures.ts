import { AccountCreatedDeletedPage } from "@pages/account-created-deleted.page";
import { ApiTestingPage } from "@pages/api-testing.page";
import { BrandPage } from "@pages/brand.page";
import { CartPage } from "@pages/cart.page";
import { CategoryPage } from "@pages/category.page";
import { CheckoutPage } from "@pages/checkout.page";
import { ContactUsPage } from "@pages/contact-us.page";
import { HomePage } from "@pages/home.page";
import { PaymentPage } from "@pages/payment.page";
import { ProductPage } from "@pages/product.page";
import { ProductsPage } from "@pages/products.page";
import { SignupLoginPage } from "@pages/signup-login.page";
import { SignupPage } from "@pages/signup.page";
import { TestCasesPage } from "@pages/test-cases.page";
import { test as base, Page } from "@playwright/test";

/** Constructor signature every page object class satisfies: takes a Playwright `Page`. */
type PageConstructor<PageClass> = new (page: Page) => PageClass;

/**
 * Builds a Playwright fixture function that instantiates the given page object class with the
 * test's `page`, avoiding one near-identical fixture body per page object.
 *
 * @param pageConstructor - The page object class to instantiate (e.g. `HomePage`).
 * @returns A fixture function suitable for `test.extend()`.
 */
function createPageFixture<PageClass>(
  pageConstructor: PageConstructor<PageClass>,
) {
  return async (
    { page }: { page: Page },
    use: (value: PageClass) => Promise<void>,
  ) => {
    await use(new pageConstructor(page));
  };
}

/** An auto-running ad-blocker route interceptor, plus one fixture per page object class. */
interface PageFixtures {
  adblocker: void;
  homePage: HomePage;
  signupLoginPage: SignupLoginPage;
  signupPage: SignupPage;
  accountCreatedDeletedPage: AccountCreatedDeletedPage;
  contactUsPage: ContactUsPage;
  testCasesPage: TestCasesPage;
  apiTestingPage: ApiTestingPage;
  productsPage: ProductsPage;
  productPage: ProductPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  paymentPage: PaymentPage;
  categoryPage: CategoryPage;
  brandPage: BrandPage;
}

/**
 * Extends the base Playwright `test` with one fixture per page object class, plus an
 * auto-running `adblocker` fixture that aborts Google Ads requests for every test.
 */
export const test = base.extend<PageFixtures>({
  adblocker: [
    async ({ page }, use) => {
      await page.route("**/*", async (route) => {
        if (route.request().url().startsWith("https://googleads.")) {
          await route.abort();
        } else {
          await route.continue();
        }
      });
      await use();
    },
    { auto: true },
  ],
  homePage: createPageFixture(HomePage),
  signupLoginPage: createPageFixture(SignupLoginPage),
  signupPage: createPageFixture(SignupPage),
  accountCreatedDeletedPage: createPageFixture(AccountCreatedDeletedPage),
  contactUsPage: createPageFixture(ContactUsPage),
  testCasesPage: createPageFixture(TestCasesPage),
  apiTestingPage: createPageFixture(ApiTestingPage),
  productsPage: createPageFixture(ProductsPage),
  productPage: createPageFixture(ProductPage),
  cartPage: createPageFixture(CartPage),
  checkoutPage: createPageFixture(CheckoutPage),
  paymentPage: createPageFixture(PaymentPage),
  categoryPage: createPageFixture(CategoryPage),
  brandPage: createPageFixture(BrandPage),
});
