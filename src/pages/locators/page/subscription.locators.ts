import { Locator, Page } from "@playwright/test";

/** Raw `Locator` definitions for the newsletter subscription box, used by `SubscriptionComponent`. Filed under `locators/page/` rather than `locators/component/` despite backing a shared component — an existing organizational inconsistency, not a deliberate distinction. */
export class SubscriptionLocators {
  readonly subscriptionHeading: Locator;
  readonly subscriptionEmailInput: Locator;
  readonly subscriptionEmailButton: Locator;
  readonly subscriptionMessage: Locator;

  constructor(page: Page) {
    this.subscriptionHeading = page.getByRole("heading", {
      name: "Subscription",
    });
    this.subscriptionEmailInput = page.getByRole("textbox", {
      name: "Your email address",
    });
    this.subscriptionEmailButton = page.locator("#subscribe");
    this.subscriptionMessage = page.getByText(
      "You have been successfully subscribed!",
    );
  }
}
