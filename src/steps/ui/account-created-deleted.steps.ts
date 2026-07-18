import {
  CREATED,
  SECOND_IN_MILISSECONDS,
} from "@data/constants/common.constants";
import { test } from "@fixtures/fixtures";
import { AccountCreatedDeletedPage } from "@pages/account-created-deleted.page";
import { expect, Locator } from "@playwright/test";
import { BaseSteps } from "@steps/base.steps";
import { StringUtils } from "@utils/string.utils";

export class AccountCreatedDeletedSteps extends BaseSteps {
  readonly accountCreatedDeletedPage: AccountCreatedDeletedPage;

  constructor(accountCreatedDeletedPage: AccountCreatedDeletedPage) {
    super();
    this.accountCreatedDeletedPage = accountCreatedDeletedPage;
  }

  // Actions
  async clickContinue(page: string): Promise<void> {
    this.logger.debug(`Clicking Continue in Account ${page} page`);

    await test.step(`Click Continue in Account ${page} page`, async () => {
      await this.accountCreatedDeletedPage.clickContinue();
      await this.accountCreatedDeletedPage.page.waitForLoadState("load", {
        timeout: 15 * SECOND_IN_MILISSECONDS,
      });
    });

    this.logger.debug(`Clicked Continue in Account ${page} page`);
  }

  // Validations
  async validateAccountActionText(action: string): Promise<void> {
    this.logger.debug(
      `Validating that 'Account ${StringUtils.capitalize(action)}!' text is displayed`,
    );
    const locator: Locator =
      action === CREATED
        ? this.accountCreatedDeletedPage.locators.accountCreatedText
        : this.accountCreatedDeletedPage.locators.accountDeletedText;

    await test.step(`Validate that 'Account ${StringUtils.capitalize(action)}!' text is displayed`, async () => {
      await expect
        .soft(
          locator,
          `'Account ${StringUtils.capitalize(action)}!' text should be visible`,
        )
        .toBeVisible();
    });
  }
}
