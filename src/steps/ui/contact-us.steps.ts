import { ContactUsType } from "@data/model/contact-us.model";
import { test } from "@fixtures/fixtures";
import { ContactUsPage } from "@pages/contact-us.page";
import { expect } from "@playwright/test";
import { BaseSteps } from "@steps/base.steps";
import { StringUtils } from "@utils/string.utils";

export class ContactUsSteps extends BaseSteps {
  readonly contactUsPage: ContactUsPage;

  constructor(contactUsPage: ContactUsPage) {
    super();
    this.contactUsPage = contactUsPage;
  }

  // Actions
  async enterContactFormData(formData: ContactUsType): Promise<void> {
    this.logger.verbose(
      `Using Contact Us data: ${StringUtils.prettyJson(formData)}`,
    );

    await test.step("Enter Contact Us data", async () => {
      await this.contactUsPage.enterName(formData.name);
      await this.contactUsPage.enterEmail(formData.email);
      await this.contactUsPage.enterSubject(formData.subject);
      await this.contactUsPage.enterMessage(formData.message);
      await this.contactUsPage.selectUploadFile(formData.file);
      await this.contactUsPage.page.waitForLoadState("domcontentloaded");
    });
  }

  async clickSubmit(options?: { accept: boolean }): Promise<void> {
    this.logger.verbose(
      `Clicking Submit button, will ${options?.accept ? "click Ok in" : "dismiss"} confirmation dialog`,
    );

    await test.step(`Clicking Submit button and ${options?.accept ? "confirming" : "dismissing"} confirmation dialog'`, async () => {
      await this.contactUsPage.clickSubmit(options?.accept);
    });

    this.logger.verbose(
      `Clicked Submit button, and ${options?.accept ? "clicked Ok in" : "dismissed"} confirmation dialog`,
    );
  }

  async clickHome(): Promise<void> {
    this.logger.verbose("Clicking Home button");

    await test.step("Clicking Home button in Contact Us page", async () => {
      await this.contactUsPage.clickHome();
    });

    this.logger.verbose("Clicked Home button");
  }

  // Validations
  async validateGetInTouchText(): Promise<void> {
    this.logger.verbose("Validating Contact Us form heading text.");

    await test.step("Validate that Contact Us form have the expected text", async () => {
      await expect
        .soft(
          this.contactUsPage.locators.getInTouchText,
          `Contact Us form 'Get In Touch' text should be visible`,
        )
        .toBeVisible();
    });
  }

  async validateSubmitSuccessMessage(): Promise<void> {
    this.logger.verbose("Validating Contact Us form submit success message.");

    await test.step("Validate that Contact Us form displays the submit success message", async () => {
      await expect
        .soft(
          this.contactUsPage.locators.submitSuccessMessage,
          "Contact Us form submit success message should be visible",
        )
        .toBeVisible();
    });
  }
}
