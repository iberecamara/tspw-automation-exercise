import { ProductType } from "@data/model/product.model";
import { ProductsPage } from "@pages/products.page";
import { expect } from "@playwright/test";
import { BaseSteps } from "@steps/base.steps";

/** Readable, logged steps driving {@link ProductsPage}. */
export class ProductsSteps extends BaseSteps {
  readonly productsPage: ProductsPage;

  constructor(productsPage: ProductsPage) {
    super();
    this.productsPage = productsPage;
  }

  // Actions

  /** Gets the number of products currently displayed in the grid. */
  async getProductsCount(): Promise<number> {
    return await this.step("Get the number of Products displayed", async () => {
      return await this.productsPage.products.getProductsCount();
    });
  }

  /** Searches for products by search term. */
  async searchProducts(searchTerm: string): Promise<void> {
    this.logger.verbose(`Searching for products with '${searchTerm}'.`);
    await this.step("Search products", async () => {
      await this.productsPage.searchProducts(searchTerm);
    });
  }

  // Validations

  /** Validates every given product's name contains the given search term (case-insensitive). */
  async validateDisplayedProductsHaveSearchTerm(
    products: ProductType[],
    searchTerm: string,
  ): Promise<void> {
    await this.step(
      `Validate displayed Products have the search term '${searchTerm}'.`,
      () => {
        for (const product of products) {
          expect
            .soft(
              product.name.toLowerCase(),
              `Products should have the search term '${searchTerm}'.`,
            )
            .toContain(searchTerm.toLowerCase());
        }
      },
    );
  }
}
