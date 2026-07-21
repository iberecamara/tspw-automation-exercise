import { EMPTY } from "@data/constants/string.constants";
import { UserType } from "@data/model/user.model";
import { test } from "@fixtures/fixtures";
import { SignupLoginPage } from "@pages/signup-login.page";
import { expect } from "@playwright/test";
import { BaseSteps } from "@steps/base.steps";

export class SignupLoginSteps extends BaseSteps {
  readonly signupLoginPage: SignupLoginPage;

  constructor(signupLoginPage: SignupLoginPage) {
    super();
    this.signupLoginPage = signupLoginPage;
  }

  // Actions
  async login(user: UserType): Promise<void> {
    this.logger.verbose("Entering login data.");
    this.logger.verbose(`Using email: ${user.email}`);
    this.logger.verbose(`Using password: ${user.password}`);

    await test.step("Enter login data", async () => {
      await this.signupLoginPage.enterLoginEmail(user.email);
      await this.signupLoginPage.enterLoginPassword(user.password ?? EMPTY);
      await this.signupLoginPage.clickLogin();
    });

    this.logger.verbose("Entered login data.");
  }

  async enterSignupData(user: UserType): Promise<void> {
    this.logger.verbose("Entering Signup data:");
    this.logger.verbose(`Using login: ${user.name}`);
    this.logger.verbose(`Using email: ${user.email}`);

    await test.step("Enter signup data", async () => {
      await this.signupLoginPage.enterSignupLogin(user.name);
      await this.signupLoginPage.enterSignupEmail(user.email);
    });

    this.logger.verbose("Entered Signup data:");
  }

  async clickSignup(): Promise<void> {
    this.logger.verbose("Clicking Signup button.");

    await test.step("Click Signup", async () => {
      await this.signupLoginPage.clickSignup();
    });

    this.logger.verbose("Signup button clicked.");
  }

  // Validations
  async validateLoginToAccountText(): Promise<void> {
    this.logger.verbose("Validating Login section heading text.");

    await test.step("Validate that Signup / Login page have the expected text in the Login section", async () => {
      await expect
        .soft(
          this.signupLoginPage.locators.loginSectionHeader,
          `Login section header 'Login to your account' should be visible`,
        )
        .toBeVisible();
    });
  }

  async validateNewUserSignupText(): Promise<void> {
    this.logger.verbose("Validating Signup section heading text.");

    await test.step("Validate that Signup / Login page have the expected text in the Signup section", async () => {
      await expect
        .soft(
          this.signupLoginPage.locators.signupSectionHeader,
          `Signup section header 'New User Signup!' should be visible`,
        )
        .toBeVisible();
    });
  }

  async validateInvalidCredentialsMessage(): Promise<void> {
    this.logger.verbose(
      "Validating Login section invalid credentials error message.",
    );

    await test.step("Validate that Signup / Login page have the expected text for invalid credentials in the Login section", async () => {
      await expect
        .soft(
          this.signupLoginPage.locators.invalidCredentialsMessage,
          "Your email or password is incorrect!",
        )
        .toBeVisible();
    });
  }

  async validateEmailAlreadyExistsMessage(): Promise<void> {
    this.logger.verbose(
      "Validating Signup section email already exists error message.",
    );

    await test.step("Validate that Signup / Login page have the expected text for exisint email in the Signup section", async () => {
      await expect
        .soft(
          this.signupLoginPage.locators.emailreadyExistsMessage,
          "Email Address already exist!",
        )
        .toBeVisible();
    });
  }
}
