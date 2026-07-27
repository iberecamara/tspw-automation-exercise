import { EMPTY } from "@data/constants/string.constants";
import { UserType } from "@data/model/user.model";
import { SignupLoginPage } from "@pages/signup-login.page";
import { expect } from "@playwright/test";
import { BaseSteps } from "@steps/ui/common/base.steps";

export class SignupLoginSteps extends BaseSteps {
  readonly signupLoginPage: SignupLoginPage;

  constructor(signupLoginPage: SignupLoginPage) {
    super();
    this.signupLoginPage = signupLoginPage;
  }

  // Actions
  async login(user: UserType): Promise<void> {
    this.logger.verbose(
      `Entering Login data. Login: '${user.name}' | Email: '${user.email}'`,
    );
    await this.step("Enter login data", async () => {
      await this.signupLoginPage.enterLoginEmail(user.email);
      await this.signupLoginPage.enterLoginPassword(user.password ?? EMPTY);
      await this.signupLoginPage.clickLogin();
    });
  }

  async enterSignupData(user: UserType): Promise<void> {
    this.logger.verbose(
      `Entering Signup data. Login: '${user.name}' | Email: '${user.email}'`,
    );
    await this.step("Enter signup data", async () => {
      await this.signupLoginPage.enterSignupLogin(user.name);
      await this.signupLoginPage.enterSignupEmail(user.email);
    });
  }

  async clickSignup(): Promise<void> {
    await this.step("Click Signup", async () => {
      await this.signupLoginPage.clickSignup();
    });
  }

  // Validations
  async validateLoginToAccountText(): Promise<void> {
    await this.step(
      "Validate that Signup / Login page have the expected text in the Login section",
      async () => {
        const headingText = "Login to your account";
        await expect
          .soft(
            this.signupLoginPage.locators.loginSectionHeader,
            `Login section heading text should be visible`,
          )
          .toBeVisible();
        await expect
          .soft(
            this.signupLoginPage.locators.loginSectionHeader,
            `Login section heading text should be '${headingText}'`,
          )
          .toHaveText(headingText);
      },
    );
  }

  async validateNewUserSignupText(): Promise<void> {
    await this.step(
      "Validate that Signup / Login page have the expected text in the Signup section",
      async () => {
        const headingText = "New User Signup!";
        await expect
          .soft(
            this.signupLoginPage.locators.signupSectionHeader,
            `Signup section heading text should be visible`,
          )
          .toBeVisible();
        await expect
          .soft(
            this.signupLoginPage.locators.signupSectionHeader,
            `Signup section heading text should be '${headingText}'`,
          )
          .toHaveText(headingText);
      },
    );
  }

  async validateInvalidCredentialsMessage(): Promise<void> {
    await this.step(
      "Validate that Signup / Login page have the expected text for invalid credentials in the Login section",
      async () => {
        const expectedMessage = "Your email or password is incorrect!";
        await expect
          .soft(
            this.signupLoginPage.locators.invalidCredentialsMessage,
            `Login error message for invalid credentials should be displayed.`,
          )
          .toBeVisible();
        await expect
          .soft(
            this.signupLoginPage.locators.invalidCredentialsMessage,
            `Login error message for invalid credentials  should read: '${expectedMessage}'`,
          )
          .toHaveText(expectedMessage);
      },
    );
  }

  async validateEmailAlreadyExistsMessage(): Promise<void> {
    await this.step(
      "Validate that Signup / Login page have the expected text for existing email in the Signup section",
      async () => {
        const expectedMessage = "Email Address already exist!";
        await expect
          .soft(
            this.signupLoginPage.locators.emailreadyExistsMessage,
            `Login error message for duplicated email should be visible`,
          )
          .toBeVisible();
        await expect
          .soft(
            this.signupLoginPage.locators.emailreadyExistsMessage,
            `Login error message for duplicated email should read: '${expectedMessage}'`,
          )
          .toHaveText(expectedMessage);
      },
    );
  }
}
