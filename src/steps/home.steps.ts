import { Environment } from '@configs/environment.config';
import { test } from '@fixtures/fixtures';
import { HomePage } from '@pages/home.page';
import { expect, Page } from '@playwright/test';
import { TestAutomationLogger } from '@utils/logger.utils';

export class HomeSteps {

    // Actions
    async viewProduct(logger: TestAutomationLogger, homePage: HomePage, productIndex: number): Promise<void> {
        logger.debug('Clicking "View Product" in home page');
        await test.step('Click "View Product" in home page', async () => {
            await homePage.clickProductView(productIndex);
        });
        logger.debug('Clicked "View Product" in home page');
    }

    async viewCart(logger: TestAutomationLogger, homePage: HomePage, productIndex: number): Promise<void> {
        logger.debug('Clicking "View Product" in home page');
        await test.step('Click "View Product" in home page', async () => {
            await homePage.clickProductView(productIndex);
        });
        logger.debug('Clicked "View Product" in home page');
    }

    // Validations
    async validateHomeTitle(logger: TestAutomationLogger, page: Page): Promise<void> {
        logger.debug('Validating that application home page have the expected title');
        await test.step('Validate that application home page have the expected title', async () => {
            await expect.soft(
                page,
                `Home page should have the expected title: ${Environment.APPLICATION}`
            ).toHaveTitle(Environment.APPLICATION);
        });
    };

}