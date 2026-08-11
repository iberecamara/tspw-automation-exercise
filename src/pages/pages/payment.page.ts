import { SECOND_IN_MILLISECONDS } from "@data/constants/common.constants";
import { DOWNLOAD_FILEPATH } from "@files/download/download.filepath";
import { BasePage } from "@pages.base/base.page";
import { PaymentLocators } from "@pages.base/locators/page/payment.locators";
import { Page } from "@playwright/test";

/** Page Object for the payment page (card details form) and the order confirmation screen that follows it. */
export class PaymentPage extends BasePage {
  readonly locators: PaymentLocators;

  constructor(page: Page) {
    super(page);
    this.locators = new PaymentLocators(page);
  }

  /** Fills the "Name on Card" field. */
  async enterNameOnCard(name: string): Promise<void> {
    await this.fill(this.locators.paymentNameOnCard, name);
  }

  /** Fills the card number field. */
  async enterCardNumber(cardNumber: number): Promise<void> {
    await this.fill(this.locators.paymentCardNumber, cardNumber.toString());
  }

  /** Fills the CVC field. */
  async enterCardCvc(cardCvc: number): Promise<void> {
    await this.fill(this.locators.paymentCardCvc, cardCvc.toString());
  }

  /** Fills the expiration month field. */
  async enterCardExpirationMonth(cardExpirationMonth: number): Promise<void> {
    await this.fill(
      this.locators.paymentCardExpirationMonth,
      cardExpirationMonth.toString(),
    );
  }

  /** Fills the expiration year field. */
  async enterCardExpirationYear(cardExpirationYear: number): Promise<void> {
    await this.fill(
      this.locators.paymentCardExpirationYear,
      cardExpirationYear.toString(),
    );
  }

  /** Clicks "Pay and Confirm Order". */
  async clickPayAndConfirmOrder(): Promise<void> {
    await this.click(this.locators.paymentPayButton);
  }

  /**
   * Downloads the order invoice and saves it to `DOWNLOAD_FILEPATH` (`artifacts/downloads/`) under
   * its server-suggested filename, returning the saved file's full path so callers can assert on
   * its contents.
   */
  async downloadInvoice(): Promise<string> {
    const downloadPromise = this.page.waitForEvent("download", {
      timeout: 15 * SECOND_IN_MILLISECONDS,
    });
    await this.click(this.locators.downloadInvoiceButton);
    const download = await downloadPromise;
    const filepath = `${DOWNLOAD_FILEPATH}/${download.suggestedFilename()}`;
    await download.saveAs(filepath);
    return filepath;
  }

  /** Clicks "Continue" on the order confirmation screen, returning to the home page. */
  async clickContinue(): Promise<void> {
    await this.click(this.locators.continueButton);
  }
}
