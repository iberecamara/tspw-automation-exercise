import { expect, Locator } from '@playwright/test';
import { test } from '@fixtures/fixtures';
import { TestAutomationLogger } from '@utils/logger.utils';
import { AccountCreatedDeletedPage } from '@pages/account-created-deleted.page';
import { StringUtils } from '@utils/string.utils';
import { CREATED, MINUTE_IN_MILISSECONDS } from '@data/constants/common.constants';
import { Environment } from '@configs/environment.config';

export class AccountCreatedDeletedSteps {

    // Actions
    async clickContinue(logger: TestAutomationLogger, accountCreatedDeletedPage: AccountCreatedDeletedPage, page: string): Promise<void> {
        logger.debug(`Clicking Continue in Account ${page} page`);
        await test.step(`Click Continue in Account ${page} page`, async () => {
            await accountCreatedDeletedPage.clickContinue();
            await accountCreatedDeletedPage.page.waitForLoadState('load', { timeout: 15 * MINUTE_IN_MILISSECONDS });
        });
        logger.debug(`Clicked Continue in Account ${page} page`);
    }

    // Validations
    async validateAccountActionText(logger: TestAutomationLogger, accountCreatedDeletedPage: AccountCreatedDeletedPage, action: string): Promise<void> {
        logger.debug(`Validating that "Account ${StringUtils.capitalize(action)}!" text is displayed`);
        const locator: Locator = action === CREATED ? accountCreatedDeletedPage.locators.accountCreatedText : accountCreatedDeletedPage.locators.accountDeletedText
        await test.step(`Validate that "Account ${StringUtils.capitalize(action)}!" text is displayed`, async () => {
            await expect.soft(
                locator,
                `"Account ${StringUtils.capitalize(action)}!" text should be visible`
            ).toBeVisible();
        });
    };


}