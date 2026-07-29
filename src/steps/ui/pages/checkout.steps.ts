import { EMPTY, NEWLINE, SPACE } from "@data/constants/constants";
import { ResumedAddressType } from "@data/model/address.model";
import { ProductType } from "@data/model/product.model";
import { UserType } from "@data/model/user.model";
import { CheckoutPage } from "@pages/checkout.page";
import { expect } from "@playwright/test";
import { BaseSteps } from "@steps/base.steps";
import { capitalize, prettyJson } from "@utils/string.utils";

/** Readable, logged steps driving {@link CheckoutPage}. */
export class CheckoutSteps extends BaseSteps {
  readonly checkoutPage: CheckoutPage;

  constructor(checkoutPage: CheckoutPage) {
    super();
    this.checkoutPage = checkoutPage;
  }

  // Actions

  /** Retrieves every product currently in the cart, via the checkout page's embedded cart table. */
  async getCartProducts(): Promise<ProductType[]> {
    return await this.step("Retrieve all products from Cart", async () => {
      return await this.checkoutPage.cart.getCartItems();
    });
  }

  /** Retrieves the delivery or billing address summary. */
  async getAddress(
    addressType: "delivery" | "billing",
  ): Promise<ResumedAddressType> {
    return await this.step(`Retrieve ${addressType} address`, async () => {
      return await this.checkoutPage.getAddress(addressType);
    });
  }

  /** Fills the optional order comment. */
  async enterComment(comment: string): Promise<void> {
    this.logger.verbose(`Entering Checkout comment: '${comment}'.`);
    await this.step("Enter  Checkout comment", async () => {
      await this.checkoutPage.enterComment(comment);
    });
  }

  /** Clicks "Place Order". */
  async placeOrder(): Promise<void> {
    await this.step("Place order", async () => {
      await this.checkoutPage.placeOrder();
    });
  }

  // Validations

  /**
   * Validates the delivery or billing address summary matches a user's address, field by field
   * (title, name, company, street address, complement, city/state/zipcode, country, phone).
   *
   * @remarks Signup stores multi-line address text with newline characters, while checkout
   * displays it with spaces instead; `user.address.addressOne` is normalized (`\n` → ` `) before
   * comparison to account for that difference.
   */
  async validateCheckoutAddress(
    user: UserType,
    addressType: "delivery" | "billing",
  ): Promise<void> {
    this.logger.verbose(
      `Validating ${capitalize(addressType)} Address for user.`,
    );
    this.logger.verbose(
      `User address to validate: ${prettyJson(user.address)}`,
    );
    await this.step(
      `Validate ${capitalize(addressType)} Address for user.`,
      async () => {
        await expect
          .soft(
            this.checkoutPage.locators.addressName(addressType),
            `${addressType} address must show the expected title.`,
          )
          .toContainText(/Mrs\.|Mr\.|Ms\./);
        await expect
          .soft(
            this.checkoutPage.locators.addressName(addressType),
            `${capitalize(addressType)} Address must have the user first name '${user.address.firstname}'.`,
          )
          .toContainText(user.address.firstname);
        await expect
          .soft(
            this.checkoutPage.locators.addressName(addressType),
            `${capitalize(addressType)} Address must have the user last name '${user.address.lastname}'.`,
          )
          .toContainText(user.address.lastname);
        await expect
          .soft(
            this.checkoutPage.locators.addressAddressOne(addressType),
            `${capitalize(addressType)} Address must have the user company name '${user.address.company}'.`,
          )
          .toContainText(user.address.company);
        // Signup email uses newline characters and checkout uses spaces, we swap before checking
        const parsedAddressDetails = user.address.addressOne.replaceAll(
          NEWLINE,
          SPACE,
        );
        await expect
          .soft(
            this.checkoutPage.locators.addressAddressTwo(addressType),
            `${capitalize(addressType)} Address must have the user address details '${parsedAddressDetails}'.`,
          )
          .toContainText(parsedAddressDetails);
        await expect
          .soft(
            this.checkoutPage.locators.addressAddressThree(addressType),
            `${capitalize(addressType)} Address must have the user address complement details '${user.address.addressTwo}'.`,
          )
          .toContainText(user.address.addressTwo);
        await expect
          .soft(
            this.checkoutPage.locators.addressCityStateZipcode(addressType),
            `${capitalize(addressType)} Address must have the user address city '${user.address.city}'.`,
          )
          .toContainText(user.address.city);
        await expect
          .soft(
            this.checkoutPage.locators.addressCityStateZipcode(addressType),
            `${capitalize(addressType)} Address must have the user address state '${user.address.state}'.`,
          )
          .toContainText(user.address.state);
        await expect
          .soft(
            this.checkoutPage.locators.addressCityStateZipcode(addressType),
            `${capitalize(addressType)} Address must have the user address zip code '${user.address.zipcode}'.`,
          )
          .toContainText(user.address.zipcode);
        await expect
          .soft(
            this.checkoutPage.locators.addressCountry(addressType),
            `${capitalize(addressType)} Address must have the user address country '${user.address.country}'.`,
          )
          .toContainText(user.address.country);
        await expect
          .soft(
            this.checkoutPage.locators.addressPhone(addressType),
            `${capitalize(addressType)} Address must have the user address associated phone number '${user.address.mobileNumber}'.`,
          )
          .toContainText(user.address.mobileNumber ?? EMPTY);
      },
    );
  }

  /** Validates the cart's actual items strictly match an expected set (see `CartSteps.validateCartItems` for the equivalent with a `partial` option). */
  async validateCartItems(cartItems: ProductType[], addedItems: ProductType[]) {
    this.logger.verbose("Validating all products in cart.");
    this.logger.verbose(`Cart Items: ${prettyJson(cartItems)}`);
    this.logger.verbose(`Added Items: ${prettyJson(addedItems)}`);
    await this.step("Validate all products in cart.", () => {
      expect
        .soft(cartItems, "Cart items must match added items.")
        .toEqual(expect.arrayContaining(addedItems));
    });
  }
}
