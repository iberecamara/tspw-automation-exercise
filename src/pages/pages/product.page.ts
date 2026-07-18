import { ContinueShoppingViewCartComponent } from "@components/continueshopping-viewcart.component";
import { ProductComponent } from "@components/product.component";
import {
  AVAILABILITY_PREFIX,
  BRAND_PREFIX,
  CATEGORY_DELIMITER,
  CATEGORY_PREFIX,
  CONDITION_PREFIX,
  EMPTY,
  RUPEES,
} from "@data/constants/constants";
import { ProductCategoryType } from "@data/model/product-category.model";
import { ProductType } from "@data/model/product.model";
import { ProductLocators } from "@locators/page/product.locators";
import { BasePage } from "@pages.base/base.page";
import { Page } from "@playwright/test";

export class ProductPage extends BasePage {
  readonly locators: ProductLocators;
  readonly products: ProductComponent;
  readonly continueShoppingViewCart: ContinueShoppingViewCartComponent;

  constructor(page: Page) {
    super(page);
    this.locators = new ProductLocators(page);
    this.products = new ProductComponent(page);
    this.continueShoppingViewCart = new ContinueShoppingViewCartComponent(page);
  }

  async getProductDetails(): Promise<ProductType> {
    const id = (await this.locators.productId.getAttribute("value")) ?? EMPTY;
    const name = (await this.locators.productName.textContent()) ?? EMPTY;
    let rawCategory =
      (await this.locators.productCategory.textContent()) ?? EMPTY;
    rawCategory = rawCategory.replace(CATEGORY_PREFIX, EMPTY);
    const category: ProductCategoryType = {
      usertype: {
        usertype: rawCategory.slice(0, rawCategory.indexOf(CATEGORY_DELIMITER)),
      },
      category: rawCategory.slice(
        rawCategory.indexOf(CATEGORY_DELIMITER) + CATEGORY_DELIMITER.length,
      ),
    };
    const price = (await this.locators.productPrice.textContent()) ?? EMPTY;
    const availability =
      (await this.locators.productAvailability.textContent()) ?? EMPTY;
    const condition =
      (await this.locators.productCondition.textContent()) ?? EMPTY;
    const brand = (await this.locators.productBrand.textContent()) ?? EMPTY;
    return {
      id: +id,
      name: name,
      category: category,
      price: +price.replace(RUPEES, EMPTY),
      availability: availability.replace(AVAILABILITY_PREFIX, EMPTY),
      condition: condition.replace(CONDITION_PREFIX, EMPTY),
      brand: brand.replace(BRAND_PREFIX, EMPTY),
    };
  }

  async setQuantity(quantity: number): Promise<void> {
    await this.fill(this.locators.productQuantityInput, quantity.toString());
  }

  async clickAddToCart(): Promise<void> {
    await this.click(this.locators.addToCartButton);
  }

  async enterReviewName(name: string): Promise<void> {
    await this.fill(this.locators.writeReviewName, name);
  }

  async enterReviewEmail(email: string): Promise<void> {
    await this.fill(this.locators.writeReviewEmail, email);
  }

  async enterReviewText(text: string): Promise<void> {
    await this.fill(this.locators.writeReviewText, text);
  }

  async submitReview(): Promise<void> {
    await this.click(this.locators.submitReviewButton);
  }
}
