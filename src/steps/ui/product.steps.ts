import { ProductType } from "@data/model/product.model";
import { test } from "@fixtures/fixtures";
import { ProductPage } from "@pages/product.page";
import { expect } from "@playwright/test";
import { BaseSteps } from "@steps/base.steps";
import { StringUtils } from "@utils/string.utils";

export class ProductSteps extends BaseSteps {
  readonly productPage: ProductPage;

  constructor(productPage: ProductPage) {
    super();
    this.productPage = productPage;
  }

  // Actions
  async setProductQuantity(quantity: number): Promise<void> {
    this.logger.verbose(`Setting product quantity to ${quantity}`);

    await test.step("Set product quantity", async () => {
      await this.productPage.setQuantity(quantity);
    });

    this.logger.verbose(`Set product quantity to ${quantity}`);
  }

  async addToCart(): Promise<void> {
    this.logger.verbose("Adding product to cart");

    await test.step("Add product to cart", async () => {
      await this.productPage.clickAddToCart();
    });

    this.logger.verbose("Added product to cart");
  }

  async viewCart(): Promise<void> {
    this.logger.verbose("Clicking View Cart");

    await test.step("Navigating to cart from modal", async () => {
      await this.productPage.continueShoppingViewCart.clickViewCart();
    });

    this.logger.verbose("Clicked View Cart");
  }

  async productDetails(): Promise<ProductType> {
    this.logger.verbose("Retrieving product details");
    let product = {} as ProductType;

    await test.step("Retrieve product details", async () => {
      product = await this.productPage.getProductDetails();
    });

    this.logger.verbose("Retrieved product details");
    return product;
  }

  async enterReviewName(name: string): Promise<void> {
    this.logger.verbose(`Adding '${name}' name to review.`);

    await test.step(`Add '${name}' name to review.`, async () => {
      await this.productPage.enterReviewName(name);
    });

    this.logger.verbose(`Added '${name}' name to review.`);
  }

  async enterReviewEmail(email: string): Promise<void> {
    this.logger.verbose(`Adding '${email}' email to review.`);

    await test.step(`Add '${email}' email to review.`, async () => {
      await this.productPage.enterReviewEmail(email);
    });

    this.logger.verbose(`Added '${email}' email to review.`);
  }

  async enterReviewText(text: string): Promise<void> {
    this.logger.verbose(`Adding '${text}' text to review.`);

    await test.step(`Add '${text}' text to review.`, async () => {
      await this.productPage.enterReviewText(text);
    });

    this.logger.verbose(`Added '${text}' text to review.`);
  }

  async submitReview(): Promise<void> {
    this.logger.verbose("Clicking Submit in review");

    await test.step("Click Submit in review", async () => {
      await this.productPage.submitReview();
    });

    this.logger.verbose("Clicked Submit in review");
  }

  // Validations
  async validateProductDetails(
    firstProduct: ProductType,
    productDetails: ProductType,
  ): Promise<void> {
    this.logger.verbose(
      "Validating that retrieved product matches the first product.",
    );
    this.logger.verbose(`First product: ${StringUtils.prettyJson(firstProduct)}`);
    this.logger.verbose(
      `Retrieved product: ${StringUtils.prettyJson(productDetails)}`,
    );

    await test.step("Validate that retrieved product matches the first product", () => {
      expect
        .soft(
          productDetails,
          "Retrieved product should match the first product",
        )
        .toStrictEqual(firstProduct);
    });
  }

  async validateReviewSuccessMessage(): Promise<void> {
    this.logger.verbose("Validating that review success message is displayed.");

    await test.step("Validat that review success message is displayed", async () => {
      await expect
        .soft(
          this.productPage.locators.reviewSuccessMessage,
          "Review success message should be displayed",
        )
        .toBeVisible();
    });
  }
}
