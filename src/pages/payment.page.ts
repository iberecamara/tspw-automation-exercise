import { PaymentLocators } from '@locators/page/payment.locators';
import { BasePage } from '@pages/base.page';
import { Page } from '@playwright/test';

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
        await this.fill(this.locators.paymentCardExpirationMonth, cardExpirationMonth.toString());
    }

    async enterCardExpirationYear(cardExpirationYear: number): Promise<void> {
        await this.fill(this.locators.paymentCardExpirationYear, cardExpirationYear.toString());
    }

    async clickPayAndConfirmOrder(): Promise<void> {
        await this.click(this.locators.paymentPayButton);
    }

}