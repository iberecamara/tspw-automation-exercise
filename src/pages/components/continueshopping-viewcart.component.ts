import { ContinueShoppingViewCartComponentLocators } from "@locators/component/continueshopping-viewcart.component.locators";
import { BasePage } from "@pages.base/base.page";
import { expect, Page } from "@playwright/test";

/** The "Continue Shopping" / "View Cart" pair of buttons shown in the modal after adding a product to the cart. */
export class ContinueShoppingViewCartComponent extends BasePage {
  readonly locators: ContinueShoppingViewCartComponentLocators;

  constructor(page: Page) {
    super(page);
    this.locators = new ContinueShoppingViewCartComponentLocators(page);
  }

  /** Waits for and clicks the "Continue Shopping" button, dismissing the modal. */
  async clickContinueShopping(): Promise<void> {
    await expect(this.locators.continueShoppingButton).toBeVisible();
    await this.click(this.locators.continueShoppingButton);
  }

  /** Waits for and clicks the "View Cart" link, navigating to the cart page. */
  async clickViewCart(): Promise<void> {
    await expect(this.locators.viewCartLink).toBeVisible();
    await this.click(this.locators.viewCartLink);
  }
}
