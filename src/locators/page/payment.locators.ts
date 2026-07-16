import { Locator, Page } from '@playwright/test';

export class PaymentLocators {

    readonly paymentHeading: Locator;
    readonly paymentForm: Locator;
    readonly paymentNameOnCard: Locator;
    readonly paymentCardNumber: Locator;
    readonly paymentCardCvc: Locator;
    readonly paymentCardExpirationMonth: Locator;
    readonly paymentCardExpirationYear: Locator;
    readonly paymentPayButton: Locator;
    readonly orderPlacedMessage: Locator;
    readonly orderConfirmedMessage: Locator;
    readonly downloadInvoiceButton: Locator;
    readonly continueButton: Locator;


    constructor(page: Page) {
        this.paymentHeading = page.locator('.step-one');
        this.paymentForm = page.locator('#payment-form');
        this.paymentNameOnCard = page.getByTestId('name-on-card');
        this.paymentCardNumber = page.getByTestId('card-number');
        this.paymentCardCvc = page.getByTestId('cvc');
        this.paymentCardExpirationMonth = page.getByTestId('expiry-month');
        this.paymentCardExpirationYear = page.getByTestId('expiry-year');
        this.paymentPayButton = page.getByTestId('pay-button');
        this.orderPlacedMessage = page.getByTestId('order-placed');
        this.orderConfirmedMessage = page.getByText('Congratulations! Your order has been confirmed!');
        this.downloadInvoiceButton = page.getByRole('link', { name: 'Download Invoice' });
        this.continueButton = page.getByTestId('continue-button');
    }

}