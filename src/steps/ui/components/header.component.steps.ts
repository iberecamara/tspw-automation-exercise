import { HeaderComponent } from "@components/header.component";
import { UserType } from "@data/model/user.model";
import { expect } from "@playwright/test";
import { BaseSteps } from "@steps/base.steps";
import { Page } from "playwright";

/**
 * Readable, logged steps driving {@link HeaderComponent}. Unlike the page-driving `*.steps.ts`
 * classes, this class doesn't own a single component instance — every method takes the
 * `HeaderComponent` to act on as a parameter, since the header is composed into many different
 * page objects.
 */
export class HeaderComponentSteps extends BaseSteps {
  readonly page: Page;
  readonly header: HeaderComponent;

  constructor(page: Page) {
    super();
    this.page = page;
    this.header = new HeaderComponent(page);
  }

  // Actions

  /** Clicks "Home". */
  async clickHome(): Promise<void> {
    await this.step("Click 'Home' button in header", async () => {
      await this.header.clickHome();
    });
  }

  /** Clicks "Signup / Login". */
  async clickSignupLogin(): Promise<void> {
    await this.step("Click 'Signup / Login' button in header", async () => {
      await this.header.clickSignupLogin();
    });
  }

  /** Clicks "Delete Account". */
  async clickDeleteAccount(): Promise<void> {
    await this.step("Click 'Delete Account' in header", async () => {
      await this.header.clickDeleteAccount();
    });
  }

  /** Clicks "Logout". */
  async clickLogout(): Promise<void> {
    await this.step("Click 'Logout' in header", async () => {
      await this.header.clickLogout();
    });
  }

  /** Clicks "Contact us". */
  async clickContactUs(): Promise<void> {
    await this.step("Click 'Contact us' in header", async () => {
      await this.header.clickContactUs();
    });
  }

  /** Clicks "Test Cases". */
  async clickTestCases(): Promise<void> {
    await this.step("Click 'Test Cases' in header", async () => {
      await this.header.clickTestCases();
    });
  }

  /** Clicks "API Testing". */
  async clickApiTesting(): Promise<void> {
    await this.step("Click 'API Testing' in header", async () => {
      await this.header.clickApiTesting();
    });
  }

  /** Clicks "Products". */
  async clickProducts(): Promise<void> {
    await this.step("Click 'Products' in header", async () => {
      await this.header.clickProducts();
    });
  }

  /** Clicks "Cart". */
  async clickCart(): Promise<void> {
    await this.step("Click 'Cart' in header", async () => {
      await this.header.clickCart();
    });
  }

  // Validations

  /** Validates the "Logged in as <name>" text is displayed with the expected user's name. */
  async validateUserLoggedText(user: UserType): Promise<void> {
    await this.step(
      `Validate that 'Logged in as ${user.name}' text is displayed`,
      async () => {
        await expect
          .soft(
            this.header.locators.loggedInText(user.name),
            `Logged in text should be visible`,
          )
          .toBeVisible();
        const loggedInText = `Logged in as ${user.name}`;
        await expect
          .soft(
            this.header.locators.loggedInText(user.name),
            `Logged in text text should be '${loggedInText}'`,
          )
          .toHaveText(loggedInText);
      },
    );
  }
}
