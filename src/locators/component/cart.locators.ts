import { Locator, Page } from "@playwright/test";

export class CartLocators {
  readonly cartItemsTable: Locator;
  readonly cartItemsTableProducts: Locator;
  readonly productName: (locator: Locator) => Locator;
  readonly productCategory: (locator: Locator) => Locator;
  readonly productPrice: (locator: Locator) => Locator;
  readonly productQuantity: (locator: Locator) => Locator;
  readonly productTotalPrice: (locator: Locator) => Locator;
  readonly removeProductFromCartButton: (lindex: number) => Locator;

  constructor(page: Page) {
    this.cartItemsTable = page
      .locator("#cart_info_table")
      .or(page.locator("#cart_info"));
    this.cartItemsTableProducts = this.cartItemsTable
      .locator("tbody")
      .locator("tr")
      .and(page.locator('[id*="product-"]'));
    this.productName = (locator: Locator) => {
      return locator.locator(".cart_description").getByRole("link");
    };
    this.productCategory = (locator: Locator) => {
      return locator.locator(".cart_description").locator("p");
    };
    this.productPrice = (locator: Locator) => {
      return locator.locator(".cart_price").locator("p");
    };
    this.productQuantity = (locator: Locator) => {
      return locator.locator(".cart_quantity").getByRole("button");
    };
    this.productTotalPrice = (locator: Locator) => {
      return locator.locator(".cart_total_price");
    };
    this.removeProductFromCartButton = (index: number): Locator => {
      return page
        .locator(".cart_quantity_delete")
        .and(page.locator(`[data-product-id="${index}"]`));
    };
  }
}
