import { CreditCardDetailsType } from '@data/model/credit-card-details.model';
import { test } from '@fixtures/fixtures';
import { PaymentPage } from '@pages/payment.page';
import { expect } from '@playwright/test';
import { TestAutomationLogger } from '@utils/logger.utils';
import { StringUtils } from '@utils/string.utils';

export class PaymentSteps {

    readonly logger: TestAutomationLogger;
    readonly paymentPage: PaymentPage;

    constructor(logger: TestAutomationLogger, paymentPage: PaymentPage) {
        this.logger = logger;
        this.paymentPage = paymentPage;
    }

    // Actions
    async enterCardDetails(cardDetails: CreditCardDetailsType): Promise<void> {
        this.logger.debug(`Entering Credit Card details: ${StringUtils.prettyJson(cardDetails)}`);
        await test.step(`Enter Credit Card details`, async () => {
            await this.paymentPage.enterNameOnCard(cardDetails.name);
            await this.paymentPage.enterCardNumber(cardDetails.number);
            await this.paymentPage.enterCardCvc(cardDetails.cvc);
            await this.paymentPage.enterCardExpirationMonth(cardDetails.expirationMonth);
            await this.paymentPage.enterCardExpirationYear(cardDetails.expirationYear);
        });
        this.logger.debug(`Entered Credit Card details.`);
    }

    async payAndConfirmOrder(): Promise<void> {
        this.logger.debug(`Clicking Pay and Confirm Order page`);
        await test.step(`Click Pay and Confirm Order page`, async () => {
            await this.paymentPage.clickPayAndConfirmOrder();
        });
        this.logger.debug(`Clicked Pay and Confirm Order page`);
    }

    // Validations
    async validateOrderPlaced(): Promise<void> {
        this.logger.debug('Validating Payment page Order Placed message.');
        await test.step('Validating Payment page Order Placed message', async () => {
            await expect.soft(
                this.paymentPage.locators.orderPlacedMessage,
                `Payment page message 'Order Placed!' should be visible`
            ).toHaveText('Order Placed!');
        });
        this.logger.debug('Validating Payment page Order Confirmed message.');
        await test.step('Validating Payment page Order Confirmed message', async () => {
            await expect.soft(
                this.paymentPage.locators.orderConfirmedMessage,
                `Payment page message 'Congratulations! Your order has been confirmed!' should be visible`
            ).toBeVisible();
        });
    }
}