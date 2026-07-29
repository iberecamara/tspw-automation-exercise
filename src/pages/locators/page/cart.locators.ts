import { Locator, Page } from "@playwright/test";

/** Raw `Locator` definitions for the shopping cart page. */
export class CartLocators {
  readonly proceedToCheckoutButton: Locator;
  readonly registerFromCheckoutLink: Locator;

  constructor(page: Page) {
    this.proceedToCheckoutButton = page.getByText("Proceed To Checkout");
    this.registerFromCheckoutLink = page.getByRole("link", {
      name: "Register / Login",
    });
  }
}
