import { Locator, Page } from '@playwright/test';

export class CartLocators {

    readonly proceedToCheckoutButton: Locator;
    readonly registerFromCheckoutLink: Locator;
    readonly deliveryAddressContainer: Locator;
    readonly deliveryAddressHeading: Locator;
    readonly deliveryAddressName: Locator;
    readonly deliveryAddressAddressOne: Locator;
    readonly deliveryAddressAddressTwo: Locator;
    readonly deliveryAddressAddressThree: Locator;
    readonly deliverAddressCityStateZipcode: Locator;
    readonly deliverAddressCountry: Locator;
    readonly deliverAddressPhone: Locator;
    readonly billingAddressContainer: Locator;
    readonly billingAddressHeading: Locator;
    readonly billingAddressName: Locator;
    readonly billingAddressAddressOne: Locator;
    readonly billingAddressAddressTwo: Locator;
    readonly billingAddressAddressThree: Locator;
    readonly billingddressCityStateZipcode: Locator;
    readonly billingddressCountry: Locator;
    readonly billingddressPhone: Locator;

    constructor(page: Page) {
        this.proceedToCheckoutButton = page.getByText('Proceed To Checkout');
        this.registerFromCheckoutLink = page.getByRole('link', { name: 'Register / Login' });
        this.deliveryAddressContainer = page.locator('#address_delivery');
        this.deliveryAddressHeading = this.deliveryAddressContainer.getByRole('heading');
        this.deliveryAddressName = this.deliveryAddressContainer.locator('.address_firstname address_lastname');
        this.deliveryAddressAddressOne = this.deliveryAddressContainer.locator('.address_address1 address_address2').first();
        this.deliveryAddressAddressTwo = this.deliveryAddressContainer.locator('.address_address1 address_address2').nth(1);
        this.deliveryAddressAddressThree = this.deliveryAddressContainer.locator('.address_address1 address_address2').nth(2);
        this.deliverAddressCityStateZipcode = this.deliveryAddressContainer.locator('.address_city address_state_name address_postcode');
        this.deliverAddressCountry = this.deliveryAddressContainer.locator('.address_country_name');
        this.deliverAddressPhone = this.deliveryAddressContainer.locator('.address_phone');
        this.billingAddressContainer = page.locator('#address_invoice');
        this.billingAddressHeading = page.getByRole('heading', { name: 'Your billing address' });
        this.billingAddressName = this.deliveryAddressContainer.locator('.address_firstname address_lastname');
        this.billingAddressAddressOne = this.deliveryAddressContainer.locator('.address_address1 address_address2').first();
        this.billingAddressAddressTwo = this.deliveryAddressContainer.locator('.address_address1 address_address2').nth(1);
        this.billingAddressAddressThree = this.deliveryAddressContainer.locator('.address_address1 address_address2').nth(2);
        this.billingddressCityStateZipcode = this.deliveryAddressContainer.locator('.address_city address_state_name address_postcode');
        this.billingddressCountry = this.deliveryAddressContainer.locator('.address_country_name');
        this.billingddressPhone = this.deliveryAddressContainer.locator('.address_phone');
    }

}