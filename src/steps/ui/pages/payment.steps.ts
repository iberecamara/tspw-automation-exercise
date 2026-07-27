import { NEWLINE } from "@data/constants/string.constants";
import { CreditCardDetailsType } from "@data/model/credit-card-details.model";
import { UserType } from "@data/model/user.model";
import { PaymentPage } from "@pages/payment.page";
import { expect } from "@playwright/test";
import { BaseSteps } from "@steps/ui/common/base.steps";
import { prettyJson } from "@utils/string.utils";

export class PaymentSteps extends BaseSteps {
  readonly paymentPage: PaymentPage;

  constructor(paymentPage: PaymentPage) {
    super();
    this.paymentPage = paymentPage;
  }

  // Actions
  async enterCardDetails(cardDetails: CreditCardDetailsType): Promise<void> {
    this.logger.verbose(
      `Entering Credit Card details: ${prettyJson(cardDetails)}`,
    );
    await this.step("Enter Credit Card details", async () => {
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
  }

  async payAndConfirmOrder(): Promise<void> {
    await this.step("Click Pay and Confirm Order", async () => {
      await this.paymentPage.clickPayAndConfirmOrder();
    });
  }

  async downloadInvoice(): Promise<string> {
    return await this.step("Click Download Invoice", async () => {
      return await this.paymentPage.downloadInvoice();
    });
  }

  async continue(): Promise<void> {
    await this.step("Click Continue", async () => {
      await this.paymentPage.clickContinue();
    });
  }

  // Validations
  async validateOrderPlaced(): Promise<void> {
    await this.step("Validate Payment page Order Placed message", async () => {
      await expect
        .soft(
          this.paymentPage.locators.orderPlacedMessage,
          `Payment page message 'Order Placed!' should be visible`,
        )
        .toHaveText("Order Placed!");
    });
    await this.step(
      "Validate Payment page Order Confirmed message",
      async () => {
        await expect
          .soft(
            this.paymentPage.locators.orderConfirmedMessage,
            `Payment page message 'Congratulations! Your order has been confirmed!' should be visible`,
          )
          .toBeVisible();
      },
    );
  }

  async validateInvoiceFileContents(
    fileContents: string[],
    user: UserType,
    totalPrice: number,
  ): Promise<void> {
    this.logger.verbose("Validating Invoice File details.");
    this.logger.verbose(`Invoice: ${NEWLINE}${fileContents.join(", ")}`);
    await this.step("Validate Invoice File details", () => {
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
