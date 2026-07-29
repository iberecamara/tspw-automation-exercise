import { BasePage } from "@pages.base/base.page";
import { AccountCreatedDeletedLocators } from "@pages.base/locators/page/account-created-deleted.locators";
import { Page } from "@playwright/test";

/** The confirmation page shown after successfully creating or deleting an account. */
export class AccountCreatedDeletedPage extends BasePage {
  readonly locators: AccountCreatedDeletedLocators;

  constructor(page: Page) {
    super(page);
    this.locators = new AccountCreatedDeletedLocators(page);
  }

  /** Clicks the "Continue" button, returning to the home page. */
  async clickContinue(): Promise<void> {
    await this.click(this.locators.continueButton);
  }
}
