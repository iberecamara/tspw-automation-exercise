import { Locator, Page } from "@playwright/test";

export class CheckoutLocators {
  readonly deliveryAddressContainer: Locator;
  readonly deliveryAddressHeading: Locator;
  readonly billingAddressContainer: Locator;
  readonly billingAddressHeading: Locator;
  readonly addressName: (addressType: "delivery" | "billing") => Locator;
  readonly addressAddressOne: (addressType: "delivery" | "billing") => Locator;
  readonly addressAddressTwo: (addressType: "delivery" | "billing") => Locator;
  readonly addressAddressThree: (
    addressType: "delivery" | "billing",
  ) => Locator;
  readonly addressCityStateZipcode: (
    addressType: "delivery" | "billing",
  ) => Locator;
  readonly addressCountry: (addressType: "delivery" | "billing") => Locator;
  readonly addressPhone: (addressType: "delivery" | "billing") => Locator;
  readonly messageTextArea: Locator;
  readonly placeOrderButton: Locator;

  constructor(page: Page) {
    this.deliveryAddressContainer = page.locator("#address_delivery");
    this.deliveryAddressHeading =
      this.deliveryAddressContainer.getByRole("heading");
    this.billingAddressContainer = page.locator("#address_invoice");
    this.billingAddressHeading = page.getByRole("heading", {
      name: "Your billing address",
    });
    this.addressName = (addressType: "delivery" | "billing"): Locator => {
      return this.resolveBaseAddressLocator(addressType)
        .getByRole("listitem")
        .nth(1);
    };
    this.addressAddressOne = (addressType: "delivery" | "billing"): Locator => {
      return this.resolveBaseAddressLocator(addressType)
        .getByRole("listitem")
        .nth(2);
    };
    this.addressAddressTwo = (addressType: "delivery" | "billing"): Locator => {
      return this.resolveBaseAddressLocator(addressType)
        .getByRole("listitem")
        .nth(3);
    };
    this.addressAddressThree = (
      addressType: "delivery" | "billing",
    ): Locator => {
      return this.resolveBaseAddressLocator(addressType)
        .getByRole("listitem")
        .nth(4);
    };
    this.addressCityStateZipcode = (
      addressType: "delivery" | "billing",
    ): Locator => {
      return this.resolveBaseAddressLocator(addressType)
        .getByRole("listitem")
        .nth(5);
    };
    this.addressCountry = (addressType: "delivery" | "billing"): Locator => {
      return this.resolveBaseAddressLocator(addressType)
        .getByRole("listitem")
        .nth(6);
    };
    this.addressPhone = (addressType: "delivery" | "billing"): Locator => {
      return this.resolveBaseAddressLocator(addressType)
        .getByRole("listitem")
        .nth(7);
    };
    this.messageTextArea = page.locator('textarea[name="message"]');
    this.placeOrderButton = page.getByRole("link", { name: "Place Order" });
  }

  private resolveBaseAddressLocator(
    addressType: "delivery" | "billing",
  ): Locator {
    switch (addressType) {
      case "delivery":
        return this.deliveryAddressContainer;
      case "billing":
        return this.billingAddressContainer;
      default:
        return this.deliveryAddressContainer;
    }
  }
}
