import { ProductType } from "@data/model/product.model";
import { CartPage } from "@pages/cart.page";
import { expect } from "@playwright/test";
import { BaseSteps } from "@steps/ui/common/base.steps";
import { prettyJson } from "@utils/string.utils";

export class CartSteps extends BaseSteps {
  readonly cartPage: CartPage;

  constructor(cartPage: CartPage) {
    super();
    this.cartPage = cartPage;
  }

  // Actions
  async getCartProducts(): Promise<ProductType[]> {
    return await this.step("Retrieve all products from Cart", async () => {
      return await this.cartPage.cart.getCartItems();
    });
  }

  async removeProducts(products: ProductType[]): Promise<void> {
    await this.step("Remove products from Cart", async () => {
      for (const product of products) {
        expect(
          product.id,
          `Cannot remove product '${product.name}' from cart: missing id.`,
        ).toBeDefined();
        this.logger.verbose(`Removing product: ${prettyJson(product)}`);
        const productId = product.id ?? -1;
        await this.cartPage.cart.removeProduct(productId);
      }
    });
  }

  async proceedToCheckout(): Promise<void> {
    await this.step("Click Proceed to Checkout", async () => {
      await this.cartPage.clickProceedToCheckoutButton();
    });
  }

  async registerUserFromCheckout(): Promise<void> {
    await this.step("Click Register / Login", async () => {
      await this.cartPage.clickRegisterFromCheckoutLink();
    });
  }

  // Validations
  async validateCartItems(
    cartItems: ProductType[],
    addedItems: ProductType[],
    options?: { partial?: boolean },
  ): Promise<void> {
    this.logger.verbose(
      `Validating all (${cartItems.length}) products in cart match all (${addedItems.length}) expected products.`,
    );
    await this.step("Cart items must match added items count", () => {
      expect
        .soft(cartItems, "Cart items must match added items count.")
        .toHaveLength(addedItems.length);
    });
    if (options?.partial === true) {
      await this.step("Validate all products - partial product match", () => {
        for (const item of addedItems) {
          expect
            .soft(
              cartItems.filter(
                (cartItem: ProductType) => cartItem.name === item.name,
              ),
              "Cart items must match added items by name.",
            )
            .toBeTruthy();
        }
      });
    } else {
      await this.step("Cart items must match added items count", () => {
        expect
          .soft(cartItems, "Cart items must match added items.")
          .toEqual(expect.arrayContaining(addedItems));
      });
    }
  }

  async validateProductQuantity(quantity: number): Promise<void> {
    await this.step("Validate product quantity in cart", async () => {
      const product = (await this.cartPage.cart.getCartItems()).at(0);
      expect
        .soft(
          product?.quantity,
          `Product quantity in cart should be ${quantity}.`,
        )
        .toBe(quantity);
    });
  }
}
