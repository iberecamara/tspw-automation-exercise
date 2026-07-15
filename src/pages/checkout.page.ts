import { EMPTY } from '@data/constants/string.constants';
import { ProductCategoryType } from '@data/model/product-category.model';
import { ProductType } from '@data/model/product.model';
import { CheckoutLocators } from '@locators/page/checkout.locators';
import { BasePage } from '@pages/base.page';
import { Locator, Page } from '@playwright/test';
import { ResumedAddressType } from '../data/model/address.model';

export class CheckoutPage extends BasePage {


    readonly locators: CheckoutLocators;

    constructor(page: Page) {
        super(page);
        this.locators = new CheckoutLocators(page);
    }

    async getAddress(addressType: string): Promise<ResumedAddressType> {
        const name = await this.locators.addressName(addressType).textContent();
        const addressOne = await this.locators.addressAddressOne(addressType).textContent();
        const addressTwo = await this.locators.addressAddressTwo(addressType).textContent();
        const addressThree = await this.locators.addressAddressThree(addressType).textContent();
        const cityStateZipcode = await this.locators.addressCityStateZipcode(addressType).textContent();
        const country = await this.locators.addressCountry(addressType).textContent();
        const phone = await this.locators.addressPhone(addressType).textContent();
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

    async getCartItems(): Promise<ProductType[]> {
        const cartItems: ProductType[] = []
        const itemLocators: Locator[] = await this.locators.checkoutItemsTable.locator('tbody').locator('tr').and(this.page.locator('[id*="product-"]')).all();
        for (const itemLocator of itemLocators) {
            const id = await itemLocator.getAttribute('id') ?? EMPTY;
            const name = await itemLocator.locator('.cart_description').getByRole('link').textContent() ?? EMPTY;
            let rawCategory = await itemLocator.locator('.cart_description').locator('p').textContent() ?? EMPTY;
            rawCategory = rawCategory.replace('Category: ', EMPTY);
            const price = await itemLocator.locator('.cart_price').locator('p').textContent() ?? EMPTY;
            const quantity = await itemLocator.locator('.cart_quantity').getByRole('button').textContent() ?? EMPTY;
            const totalPrice = await itemLocator.locator('.cart_total_price').textContent() ?? EMPTY;
            const categoryDelimiter = ' > ';
            const category: ProductCategoryType = {
                usertype: {
                    usertype: rawCategory.slice(0, rawCategory.indexOf(categoryDelimiter))
                },
                category: rawCategory.slice(rawCategory.indexOf(categoryDelimiter) + categoryDelimiter.length)
            };
            cartItems.push({
                id: +id.replace('product-', EMPTY),
                name: name,
                category: category,
                price: +price.replace('Rs. ', EMPTY),
                quantity: +quantity,
                totalPrice: +totalPrice.replace('Rs. ', EMPTY),
            });
        }
        return cartItems;
    }

    async enterComment(comment: string): Promise<void> {
        await this.fill(this.locators.messageTextArea, comment);
    }

    async placeOrder(): Promise<void> {
        await this.click(this.locators.placeOrderButton);
    }

}
