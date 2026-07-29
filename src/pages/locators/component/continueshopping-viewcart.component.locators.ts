import { Locator, Page } from "@playwright/test";

/** Raw `Locator` definitions for the "Continue Shopping" / "View Cart" pair of buttons shown after adding a product to the cart, used by `ContinueShoppingViewCartComponent`. */
export class ContinueShoppingViewCartComponentLocators {
  readonly continueShoppingButton: Locator;
  readonly viewCartLink: Locator;

  constructor(page: Page) {
    this.continueShoppingButton = page.getByRole("button", {
      name: "Continue Shopping",
    });
    this.viewCartLink = page
      .locator(".modal-body")
      .getByRole("link", { name: "View Cart" });
  }
}
