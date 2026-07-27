import { HeaderComponent } from "@components/header.component";
import { UserType } from "@data/model/user.model";
import { expect } from "@playwright/test";
import { BaseSteps } from "@steps/ui/common/base.steps";
import { Page } from "playwright";

export class HeaderComponentSteps extends BaseSteps {
  readonly page: Page;

  constructor(page: Page) {
    super();
    this.page = page;
  }

  // Actions
  async clickHome(header: HeaderComponent): Promise<void> {
    await this.step("Click 'Home' button in header", async () => {
      await header.clickHome();
    });
  }

  async clickSignupLogin(header: HeaderComponent): Promise<void> {
    await this.step("Click 'Signup / Login' button in header", async () => {
      await header.clickSignupLogin();
    });
  }

  async clickDeleteAccount(header: HeaderComponent): Promise<void> {
    await this.step("Click 'Delete Account' in header", async () => {
      await header.clickDeleteAccount();
    });
  }

  async clickLogout(header: HeaderComponent): Promise<void> {
    await this.step("Click 'Logout' in header", async () => {
      await header.clickLogout();
    });
  }

  async clickContactUs(header: HeaderComponent): Promise<void> {
    await this.step("Click 'Contact us' in header", async () => {
      await header.clickContactUs();
    });
  }

  async clickTestCases(header: HeaderComponent): Promise<void> {
    await this.step("Click 'Test Cases' in header", async () => {
      await header.clickTestCases();
    });
  }

  async clickProducts(header: HeaderComponent): Promise<void> {
    await this.step("Click 'Products' in header", async () => {
      await header.clickProducts();
    });
  }

  async clickCart(header: HeaderComponent): Promise<void> {
    await this.step("Click 'Cart' in header", async () => {
      await header.clickCart();
    });
  }

  // Validations
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
