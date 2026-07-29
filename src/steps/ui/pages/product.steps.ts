import { ProductType } from "@data/model/product.model";
import { ProductPage } from "@pages/product.page";
import { expect } from "@playwright/test";
import { BaseSteps } from "@steps/base.steps";
import { prettyJson } from "@utils/string.utils";

/** Readable, logged steps driving {@link ProductPage}. */
export class ProductSteps extends BaseSteps {
  readonly productPage: ProductPage;

  constructor(productPage: ProductPage) {
    super();
    this.productPage = productPage;
  }

  // Actions

  /** Sets the product quantity. */
  async setProductQuantity(quantity: number): Promise<void> {
    await this.step(`Set product quantity to ${quantity}`, async () => {
      await this.productPage.setQuantity(quantity);
    });
  }

  /** Adds the product to the cart. */
  async addToCart(): Promise<void> {
    await this.step("Add product to cart", async () => {
      await this.productPage.clickAddToCart();
    });
  }

  /** Navigates to the cart from the "added to cart" modal. */
  async viewCart(): Promise<void> {
    await this.step("Navigating to Cart from modal", async () => {
      await this.productPage.continueShoppingViewCart.clickViewCart();
    });
  }

  /** Retrieves the product's full details from the page. */
  async productDetails(): Promise<ProductType> {
    return await this.step("Retrieve product details", async () => {
      return await this.productPage.getProductDetails();
    });
  }

  /** Fills the review form's name field. */
  async enterReviewName(name: string): Promise<void> {
    await this.step(`Add '${name}' name to review.`, async () => {
      await this.productPage.enterReviewName(name);
    });
  }

  /** Fills the review form's email field. */
  async enterReviewEmail(email: string): Promise<void> {
    await this.step(`Add '${email}' email to review.`, async () => {
      await this.productPage.enterReviewEmail(email);
    });
  }

  /** Fills the review form's message field. */
  async enterReviewText(text: string): Promise<void> {
    await this.step(`Add '${text}' text to review.`, async () => {
      await this.productPage.enterReviewText(text);
    });
  }

  /** Submits the write-a-review form. */
  async submitReview(): Promise<void> {
    await this.step("Click Submit in review", async () => {
      await this.productPage.submitReview();
    });
  }

  // Validations

  /** Validates a retrieved product's details strictly match another (typically the product as seen in a listing, compared against its own detail page). */
  async validateProductDetails(
    firstProduct: ProductType,
    productDetails: ProductType,
  ): Promise<void> {
    this.logger.verbose(
      "Validating that retrieved product matches the first product.",
    );
    this.logger.verbose(`First product: ${prettyJson(firstProduct)}`);
    this.logger.verbose(`Retrieved product: ${prettyJson(productDetails)}`);
    await this.step(
      "Validate that retrieved product matches the first product",
      () => {
        expect
          .soft(
            productDetails,
            "Retrieved product should match the first product",
          )
          .toStrictEqual(firstProduct);
      },
    );
  }

  /** Validates the review success message is displayed with the expected text. */
  async validateReviewSuccessMessage(): Promise<void> {
    await this.step(
      "Validate that review success message is displayed",
      async () => {
        await expect
          .soft(
            this.productPage.locators.reviewSuccessMessage,
            "Review success message should be displayed",
          )
          .toBeVisible();
        const message = "Thank you for your review.";
        await expect
          .soft(
            this.productPage.locators.reviewSuccessMessage,
            `Review success message should be '${message}'`,
          )
          .toHaveText(message);
      },
    );
  }
}
