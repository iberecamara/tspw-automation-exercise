import { UPLOAD_FILEPATH } from "@data/constants/constants";
import { BasePage } from "@pages.base/base.page";
import { ContactUsLocators } from "@pages.base/locators/page/contact-us.locators";
import { Page } from "@playwright/test";
import path from "path";

/** The site's "Contact Us" form page. */
export class ContactUsPage extends BasePage {
  readonly locators: ContactUsLocators;

  constructor(page: Page) {
    super(page);
    this.locators = new ContactUsLocators(page);
  }

  /** Fills the "Name" field. */
  async enterName(name: string): Promise<void> {
    await this.fill(this.locators.nameInput, name);
  }

  /** Fills the "Email" field. */
  async enterEmail(email: string): Promise<void> {
    await this.fill(this.locators.emailInput, email);
  }

  /** Fills the "Subject" field. */
  async enterSubject(subject: string): Promise<void> {
    await this.fill(this.locators.subjectInput, subject);
  }

  /** Fills the "Message" field. */
  async enterMessage(message: string): Promise<void> {
    await this.fill(this.locators.messageInput, message);
  }

  /**
   * Attaches a file via the native file chooser dialog.
   *
   * @param file - Filename to attach, resolved relative to {@link UPLOAD_FILEPATH}
   * (`src/files/upload/`).
   */
  async selectUploadFile(file: string): Promise<void> {
    const fileChooserPromise = this.page.waitForEvent("filechooser");
    await this.click(this.locators.upoadFileInput);
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(path.join(UPLOAD_FILEPATH, file));
  }

  /**
   * Clicks the "Submit" button.
   *
   * @param accept - If `true`, registers a one-time handler to accept the browser's native
   * confirmation dialog that appears on submit, before clicking.
   */
  async clickSubmit(accept?: boolean): Promise<void> {
    if (accept) {
      this.page.on("dialog", async (dialog) => dialog.accept());
    }
    await this.click(this.locators.submitButton);
  }
}
