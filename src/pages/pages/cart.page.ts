import { CartComponent } from "@components/cart.component";
import { HeaderComponent } from "@components/header.component";
import { SubscriptionComponent } from "@components/subscription.component";
import { BasePage } from "@pages.base/base.page";
import { CartLocators } from "@pages.base/locators/page/cart.locators";
import { Page } from "@playwright/test";

/** The standalone shopping cart page. Note: distinct from `CartComponent`, the reusable cart-items table this page composes but which also appears embedded on several other pages. */
export class CartPage extends BasePage {
  readonly locators: CartLocators;
  readonly header: HeaderComponent;
  readonly subscription: SubscriptionComponent;
  readonly cart: CartComponent;

  constructor(page: Page) {
    super(page);
    this.locators = new CartLocators(page);
    this.header = new HeaderComponent(page);
    this.subscription = new SubscriptionComponent(page);
    this.cart = new CartComponent(page);
  }

  /** Clicks "Proceed To Checkout". */
  async clickProceedToCheckoutButton(): Promise<void> {
    await this.click(this.locators.proceedToCheckoutButton);
  }

  /** Clicks "Register" in the "Proceed To Checkout" modal shown when not logged in. */
  async clickRegisterFromCheckoutLink(): Promise<void> {
    await this.click(this.locators.registerFromCheckoutLink);
  }
}
