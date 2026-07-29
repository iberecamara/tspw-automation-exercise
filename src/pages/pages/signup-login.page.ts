import { BasePage } from "@pages.base/base.page";
import { SignupLoginLocators } from "@pages.base/locators/page/signup-login.locators";
import { Page } from "@playwright/test";

/** The combined signup/login page — a "New User Signup!" section (name + email) alongside a "Login to your account" section (email + password). */
export class SignupLoginPage extends BasePage {
  readonly locators: SignupLoginLocators;

  constructor(page: Page) {
    super(page);
    this.locators = new SignupLoginLocators(page);
  }

  /** Fills the login section's email field. */
  async enterLoginEmail(email: string): Promise<void> {
    await this.fill(this.locators.loginEmailInput, email);
  }

  /** Fills the login section's password field. */
  async enterLoginPassword(password: string): Promise<void> {
    await this.fill(this.locators.loginPasswordInput, password);
  }

  /** Clicks "Login". */
  async clickLogin(): Promise<void> {
    await this.click(this.locators.loginButton);
  }

  /** Fills the signup section's name field (despite its name, `signupLoginInput` targets the `signup-name` test id, not a login field). */
  async enterSignupLogin(login: string): Promise<void> {
    await this.fill(this.locators.signupLoginInput, login);
  }

  /** Fills the signup section's email field. */
  async enterSignupEmail(email: string): Promise<void> {
    await this.fill(this.locators.signupEmailInput, email);
  }

  /** Clicks "Signup", proceeding to the account details form ({@link SignupPage}). */
  async clickSignup(): Promise<void> {
    await this.click(this.locators.signupButton);
  }
}
