import { HeaderComponentLocators } from "@locators/component/header.component.locators";
import { BasePage } from "@pages.base/base.page";
import { Page } from "@playwright/test";

/** The site-wide header/navbar, present on every page (Home, Products, Cart, Signup/Login, Test Cases, Contact Us links, plus the logged-in-user/logout/delete-account links). */
export class HeaderComponent extends BasePage {
  readonly locators: HeaderComponentLocators;

  constructor(page: Page) {
    super(page);
    this.locators = new HeaderComponentLocators(page);
  }

  /** Clicks the "Home" link. */
  async clickHome(): Promise<void> {
    await this.click(this.locators.homeButton);
  }

  /** Clicks the "Signup / Login" link. */
  async clickSignupLogin(): Promise<void> {
    await this.click(this.locators.signupLoginButton);
  }

  /** Clicks the "Delete Account" link. */
  async clickDeleteAccount(): Promise<void> {
    await this.click(this.locators.deleteAccountLink);
  }

  /** Clicks the "Logout" link. */
  async clickLogout(): Promise<void> {
    await this.click(this.locators.logoutLink);
  }

  /** Clicks the "Contact Us" link. */
  async clickContactUs(): Promise<void> {
    await this.click(this.locators.contactUsLink);
  }

  /** Clicks the "Test Cases" link. */
  async clickTestCases(): Promise<void> {
    await this.click(this.locators.testCasesLink);
  }

  /** Clicks the "Products" link. */
  async clickProducts(): Promise<void> {
    await this.click(this.locators.productsLink);
  }

  /** Clicks the "Cart" link. */
  async clickCart(): Promise<void> {
    await this.click(this.locators.cartLink);
  }
}
