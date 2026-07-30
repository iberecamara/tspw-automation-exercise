import { FooterComponentLocators } from "@locators/component/footer.locators";
import { Page } from "@playwright/test";

/** The common footer component. */
export class FooterComponent {
  readonly locators: FooterComponentLocators;

  constructor(page: Page) {
    this.locators = new FooterComponentLocators(page);
  }

  /** Fills the subscription email input. */
  async enterSubscriptionEmail(email: string): Promise<void> {
    await this.locators.subscriptionEmailInput.fill(email);
  }

  /** Clicks the subscribe button. */
  async clickSubscribe(): Promise<void> {
    await this.locators.subscriptionEmailButton.click();
  }
}
