import { test } from '@fixtures/fixtures';
import { expect, Page } from '@playwright/test';
import { TestAutomationLogger } from '@utils/logger.utils';

export class TestCasesSteps {

    // Validations
    async validateTestCasesTitle(logger: TestAutomationLogger, page: Page): Promise<void> {
        logger.debug('Validating Test Cases page title.');
        await test.step('Validate that Test Cases page have the expected title', async () => {
            await expect.soft(
                page,
                'Test Cases page should have the expected title'
            ).toHaveTitle('Automation Practice Website for UI Testing - Test Cases');
        });
    }


}