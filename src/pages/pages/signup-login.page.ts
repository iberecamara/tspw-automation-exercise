import { SignupLoginLocators } from "@locators/page/signup-login.locators";
import { BasePage } from "@pages.base/base.page";
import { Page } from "@playwright/test";

export class SignupLoginPage extends BasePage {
  readonly locators: SignupLoginLocators;

  constructor(page: Page) {
    super(page);
    this.locators = new SignupLoginLocators(page);
  }

  async enterLoginEmail(email: string): Promise<void> {
    await this.fill(this.locators.loginEmailInput, email);
  }

  async enterLoginPassword(password: string): Promise<void> {
    await this.fill(this.locators.loginPasswordInput, password);
  }

  async clickLogin(): Promise<void> {
    await this.click(this.locators.loginButton);
  }

  async enterSignupLogin(login: string): Promise<void> {
    await this.fill(this.locators.signupLoginInput, login);
  }

  async enterSignupEmail(email: string): Promise<void> {
    await this.fill(this.locators.signupEmailInput, email);
  }

  async clickSignup(): Promise<void> {
    await this.click(this.locators.signupButton);
  }
}
