import { ContactUsType } from "@data/model/contact-us.model";
import { ContactUsPage } from "@pages/contact-us.page";
import { expect } from "@playwright/test";
import { BaseSteps } from "@steps/ui/common/base.steps";
import { prettyJson } from "@utils/string.utils";

export class ContactUsSteps extends BaseSteps {
  readonly contactUsPage: ContactUsPage;

  constructor(contactUsPage: ContactUsPage) {
    super();
    this.contactUsPage = contactUsPage;
  }

  // Actions
  async enterContactFormData(formData: ContactUsType): Promise<void> {
    this.logger.verbose(`Using Contact Us data: ${prettyJson(formData)}`);
    await this.step("Enter Contact Us data", async () => {
      await this.contactUsPage.enterName(formData.name);
      await this.contactUsPage.enterEmail(formData.email);
      await this.contactUsPage.enterSubject(formData.subject);
      await this.contactUsPage.enterMessage(formData.message);
      await this.contactUsPage.selectUploadFile(formData.file);
      await this.contactUsPage.page.waitForLoadState("domcontentloaded");
    });
  }

  async clickSubmit(options?: { accept: boolean }): Promise<void> {
    await this.step(
      `Clicking Submit button and ${options?.accept ? "confirming" : "dismissing"} confirmation dialog`,
      async () => {
        await this.contactUsPage.clickSubmit(options?.accept);
      },
    );
  }

  // Validations
  async validateGetInTouchText(): Promise<void> {
    await this.step(
      "Validate that Contact Us form have the expected text",
      async () => {
        await expect
          .soft(
            this.contactUsPage.locators.getInTouchText,
            `Contact Us form heading should be visible`,
          )
          .toBeVisible();
        const headingText = "Get In Touch";
        await expect
          .soft(
            this.contactUsPage.locators.getInTouchText,
            `Contact Us form heading should have text '${headingText}'`,
          )
          .toHaveText(headingText);
      },
    );
  }

  async validateSubmitSuccessMessage(): Promise<void> {
    await this.step(
      "Validate that Contact Us form displays the submit success message",
      async () => {
        await expect
          .soft(
            this.contactUsPage.locators.submitSuccessMessage,
            "Contact Us form submit success message should be visible",
          )
          .toBeVisible();
        const message =
          "Success! Your details have been submitted successfully.";
        await expect
          .soft(
            this.contactUsPage.locators.submitSuccessMessage,
            `Contact Us form submit success message should have the success message '${message}'`,
          )
          .toHaveText(message);
      },
    );
  }
}
