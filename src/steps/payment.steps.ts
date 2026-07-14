import { CREATED, MINUTE_IN_MILISSECONDS } from '@data/constants/common.constants';
import { CreditCardDetailsType } from '@data/model/credit-card-details.model';
import { test } from '@fixtures/fixtures';
import { AccountCreatedDeletedPage } from '@pages/account-created-deleted.page';
import { PaymentPage } from '@pages/payment.page';
import { expect, Locator } from '@playwright/test';
import { TestAutomationLogger } from '@utils/logger.utils';
import { StringUtils } from '@utils/string.utils';

export class PaymentSteps {

    // Actions
    async enterCardDetails(logger: TestAutomationLogger, paymentPage: PaymentPage, cardDetails: CreditCardDetailsType): Promise<void> {
        logger.debug(`Entering Credit Card details: ${StringUtils.prettyJson(cardDetails)}`);
        await test.step(`Enter Credit Card details`, async () => {
            await paymentPage.enterNameOnCard(cardDetails.name);
            await paymentPage.enterCardNumber(cardDetails.number);
            await paymentPage.enterCardCvc(cardDetails.cvc);
            await paymentPage.enterCardExpirationMonth(cardDetails.expirationMonth);
            await paymentPage.enterCardExpirationYear(cardDetails.expirationYear);
        });
        logger.debug(`Entered Credit Card details.`);
    }

    async payAndConfirmOrder(logger: TestAutomationLogger, paymentPage: PaymentPage): Promise<void> {
        logger.debug(`Clicking Pay and Confirm Order page`);
        await test.step(`Click Pay and Confirm Order page`, async () => {
            await paymentPage.clickPayAndConfirmOrder();
        });
        logger.debug(`Clicked Pay and Confirm Order page`);
    }

    // Validations
    async validateOrderPlaced(logger: TestAutomationLogger, paymentPage: PaymentPage): Promise<void> {
        logger.debug('Validating Payment page Order Placed message.');
        await test.step('Validating Payment page Order Placed message', async () => {
            await expect.soft(
                paymentPage.locators.orderPlacedMessage,
                `Payment page message 'Order Placed!' should be visible`
            ).toHaveText('Order Placed!');
        });
        logger.debug('Validating Payment page Order Confirmed message.');
        await test.step('Validating Payment page Order Confirmed message', async () => {
            await expect.soft(
                paymentPage.locators.orderConfirmedMessage,
                `Payment page message 'Congratulations! Your order has been confirmed!' should be visible`
            ).toBeVisible();
        });
    }
}