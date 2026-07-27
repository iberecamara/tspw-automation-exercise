import { Locator, Page } from "@playwright/test";

export class ContactUsLocators {
  readonly getInTouchText: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly subjectInput: Locator;
  readonly messageInput: Locator;
  readonly upoadFileInput: Locator;
  readonly submitButton: Locator;
  readonly submitSuccessMessage: Locator;
  readonly homeButton: Locator;

  constructor(page: Page) {
    this.getInTouchText = page.getByText("Get In Touch");
    this.nameInput = page.getByTestId("name");
    this.emailInput = page.getByTestId("email");
    this.subjectInput = page.getByTestId("subject");
    this.messageInput = page.getByTestId("message");
    this.upoadFileInput = page.getByRole("button", { name: "Choose File" });
    this.submitButton = page.getByTestId("submit-button");
    this.submitSuccessMessage = page
      .locator("#contact-page")
      .getByText("Success! Your details have");
    this.homeButton = page.getByRole("link", { name: " Home" });
  }
}
