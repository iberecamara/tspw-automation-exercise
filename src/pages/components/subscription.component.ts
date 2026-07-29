import { BasePage } from "@pages.base/base.page";
import { SubscriptionLocators } from "@pages.base/locators/page/subscription.locators";
import { Page } from "@playwright/test";

/** The newsletter subscription box, present near the bottom of most pages. */
export class SubscriptionComponent extends BasePage {
  readonly locators: SubscriptionLocators;

  constructor(page: Page) {
    super(page);
    this.locators = new SubscriptionLocators(page);
  }

  /** Fills the subscription email input. */
  async enterSubscriptionEmail(email: string): Promise<void> {
    await this.fill(this.locators.subscriptionEmailInput, email);
  }

  /** Clicks the subscribe button. */
  async clickSubscribe(): Promise<void> {
    await this.click(this.locators.subscriptionEmailButton);
  }
}
