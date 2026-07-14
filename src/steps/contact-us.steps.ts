import { ContactUsType } from '@data/model/contact-us.model';
import { test } from '@fixtures/fixtures';
import { ContactUsPage } from '@pages/contact-us.page';
import { expect } from '@playwright/test';
import { TestAutomationLogger } from '@utils/logger.utils';
import { StringUtils } from '@utils/string.utils';

export class ContactUsSteps {

    readonly logger: TestAutomationLogger;
    readonly contactUsPage: ContactUsPage;

    constructor(logger: TestAutomationLogger, contactUsPage: ContactUsPage) {
        this.logger = logger;
        this.contactUsPage = contactUsPage;
    }

    // Actions
    async enterContactFormData(formData: ContactUsType): Promise<void> {
        this.logger.debug(`Using Contact Us data: ${StringUtils.prettyJson(formData)}`)
        await test.step('Enter Contact Us data', async () => {
            await this.contactUsPage.enterName(formData.name);
            await this.contactUsPage.enterEmail(formData.email);
            await this.contactUsPage.enterSubject(formData.subject);
            await this.contactUsPage.enterMessage(formData.message);
            await this.contactUsPage.selectUploadFile(formData.file);
            await this.contactUsPage.page.waitForLoadState('domcontentloaded');
        });
    }

    async clickSubmit(options?: { accept: boolean }): Promise<void> {
        this.logger.debug(`Clicking Submit button, will ${options?.accept ? 'click Ok in' : 'dismiss'} confirmation dialog`);
        await test.step(`Clicking Submit button and ${options?.accept ? 'confirming' : 'dismissing'} confirmation dialog'`, async () => {
            await this.contactUsPage.clickSubmit(options?.accept);
        });
        this.logger.debug(`Clicked Submit button, and ${options?.accept ? 'clicked Ok in' : 'dismissed'} confirmation dialog`);
    }

    async clickHome(): Promise<void> {
        this.logger.debug('Clicking Home button');
        await test.step('Clicking Home button in Contact Us page', async () => {
            await this.contactUsPage.clickHome();
        });
        this.logger.debug('Clicked Home button');
    }

    // Validations
    async validateGetInTouchText(): Promise<void> {
        this.logger.debug('Validating Contact Us form heading text.');
        await test.step('Validate that Contact Us form have the expected text', async () => {
            await expect.soft(
                this.contactUsPage.locators.getInTouchText,
                `Contact Us form 'Get In Touch' text should be visible`
            ).toBeVisible();
        });
    }

    async validateSubmitSuccessMessage(): Promise<void> {
        this.logger.debug('Validating Contact Us form submit success message.');
        await test.step('Validate that Contact Us form displays the submit success message', async () => {
            await expect.soft(
                this.contactUsPage.locators.submitSuccessMessage,
                'Contact Us form submit success message should be visible'
            ).toBeVisible();
        });
    }

}