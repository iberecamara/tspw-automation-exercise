import { SECOND_IN_MILISECONDS } from "@data/constants/constants";
import { AccountCreatedDeletedPage } from "@pages/account-created-deleted.page";
import { expect, Locator } from "@playwright/test";
import { BaseSteps } from "@steps/ui/common/base.steps";
import { capitalize } from "@utils/string.utils";

export class AccountCreatedDeletedSteps extends BaseSteps {
  readonly accountCreatedDeletedPage: AccountCreatedDeletedPage;

  constructor(accountCreatedDeletedPage: AccountCreatedDeletedPage) {
    super();
    this.accountCreatedDeletedPage = accountCreatedDeletedPage;
  }

  // Actions
  async clickContinue(page: string): Promise<void> {
    return await this.step(
      `Clicking Continue in Account ${page} page`,
      async () => {
        await this.accountCreatedDeletedPage.clickContinue();
        await this.accountCreatedDeletedPage.page.waitForLoadState("load", {
          timeout: 15 * SECOND_IN_MILISECONDS,
        });
      },
    );
  }

  // Validations
  async validateAccountActionText(
    action: "created" | "deleted",
  ): Promise<void> {
    await this.step(
      `Validating that 'Account ${capitalize(action)}!' text is displayed`,
      async () => {
        const locator: Locator =
          action === "created"
            ? this.accountCreatedDeletedPage.locators.accountCreatedText
            : this.accountCreatedDeletedPage.locators.accountDeletedText;
        await expect
          .soft(
            locator,
            `'Account ${capitalize(action)}!' text should be visible`,
          )
          .toBeVisible();
      },
    );
  }
}
