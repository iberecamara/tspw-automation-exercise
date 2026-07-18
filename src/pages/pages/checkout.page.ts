import { CartComponent } from '@components/cart.component';
import { EMPTY } from '@data/constants/string.constants';
import { ResumedAddressType } from '@data/model/address.model';
import { CheckoutLocators } from '@locators/page/checkout.locators';
import { BasePage } from '@pages.base/base.page';
import { Page } from '@playwright/test';

export class CheckoutPage extends BasePage {


    readonly locators: CheckoutLocators;
    readonly cart: CartComponent;

    constructor(page: Page) {
        super(page);
        this.locators = new CheckoutLocators(page);
        this.cart = new CartComponent(page);
    }

    async getAddress(addressType: 'delivery' | 'billing'): Promise<ResumedAddressType> {
        const name = await this.locators.addressName(addressType).textContent() ?? EMPTY;
        const addressOne = await this.locators.addressAddressOne(addressType).textContent() ?? EMPTY;
        const addressTwo = await this.locators.addressAddressTwo(addressType).textContent() ?? EMPTY;
        const addressThree = await this.locators.addressAddressThree(addressType).textContent() ?? EMPTY;
        const cityStateZipcode = await this.locators.addressCityStateZipcode(addressType).textContent() ?? EMPTY;
        const country = await this.locators.addressCountry(addressType).textContent() ?? EMPTY;
        const phone = await this.locators.addressPhone(addressType).textContent() ?? EMPTY;
        return {
            name: name,
            addressOne: addressOne,
            addressTwo: addressTwo,
            addressThree: addressThree,
            cityStateZipcode: cityStateZipcode,
            country: country,
            phone: phone
        };
    }

    async enterComment(comment: string): Promise<void> {
        await this.fill(this.locators.messageTextArea, comment);
    }

    async placeOrder(): Promise<void> {
        await this.click(this.locators.placeOrderButton);
    }

}
