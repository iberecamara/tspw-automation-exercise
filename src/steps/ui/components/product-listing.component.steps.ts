import { HasProducts } from "@components/product.component";
import { ProductType } from "@data/model/product.model";
import { faker } from "@faker-js/faker";
import { BaseSteps } from "@steps/base.steps";
import { getRandomElements } from "@utils/arrays.utils";
import { expect } from "playwright/test";

/** Readable, logged steps driving the product grid/listing, reached through any page object implementing {@link HasProducts}. */
export class ProductListingComponentSteps extends BaseSteps {
  // Actions

  /** Hovers a product tile, revealing its "Add to cart" overlay. */
  async hoverProduct(
    pageObject: HasProducts,
    productName: string,
  ): Promise<void> {
    await this.step(`Hover over product '${productName}'`, async () => {
      await pageObject.products.hoverProduct(productName);
    });
  }

  /** Clicks "Add to cart" on a product's hover overlay (requires {@link hoverProduct} to have been called first). */
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

  /**
   * Adds every given product to the cart, one at a time: hover, add from the hover overlay,
   * then dismiss the resulting "added to cart" modal via "Continue Shopping" before moving to
   * the next product.
   */
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

  /**
   * Picks 1-3 random products from a given list (limited to the first 10, i.e. the first grid
   * page), and normalizes each selected product for cart-comparison purposes: sets `quantity`
   * to `1`, sets `totalPrice` to `price` (since quantity is `1`), and removes the `brand` field
   * (not present when the same product is later read back from the cart).
   *
   * @param products - The pool of products to pick from.
   * @returns 1-3 randomly selected, cart-normalized products.
   */
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

  /**
   * Clicks "View Product" for the product at the given position.
   *
   * @param productIndex - 1-based position of the product in the grid.
   */
  async viewProduct(
    pageObject: HasProducts,
    productIndex: number,
  ): Promise<void> {
    await this.step("Click 'View Product'", async () => {
      await pageObject.products.clickProductView(productIndex);
    });
  }

  /** Retrieves every product currently rendered in the grid. */
  async getProducts(pageObject: HasProducts): Promise<ProductType[]> {
    return await this.step("Retrieve all products", async () => {
      return await pageObject.products.getProducts();
    });
  }

  /** Retrieves a single product's name and price by name. */
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

  /** Gets the number of products currently displayed in the grid. */
  async getProductsCount(pageObject: HasProducts): Promise<number> {
    return await this.step("Get the number of Products displayed", async () => {
      return await pageObject.products.getProductsCount();
    });
  }

  /** Clicks "Continue Shopping" in the "added to cart" modal, dismissing it. */
  async continueShopping(pageObject: HasProducts): Promise<void> {
    await this.step("Click Continue Shopping", async () => {
      await pageObject.products.continueShoppingViewCartComponent.clickContinueShopping();
    });
  }

  // Validations

  /** Validates the product count matches an expected count. */
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

  /** Validates every expected product's name is present somewhere in the actual product list (by name only, ignoring other fields). */
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
