import { Locator, Page } from '@playwright/test';

export class CartLocators {

    readonly cartItemsTable: Locator;
    readonly cartItemsTableProducts: Locator;
    readonly productName: Function;
    readonly productCategory: Function;
    readonly productPrice: Function;
    readonly productQuantity: Function;
    readonly productTotalPrice: Function;
    readonly removeProductFromCartButton: Function;

    constructor(page: Page) {
        this.cartItemsTable = page.locator('#cart_info_table');
        this.cartItemsTableProducts = this.cartItemsTable.locator('tbody').locator('tr').and(page.locator('[id*="product-"]'));;
        this.productName = (locator: Locator) => { return locator.locator('.cart_description').getByRole('link') };
        this.productCategory = (locator: Locator) => { return locator.locator('.cart_description').locator('p') };
        this.productPrice = (locator: Locator) => { return locator.locator('.cart_price').locator('p') };
        this.productQuantity = (locator: Locator) => { return locator.locator('.cart_quantity').getByRole('button') };
        this.productTotalPrice = (locator: Locator) => { return locator.locator('.cart_total_price') };
        this.removeProductFromCartButton = (index: number): Locator => { return page.locator('.cart_quantity_delete').and(page.locator(`[data-product-id="${index}"]`)) };
    }

}