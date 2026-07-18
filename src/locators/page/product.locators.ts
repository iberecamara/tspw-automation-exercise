import { Locator, Page } from "@playwright/test";

export class ProductLocators {
  readonly productDetailContainer: Locator;
  readonly productQuantityInput: Locator;
  readonly addToCartButton: Locator;
  readonly continueShoppingButton: Locator;
  readonly writeReviewHeading: Locator;
  readonly writeReviewName: Locator;
  readonly writeReviewEmail: Locator;
  readonly writeReviewText: Locator;
  readonly submitReviewButton: Locator;
  readonly reviewSuccessMessage: Locator;

  readonly productId: Locator;
  readonly productName: Locator;
  readonly productCategory: Locator;
  readonly productPrice: Locator;
  readonly productAvailability: Locator;
  readonly productCondition: Locator;
  readonly productBrand: Locator;

  constructor(page: Page) {
    this.productDetailContainer = page.locator(".product-details");
    this.productQuantityInput = page.locator("#quantity");
    this.addToCartButton = page.getByRole("button", { name: " Add to cart" });
    this.continueShoppingButton = page.getByRole("button", {
      name: "Continue Shopping",
    });
    this.writeReviewHeading = page.getByText("Write Your Review");
    this.writeReviewName = page.getByPlaceholder("Your Name", { exact: true });
    this.writeReviewEmail = page.getByPlaceholder("Email Address", {
      exact: true,
    });
    this.writeReviewText = page.getByPlaceholder("Add Review Here!");
    this.submitReviewButton = page.getByRole("button", { name: "Submit" });
    this.reviewSuccessMessage = page.getByText("Thank you for your review.", {
      exact: true,
    });
    this.productId = this.productDetailContainer.locator("#product_id").first();
    this.productName = this.productDetailContainer.locator("h2").first();
    this.productCategory = this.productDetailContainer.locator("p").first();
    this.productPrice = this.productDetailContainer
      .locator("span")
      .first()
      .locator("span")
      .first();
    this.productAvailability = this.productDetailContainer.locator("p").nth(1);
    this.productCondition = this.productDetailContainer.locator("p").nth(2);
    this.productBrand = this.productDetailContainer.locator("p").nth(3);
  }
}
