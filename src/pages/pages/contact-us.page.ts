import { UPLOAD_FILEPATH } from '@data/constants/constants';
import { ContactUsLocators } from '@locators/page/contact-us.locators';
import { BasePage } from '@pages.base/base.page';
import { Page } from '@playwright/test';
import path from 'path';

export class ContactUsPage extends BasePage {

    readonly locators: ContactUsLocators;

    constructor(page: Page) {
        super(page);
        this.locators = new ContactUsLocators(page);
    }

    async enterName(name: string): Promise<void> {
        await this.fill(this.locators.nameInput, name);
    }

    async enterEmail(email: string): Promise<void> {
        await this.fill(this.locators.emailInput, email);
    }

    async enterSubject(subject: string): Promise<void> {
        await this.fill(this.locators.subjectInput, subject);
    }

    async enterMessage(message: string): Promise<void> {
        await this.fill(this.locators.messageInput, message);
    }

    async selectUploadFile(file: string): Promise<void> {
        const fileChooserPromise = this.page.waitForEvent('filechooser');
        await this.click(this.locators.upoadFileInput);
        const fileChooser = await fileChooserPromise;
        await fileChooser.setFiles(path.join(UPLOAD_FILEPATH, file));
    }

    async clickSubmit(accept?: boolean): Promise<void> {
        if (accept) {
            this.page.on('dialog', async dialog => dialog.accept());
        }
        await this.click(this.locators.submitButton);
    }

    async clickHome(): Promise<void> {
        await this.click(this.locators.homeButton);
    }

}