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

  constructor(page: Page) {
    super();
    this.page = page;
  }

  // Actions

  /** Clicks "Home". */
  async clickHome(header: HeaderComponent): Promise<void> {
    await this.step("Click 'Home' button in header", async () => {
      await header.clickHome();
    });
  }

  /** Clicks "Signup / Login". */
  async clickSignupLogin(header: HeaderComponent): Promise<void> {
    await this.step("Click 'Signup / Login' button in header", async () => {
      await header.clickSignupLogin();
    });
  }

  /** Clicks "Delete Account". */
  async clickDeleteAccount(header: HeaderComponent): Promise<void> {
    await this.step("Click 'Delete Account' in header", async () => {
      await header.clickDeleteAccount();
    });
  }

  /** Clicks "Logout". */
  async clickLogout(header: HeaderComponent): Promise<void> {
    await this.step("Click 'Logout' in header", async () => {
      await header.clickLogout();
    });
  }

  /** Clicks "Contact us". */
  async clickContactUs(header: HeaderComponent): Promise<void> {
    await this.step("Click 'Contact us' in header", async () => {
      await header.clickContactUs();
    });
  }

  /** Clicks "Test Cases". */
  async clickTestCases(header: HeaderComponent): Promise<void> {
    await this.step("Click 'Test Cases' in header", async () => {
      await header.clickTestCases();
    });
  }

  /** Clicks "Products". */
  async clickProducts(header: HeaderComponent): Promise<void> {
    await this.step("Click 'Products' in header", async () => {
      await header.clickProducts();
    });
  }

  /** Clicks "Cart". */
  async clickCart(header: HeaderComponent): Promise<void> {
    await this.step("Click 'Cart' in header", async () => {
      await header.clickCart();
    });
  }

  // Validations

  /** Validates the "Logged in as <name>" text is displayed with the expected user's name. */
  async validateUserLoggedText(
    header: HeaderComponent,
    user: UserType,
  ): Promise<void> {
    await this.step(
      `Validate that 'Logged in as ${user.name}' text is displayed`,
      async () => {
        await expect
          .soft(
            header.locators.loggedInText(user.name),
            `Logged in text should be visible`,
          )
          .toBeVisible();
        const loggedInText = `Logged in as ${user.name}`;
        await expect
          .soft(
            header.locators.loggedInText(user.name),
            `Logged in text text should be '${loggedInText}'`,
          )
          .toHaveText(loggedInText);
      },
    );
  }
}
