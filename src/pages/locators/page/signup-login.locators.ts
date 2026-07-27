import { Locator, Page } from "@playwright/test";

export class SignupLoginLocators {
  readonly loginSectionHeader: Locator;
  readonly loginEmailInput: Locator;
  readonly loginPasswordInput: Locator;
  readonly loginButton: Locator;

  readonly signupSectionHeader: Locator;
  readonly signupLoginInput: Locator;
  readonly signupEmailInput: Locator;
  readonly signupButton: Locator;

  readonly invalidCredentialsMessage: Locator;
  readonly emailreadyExistsMessage: Locator;

  constructor(page: Page) {
    this.loginSectionHeader = page.getByText("Login to your account");
    this.loginEmailInput = page.getByTestId("login-email");
    this.loginPasswordInput = page.getByTestId("login-password");
    this.loginButton = page.getByTestId("login-button");

    this.signupSectionHeader = page.getByText("New User Signup!");
    this.signupLoginInput = page.getByTestId("signup-name");
    this.signupEmailInput = page.getByTestId("signup-email");
    this.signupButton = page.getByTestId("signup-button");

    this.invalidCredentialsMessage = page.getByText(
      "Your email or password is incorrect!",
    );
    this.emailreadyExistsMessage = page.getByText(
      "Email Address already exist!",
    );
  }
}
