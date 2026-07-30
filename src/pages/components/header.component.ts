import { HeaderComponentLocators } from "@locators/component/header.component.locators";
import { Page } from "@playwright/test";

/** The site-wide header/navbar, present on every page (Home, Products, Cart, Signup/Login, Test Cases, Contact Us links, plus the logged-in-user/logout/delete-account links). */
export class HeaderComponent {
  readonly locators: HeaderComponentLocators;

  constructor(page: Page) {
    this.locators = new HeaderComponentLocators(page);
  }

  /** Clicks the "Home" link. */
  async clickHome(): Promise<void> {
    await this.locators.homeButton.click();
  }

  /** Clicks the "Signup / Login" link. */
  async clickSignupLogin(): Promise<void> {
    await this.locators.signupLoginButton.click();
  }

  /** Clicks the "Delete Account" link. */
  async clickDeleteAccount(): Promise<void> {
    await this.locators.deleteAccountLink.click();
  }

  /** Clicks the "Logout" link. */
  async clickLogout(): Promise<void> {
    await this.locators.logoutLink.click();
  }

  /** Clicks the "Contact Us" link. */
  async clickContactUs(): Promise<void> {
    await this.locators.contactUsLink.click();
  }

  /** Clicks the "Test Cases" link. */
  async clickTestCases(): Promise<void> {
    await this.locators.testCasesLink.click();
  }

  /** Clicks the "API Testing" link. */
  async clickApiTesting(): Promise<void> {
    await this.locators.apiTestingLink.click();
  }

  /** Clicks the "Products" link. */
  async clickProducts(): Promise<void> {
    await this.locators.productsLink.click();
  }

  /** Clicks the "Cart" link. */
  async clickCart(): Promise<void> {
    await this.locators.cartLink.click();
  }
}
