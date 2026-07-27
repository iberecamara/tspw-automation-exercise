import { HasProducts } from "@components/product.component";
import { ProductType } from "@data/model/product.model";
import { faker } from "@faker-js/faker";
import { BaseSteps } from "@steps/ui/common/base.steps";
import { getRandomElements } from "@utils/arrays.utils";
import { expect } from "playwright/test";

export class ProductListingComponentSteps extends BaseSteps {
  // Actions
  async hoverProduct(
    pageObject: HasProducts,
    productName: string,
  ): Promise<void> {
    await this.step(`Hover over product '${productName}'`, async () => {
      await pageObject.products.hoverProduct(productName);
    });
  }

  async addProductToCartFromHover(
    pageObject: HasProducts,
    productName: string,
  ): Promise<void> {
    await this.step(
      `Add product '${productName}' to cart from hover overlay.`,
      async () => {
        await pageObject.products.clickAddToCartFromHover(productName);
      },
    );
  }

  async addProductsToCart(
    pageObject: HasProducts,
    products: ProductType[],
  ): Promise<void> {
    await this.step(`Adding ${products.length} products to cart.`, async () => {
      for (const product of products) {
        await this.hoverProduct(pageObject, product.name);
        await this.addProductToCartFromHover(pageObject, product.name);
        await this.continueShopping(pageObject);
      }
    });
  }

  async selectRandomProducts(products: ProductType[]): Promise<ProductType[]> {
    const quantity = faker.number.int({ min: 1, max: 3 });
    return await this.step(
      `Selecting ${quantity} products from the list.`,
      () => {
        const selectedProducts: ProductType[] = [];
        const count = 1;
        selectedProducts.push(
          ...getRandomElements(products, {
            quantity: quantity,
            indexLimit: 10,
          }),
        );
        this.logger.verbose(`Adding ${count} to each product quantity.`);
        this.logger.verbose(
          `Adding ${count} times product price to each product total price.`,
        );
        this.logger.verbose(
          `Removing unecessary 'brand' field from each product to match validations.`,
        );
        for (const product of selectedProducts) {
          product.quantity = 1;
          product.totalPrice = 1 * product.price;
          delete product.brand;
        }
        return selectedProducts;
      },
    );
  }

  async viewProduct(
    pageObject: HasProducts,
    productIndex: number,
  ): Promise<void> {
    await this.step("Click 'View Product'", async () => {
      await pageObject.products.clickProductView(productIndex);
    });
  }

  async getProducts(pageObject: HasProducts): Promise<ProductType[]> {
    return await this.step("Retrieve all products", async () => {
      return await pageObject.products.getProducts();
    });
  }

  async getProductDetails(
    pageObject: HasProducts,
    productName: string,
  ): Promise<ProductType> {
    return await this.step(
      `Retrieve product details for '${productName}'`,
      async () => {
        return await pageObject.products.getProductDetails({
          productName: productName,
        });
      },
    );
  }

  async getProductsCount(pageObject: HasProducts): Promise<number> {
    return await this.step("Get the number of Products displayed", async () => {
      return await pageObject.products.getProductsCount();
    });
  }

  async continueShopping(pageObject: HasProducts): Promise<void> {
    await this.step("Click Continue Shopping", async () => {
      await pageObject.products.continueShoppingViewCartComponent.clickContinueShopping();
    });
  }

  // Validations
  async validateProductsCount(
    count: number,
    expectedCount: number,
  ): Promise<void> {
    await this.step(
      "Validate that Products page have the expected amout of products",
      () => {
        expect
          .soft(
            count,
            "Products page should have the expected amout of products",
          )
          .toBe(expectedCount);
      },
    );
  }

  async validateProductsByName(
    products: ProductType[],
    expectedProducts: ProductType[],
  ): Promise<void> {
    await this.step("Validate that list of Products match by name", () => {
      for (const expectedProduct of expectedProducts) {
        expect
          .soft(
            products.filter(
              (product: ProductType) => product.name === expectedProduct.name,
            ),
            "Products names must match",
          )
          .toBeTruthy();
      }
    });
  }
}
