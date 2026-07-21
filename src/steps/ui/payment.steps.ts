import { EMPTY, NEWLINE } from "@data/constants/string.constants";
import { CreditCardDetailsType } from "@data/model/credit-card-details.model";
import { UserType } from "@data/model/user.model";
import { test } from "@fixtures/fixtures";
import { PaymentPage } from "@pages/payment.page";
import { expect } from "@playwright/test";
import { BaseSteps } from "@steps/base.steps";
import { StringUtils } from "@utils/string.utils";

export class PaymentSteps extends BaseSteps {
  readonly paymentPage: PaymentPage;

  constructor(paymentPage: PaymentPage) {
    super();
    this.paymentPage = paymentPage;
  }

  // Actions
  async enterCardDetails(cardDetails: CreditCardDetailsType): Promise<void> {
    this.logger.verbose(
      `Entering Credit Card details: ${StringUtils.prettyJson(cardDetails)}`,
    );

    await test.step(`Enter Credit Card details`, async () => {
      await this.paymentPage.enterNameOnCard(cardDetails.name);
      await this.paymentPage.enterCardNumber(cardDetails.number);
      await this.paymentPage.enterCardCvc(cardDetails.cvc);
      await this.paymentPage.enterCardExpirationMonth(
        cardDetails.expirationMonth,
      );
      await this.paymentPage.enterCardExpirationYear(
        cardDetails.expirationYear,
      );
    });

    this.logger.verbose(`Entered Credit Card details.`);
  }

  async payAndConfirmOrder(): Promise<void> {
    this.logger.verbose(`Clicking Pay and Confirm Order`);

    await test.step(`Click Pay and Confirm Order`, async () => {
      await this.paymentPage.clickPayAndConfirmOrder();
    });

    this.logger.verbose(`Clicked Pay and Confirm Order`);
  }

  async downloadInvoice(): Promise<string> {
    this.logger.verbose(`Clicking Download Invoice`);
    let filepath: string = EMPTY;

    await test.step(`Click Download Invoice`, async () => {
      filepath = await this.paymentPage.downloadInvoice();
    });

    this.logger.verbose(`Clicked Download Invoice`);
    return filepath;
  }

  async continue(): Promise<void> {
    this.logger.verbose(`Clicking Continue`);

    await test.step(`Click Continue`, async () => {
      await this.paymentPage.clickContinue();
    });

    this.logger.verbose(`Clicked Continue`);
  }

  // Validations
  async validateOrderPlaced(): Promise<void> {
    this.logger.verbose("Validating Payment page Order Placed message.");

    await test.step("Validate Payment page Order Placed message", async () => {
      await expect
        .soft(
          this.paymentPage.locators.orderPlacedMessage,
          `Payment page message 'Order Placed!' should be visible`,
        )
        .toHaveText("Order Placed!");
    });

    this.logger.verbose("Validating Payment page Order Confirmed message.");

    await test.step("Validate Payment page Order Confirmed message", async () => {
      await expect
        .soft(
          this.paymentPage.locators.orderConfirmedMessage,
          `Payment page message 'Congratulations! Your order has been confirmed!' should be visible`,
        )
        .toBeVisible();
    });
  }

  async validateInvoiceFileContents(
    fileContents: string[],
    user: UserType,
    totalPrice: number,
  ): Promise<void> {
    this.logger.verbose("Validating Invoice File details.");
    this.logger.verbose(`Invoice: ${NEWLINE}${fileContents.join(', ')}`);

    await test.step("Validate Invoice File details", () => {
      expect
        .soft(
          fileContents[0],
          `Invoice file details should have the user first name on it.`,
        )
        .toContain(user.address.firstname);
      expect
        .soft(
          fileContents[0],
          `Invoice file details should have the user last name on it.`,
        )
        .toContain(user.address.lastname);
      expect
        .soft(
          fileContents[0],
          `Invoice file details should have the total price on it.`,
        )
        .toContain(totalPrice.toString());
    });
  }
}
