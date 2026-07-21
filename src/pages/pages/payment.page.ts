import { DOWNLOAD_FILEPATH } from "@files/download/download.filepath";
import { PaymentLocators } from "@locators/page/payment.locators";
import { BasePage } from "@pages.base/base.page";
import { Page } from "@playwright/test";

/** Page Object for the payment page (card details form) and the order confirmation screen that follows it. */
export class PaymentPage extends BasePage {
  readonly locators: PaymentLocators;

  constructor(page: Page) {
    super(page);
    this.locators = new PaymentLocators(page);
  }

  async enterNameOnCard(name: string): Promise<void> {
    await this.fill(this.locators.paymentNameOnCard, name);
  }

  async enterCardNumber(cardNumber: number): Promise<void> {
    await this.fill(this.locators.paymentCardNumber, cardNumber.toString());
  }

  async enterCardCvc(cardCvc: number): Promise<void> {
    await this.fill(this.locators.paymentCardCvc, cardCvc.toString());
  }

  async enterCardExpirationMonth(cardExpirationMonth: number): Promise<void> {
    await this.fill(
      this.locators.paymentCardExpirationMonth,
      cardExpirationMonth.toString(),
    );
  }

  async enterCardExpirationYear(cardExpirationYear: number): Promise<void> {
    await this.fill(
      this.locators.paymentCardExpirationYear,
      cardExpirationYear.toString(),
    );
  }

  async clickPayAndConfirmOrder(): Promise<void> {
    await this.click(this.locators.paymentPayButton);
  }

  /**
   * Downloads the order invoice and saves it to `DOWNLOAD_FILEPATH` (`artifacts/downloads/`) under
   * its server-suggested filename, returning the saved file's full path so callers can assert on
   * its contents.
   */
  async downloadInvoice(): Promise<string> {
    const downloadPromise = this.page.waitForEvent("download");
    await this.click(this.locators.downloadInvoiceButton);
    const download = await downloadPromise;
    const filepath = `${DOWNLOAD_FILEPATH}/${download.suggestedFilename()}`;
    await download.saveAs(filepath);
    return filepath;
  }

  async clickContinue(): Promise<void> {
    await this.click(this.locators.continueButton);
  }
}