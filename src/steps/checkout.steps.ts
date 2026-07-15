import { NEWLINE, SPACE } from '@data/constants/string.constants';
import { ResumedAddressType } from '@data/model/address.model';
import { ProductType } from '@data/model/product.model';
import { UserType } from '@data/model/user.model';
import { test } from '@fixtures/fixtures';
import { CheckoutPage } from '@pages/checkout.page';
import { expect } from '@playwright/test';
import { TestAutomationLogger } from '@utils/logger.utils';
import { StringUtils } from '@utils/string.utils';

export class CheckoutSteps {

    readonly logger: TestAutomationLogger;
    readonly checkoutPage: CheckoutPage;

    constructor(logger: TestAutomationLogger, checkoutPage: CheckoutPage) {
        this.logger = logger;
        this.checkoutPage = checkoutPage;
    }

    // Actions
    async getCartProducts(): Promise<ProductType[]> {
        this.logger.debug('Retrieving all products details');
        const products: ProductType[] = [];
        await test.step('Retrieve all products', async () => {
            products.push(...await this.checkoutPage.getCartItems());
        });
        this.logger.debug('Retrieved all products details');
        return products;
    }

    async getAddress(addressType: 'delivery' | 'billing'): Promise<ResumedAddressType> {
        this.logger.debug(`Retrieving ${addressType} address.`);
        let address: ResumedAddressType;
        await test.step(`Retrieve ${addressType} address`, async () => {
            address = await this.checkoutPage.getAddress(addressType);
        });
        this.logger.debug(`Retrieved ${addressType} address.`);
        return address!;
    }

    async enterComment(comment: string): Promise<void> {
        this.logger.debug(`Entering Checkout comment: '${comment}'.`);
        await test.step('Enter  Checkout comment', async () => {
            await this.checkoutPage.enterComment(comment);
        });
        this.logger.debug('Entered Checkout comment.');
    }

    async placeOrder(): Promise<void> {
        this.logger.debug('Placing order.');
        await test.step('Place order', async () => {
            await this.checkoutPage.placeOrder();
        });
        this.logger.debug('Order placed.');
    }

    // Validations
    async validateCheckoutAddress(user: UserType, addressType: 'delivery' | 'billing'): Promise<void> {
        this.logger.debug(`Validating ${StringUtils.capitalize(addressType)} Address for user.`);
        this.logger.debug(`User address to validate: ${StringUtils.prettyJson(user.address)}`);
        await test.step(`Validate ${addressType} Address.`, async () => {
            if (user.address.title === 'Mr.') {
                await expect.soft(
                    this.checkoutPage.locators.addressName(addressType),
                    `${StringUtils.capitalize(addressType)} Address must have the user title '${user.address.title}'.`
                ).toContainText(user.address.title);
            } else {
                await expect.soft(
                    this.checkoutPage.locators.addressName(addressType),
                    `${StringUtils.capitalize(addressType)} Address must have the one of the valid user titles: 'Mrs.' or 'Ms..'.`
                ).toContainText(/Mrs\.|Ms\./);
            }
            await expect.soft(
                this.checkoutPage.locators.addressName(addressType),
                `${StringUtils.capitalize(addressType)} Address must have the user first name '${user.address.firstname}'.`
            ).toContainText(user.address.firstname);
            await expect.soft(
                this.checkoutPage.locators.addressName(addressType),
                `${StringUtils.capitalize(addressType)} Address must have the user last name '${user.address.lastname}'.`
            ).toContainText(user.address.lastname);
            await expect.soft(
                this.checkoutPage.locators.addressAddressOne(addressType),
                `${StringUtils.capitalize(addressType)} Address must have the user company name '${user.address.company}'.`
            ).toContainText(user.address.company);
            // Signup email uses newline characters and checkout uses spaces, we swap before checking
            const parsedAddressDetails = user.address.addressOne.replaceAll(NEWLINE, SPACE);
            await expect.soft(
                this.checkoutPage.locators.addressAddressTwo(addressType),
                `${StringUtils.capitalize(addressType)} Address must have the user address details '${parsedAddressDetails}'.`
            ).toContainText(parsedAddressDetails);
            await expect.soft(
                this.checkoutPage.locators.addressAddressThree(addressType),
                `${StringUtils.capitalize(addressType)} Address must have the user address complement details '${user.address.addressTwo}'.`
            ).toContainText(user.address.addressTwo);
            await expect.soft(
                this.checkoutPage.locators.addressCityStateZipcode(addressType),
                `${StringUtils.capitalize(addressType)} Address must have the user address city '${user.address.city}'.`
            ).toContainText(user.address.city);
            await expect.soft(
                this.checkoutPage.locators.addressCityStateZipcode(addressType),
                `${StringUtils.capitalize(addressType)} Address must have the user address state '${user.address.state}'.`
            ).toContainText(user.address.state);
            await expect.soft(
                this.checkoutPage.locators.addressCityStateZipcode(addressType),
                `${StringUtils.capitalize(addressType)} Address must have the user address zip code '${user.address.zipcode}'.`
            ).toContainText(user.address.zipcode);
            await expect.soft(
                this.checkoutPage.locators.addressCountry(addressType),
                `${StringUtils.capitalize(addressType)} Address must have the user address country '${user.address.country}'.`
            ).toContainText(user.address.country);
            await expect.soft(
                this.checkoutPage.locators.addressPhone(addressType),
                `${StringUtils.capitalize(addressType)} Address must have the user address associated phone number '${user.address.mobileNumber}'.`
            ).toContainText(user.address.mobileNumber);
        });
    }

    async validateCartItems(cartItems: ProductType[], addedItems: ProductType[]) {
        this.logger.debug('Validating all products in cart.');
        await test.step('Validate all products', async () => {
            expect.soft(
                cartItems,
                'Cart items must match added items.'
            ).toEqual(
                expect.arrayContaining(addedItems)
            );
        });
    }

}