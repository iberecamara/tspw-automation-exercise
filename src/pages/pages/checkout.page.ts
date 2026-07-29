import { CartComponent } from "@components/cart.component";
import { EMPTY } from "@data/constants/string.constants";
import { ResumedAddressType } from "@data/model/address.model";
import { BasePage } from "@pages.base/base.page";
import { CheckoutLocators } from "@pages.base/locators/page/checkout.locators";
import { Page } from "@playwright/test";

/** The checkout page — order review (delivery/billing address summaries, an optional order comment) reached from the cart before payment. */
export class CheckoutPage extends BasePage {
  readonly locators: CheckoutLocators;
  readonly cart: CartComponent;

  constructor(page: Page) {
    super(page);
    this.locators = new CheckoutLocators(page);
    this.cart = new CartComponent(page);
  }

  /**
   * Reads the delivery or billing address summary block.
   *
   * @param addressType - Which address summary to read.
   * @returns The address, as a single condensed block (see {@link ResumedAddressType}).
   */
  async getAddress(
    addressType: "delivery" | "billing",
  ): Promise<ResumedAddressType> {
    const name =
      (await this.locators.addressName(addressType).textContent()) ?? EMPTY;
    const addressOne =
      (await this.locators.addressAddressOne(addressType).textContent()) ??
      EMPTY;
    const addressTwo =
      (await this.locators.addressAddressTwo(addressType).textContent()) ??
      EMPTY;
    const addressThree =
      (await this.locators.addressAddressThree(addressType).textContent()) ??
      EMPTY;
    const cityStateZipcode =
      (await this.locators
        .addressCityStateZipcode(addressType)
        .textContent()) ?? EMPTY;
    const country =
      (await this.locators.addressCountry(addressType).textContent()) ?? EMPTY;
    const phone =
      (await this.locators.addressPhone(addressType).textContent()) ?? EMPTY;
    return {
      name: name,
      addressOne: addressOne,
      addressTwo: addressTwo,
      addressThree: addressThree,
      cityStateZipcode: cityStateZipcode,
      country: country,
      phone: phone,
    };
  }

  /**
   * Fills the optional order comment textarea.
   *
   * @param comment - The comment text to enter.
   */
  async enterComment(comment: string): Promise<void> {
    await this.fill(this.locators.messageTextArea, comment);
  }

  /** Clicks "Place Order", proceeding to the payment page. */
  async placeOrder(): Promise<void> {
    await this.click(this.locators.placeOrderButton);
  }
}
