import { ProductType } from "@data/model/product.model";
import { ProductsPage } from "@pages/products.page";
import { expect } from "@playwright/test";
import { BaseSteps } from "@steps/ui/common/base.steps";

export class ProductsSteps extends BaseSteps {
  readonly productsPage: ProductsPage;

  constructor(productsPage: ProductsPage) {
    super();
    this.productsPage = productsPage;
  }

  // Actions
  async getProductsCount(): Promise<number> {
    return await this.step("Get the number of Products displayed", async () => {
      return await this.productsPage.products.getProductsCount();
    });
  }

  async searchProducts(searchTerm: string): Promise<void> {
    this.logger.verbose(`Searching for products with '${searchTerm}'.`);
    await this.step("Search products", async () => {
      await this.productsPage.searchProducts(searchTerm);
    });
  }

  // Validations
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
