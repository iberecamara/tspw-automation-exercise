import { NEWLINE } from '@data/constants/string.constants';
import { ContactUsType } from '@data/model/contact-us.model';
import { test } from '@fixtures/fixtures';
import { ContactUsPage } from '@pages/contact-us.page';
import { expect } from '@playwright/test';
import { TestAutomationLogger } from '@utils/logger.utils';
import { StringUtils } from '@utils/string.utils';

export class ContactUsSteps {

    // Actions
    async enterContactFormData(logger: TestAutomationLogger, contactUsPage: ContactUsPage, formData: ContactUsType): Promise<void> {
        logger.debug(`Using Contact Us data: ${NEWLINE}${StringUtils.prettyJson(formData)}`)
        await test.step('Enter Contact Us data', async () => {
            await contactUsPage.enterName(formData.name);
            await contactUsPage.enterEmail(formData.email);
            await contactUsPage.enterSubject(formData.subject);
            await contactUsPage.enterMessage(formData.message);
            await contactUsPage.selectUploadFile(formData.file);
            await contactUsPage.page.waitForLoadState('domcontentloaded');
        });
    }

    async clickSubmit(logger: TestAutomationLogger, contactUsPage: ContactUsPage, options?: { accept: boolean }): Promise<void> {
        logger.debug(`Clicking Submit button, will ${options?.accept ? 'click Ok in' : 'dismiss'} confirmation dialog`);
        await test.step(`Clicking Submit button and ${options?.accept ? 'confirming' : 'dismissing'} confirmation dialog'`, async () => {
            await contactUsPage.clickSubmit(options?.accept);
        });
        logger.debug(`Clicked Submit button, and ${options?.accept ? 'clicked Ok in' : 'dismissed'} confirmation dialog`);
    }

    async clickHome(logger: TestAutomationLogger, contactUsPage: ContactUsPage): Promise<void> {
        logger.debug('Clicking Home button');
        await test.step('Clicking Home button in Contact Us page', async () => {
            await contactUsPage.clickHome();
        });
        logger.debug('Clicked Home button');
    }

    // Validations
    async validateGetInTouchText(logger: TestAutomationLogger, contactUsPage: ContactUsPage): Promise<void> {
        logger.debug('Validating Contact Us form heading text.');
        await test.step('Validate that Contact Us form have the expected text', async () => {
            await expect.soft(
                contactUsPage.locators.getInTouchText,
                `Contact Us form 'Get In Touch' text should be visible`
            ).toBeVisible();
        });
    }

    async validateSubmitSuccessMessage(logger: TestAutomationLogger, contactUsPage: ContactUsPage): Promise<void> {
        logger.debug('Validating Contact Us form submit success message.');
        await test.step('Validate that Contact Us form displays the submit success message', async () => {
            await expect.soft(
                contactUsPage.locators.submitSuccessMessage,
                'Contact Us form submit success message should be visible'
            ).toBeVisible();
        });
    }

}