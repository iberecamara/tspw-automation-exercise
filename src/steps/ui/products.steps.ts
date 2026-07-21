import { ProductType } from "@data/model/product.model";
import { test } from "@fixtures/fixtures";
import { ProductsPage } from "@pages/products.page";
import { expect } from "@playwright/test";
import { BaseSteps } from "@steps/base.steps";

export class ProductsSteps extends BaseSteps {
  readonly productsPage: ProductsPage;

  constructor(productsPage: ProductsPage) {
    super();
    this.productsPage = productsPage;
  }

  // Actions
  async getProductsCount(): Promise<number> {
    this.logger.verbose("Getting the number of Products displayed");
    let count: number = 0;

    await test.step("Getting the number of Products displayed", async () => {
      count = await this.productsPage.products.getProductsCount();
    });

    this.logger.verbose(`Found ${count} Products in page`);
    return count;
  }

  async searchProducts(searchTerm: string): Promise<void> {
    this.logger.verbose(`Searching for products with '${searchTerm}'.`);

    await test.step("Searching products", async () => {
      await this.productsPage.searchProducts(searchTerm);
    });

    this.logger.verbose(`Searched for '${searchTerm}'.`);
  }

  // Validations
  validateDisplayedProductsHaveSearchTerm(
    products: ProductType[],
    searchTerm: string,
  ): void {
    this.logger.verbose(
      `Validating displayed Products have the search term '${searchTerm}'.`,
    );
    for (const product of products) {
      expect
        .soft(
          product.name.toLowerCase(),
          `Products should have the search term '${searchTerm}'.`,
        )
        .toContain(searchTerm.toLowerCase());
    }
  }
}
