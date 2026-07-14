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

    // Actions
    async getCartProducts(logger: TestAutomationLogger, checkoutPage: CheckoutPage): Promise<ProductType[]> {
        logger.debug('Retrieveing all products details');
        const products: ProductType[] = [];
        await test.step('Retrieve all products', async () => {
            products.push(...await checkoutPage.getCartItems());
        });
        logger.debug('Retrieved all products details');
        return products;
    }

    async getAddress(logger: TestAutomationLogger, checkoutPage: CheckoutPage, addressType: 'delivery' | 'billing'): Promise<ResumedAddressType> {
        logger.debug(`Retrieveing ${addressType} address.`);
        let address: ResumedAddressType;
        await test.step(`Retrieve ${addressType} address`, async () => {
            address = await checkoutPage.getAddress(addressType);
        });
        logger.debug(`Retrieved ${addressType} address.`);
        return address!;
    }

    async enterComment(logger: TestAutomationLogger, checkoutPage: CheckoutPage, comment: string): Promise<void> {
        logger.debug(`Entering Checkout comment: '${comment}'.`);
        await test.step('Enter  Checkout comment', async () => {
            await checkoutPage.enterComment(comment);
        });
        logger.debug('Entered Checkout comment.');
    }

    async placeOrder(logger: TestAutomationLogger, checkoutPage: CheckoutPage): Promise<void> {
        logger.debug('Placing order.');
        await test.step('Place order', async () => {
            await checkoutPage.placeOrder();
        });
        logger.debug('Order placed.');
    }

    // Validations
    async validateCheckoutAddress(logger: TestAutomationLogger, checkout: CheckoutPage, user: UserType, addressType: 'delivery' | 'billing'): Promise<void> {
        logger.debug(`Validating ${StringUtils.capitalize(addressType)} Address for user.`);
        logger.debug(`User address to validate: ${StringUtils.prettyJson(user.address)}`);
        await test.step(`Validate ${addressType} Address.`, async () => {
            // Title in Signup and Checkout differ for 'Ms.' and 'Mrs.'
            const parsedTitle = user.address.title === 'Mr.' ? 'Mr.' : 'Mrs.';
            await expect.soft(
                checkout.locators.addressName(addressType),
                `${StringUtils.capitalize(addressType)} Address must have the user title '${parsedTitle}'.`
            ).toContainText(parsedTitle);
            await expect.soft(
                checkout.locators.addressName(addressType),
                `${StringUtils.capitalize(addressType)} Address must have the user first name '${user.address.firstname}'.`
            ).toContainText(user.address.firstname);
            await expect.soft(
                checkout.locators.addressName(addressType),
                `${StringUtils.capitalize(addressType)} Address must have the user last name '${user.address.lastname}'.`
            ).toContainText(user.address.lastname);
            await expect.soft(
                checkout.locators.addressAddressOne(addressType),
                `${StringUtils.capitalize(addressType)} Address must have the user company name '${user.address.company}'.`
            ).toContainText(user.address.company);
            // Signup email uses newline characters and checkout uses spaces, we swap before checking
            const parsedAddressDetails = user.address.addressOne.replaceAll(NEWLINE, SPACE);
            await expect.soft(
                checkout.locators.addressAddressTwo(addressType),
                `${StringUtils.capitalize(addressType)} Address must have the user address details '${parsedAddressDetails}'.`
            ).toContainText(parsedAddressDetails);
            await expect.soft(
                checkout.locators.addressAddressThree(addressType),
                `${StringUtils.capitalize(addressType)} Address must have the user address complement details '${user.address.addressTwo}'.`
            ).toContainText(user.address.addressTwo);
            await expect.soft(
                checkout.locators.addressCityStateZipcode(addressType),
                `${StringUtils.capitalize(addressType)} Address must have the user address city '${user.address.city}'.`
            ).toContainText(user.address.city);
            await expect.soft(
                checkout.locators.addressCityStateZipcode(addressType),
                `${StringUtils.capitalize(addressType)} Address must have the user address state '${user.address.state}'.`
            ).toContainText(user.address.state);
            await expect.soft(
                checkout.locators.addressCityStateZipcode(addressType),
                `${StringUtils.capitalize(addressType)} Address must have the user address zip code '${user.address.zipcode}'.`
            ).toContainText(user.address.zipcode);
            await expect.soft(
                checkout.locators.addressCountry(addressType),
                `${StringUtils.capitalize(addressType)} Address must have the user address country '${user.address.country}'.`
            ).toContainText(user.address.country);
            await expect.soft(
                checkout.locators.addressPhone(addressType),
                `${StringUtils.capitalize(addressType)} Address must have the user address associated phone number '${user.address.mobileNumber}'.`
            ).toContainText(user.address.mobileNumber);
        });
    }

    async validateCartItems(logger: TestAutomationLogger, cartItems: ProductType[], addedItems: ProductType[]) {
        logger.debug('Validating all products in cart.');
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