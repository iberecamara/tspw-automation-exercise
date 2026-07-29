import { ContinueShoppingViewCartComponent } from "@components/continueshopping-viewcart.component";
import { EMPTY, RUPEES } from "@data/constants/constants";
import { ProductType } from "@data/model/product.model";
import { TestAutomationException } from "@exceptions/test-automation.exception";
import { ProductComponentLocators } from "@locators/component/product.component.locators";
import { BasePage } from "@pages.base/base.page";
import { Locator, Page } from "@playwright/test";

/** Implemented by any page object that composes a {@link ProductComponent}, so steps can accept "any page with a product grid" without depending on a specific page class. */
export interface HasProducts {
  products: ProductComponent;
}

/** The reusable product grid/listing fragment (shown on the home, products, category, and brand pages), including the "Continue Shopping" / "View Cart" overlay it composes after adding a product. */
export class ProductComponent extends BasePage {
  readonly locators: ProductComponentLocators;
  readonly continueShoppingViewCartComponent: ContinueShoppingViewCartComponent;

  constructor(page: Page) {
    super(page);
    this.locators = new ProductComponentLocators(page);
    this.continueShoppingViewCartComponent =
      new ContinueShoppingViewCartComponent(page);
  }

  /** @returns The number of products currently rendered in the grid. */
  async getProductsCount(): Promise<number> {
    return await this.locators.products.count();
  }

  /**
   * Reads name and price for every product currently rendered in the grid.
   *
   * @returns Every product in the grid, in display order.
   */
  async getProducts(): Promise<ProductType[]> {
    const products: ProductType[] = [];
    const locators: Locator[] = await this.locators.products.all();
    for (const locator of locators) {
      products.push(await this.getProductDetails({ locator: locator }));
    }
    return products;
  }

  /**
   * Reads name and price for a single product, identified either by an existing `Locator` or by
   * name.
   *
   * @param options.locator - A locator already scoped to the product's grid item.
   * @param options.productName - Exact product name to look up, if `locator` isn't provided.
   * @returns The product's name and price (parsed from its `"Rs. <amount>"` display text).
   * @throws {TestAutomationException} If neither `locator` nor `productName` is provided.
   */
  async getProductDetails(options: {
    locator?: Locator;
    productName?: string;
  }): Promise<ProductType> {
    if (!options.locator && !options.productName) {
      throw new TestAutomationException(
        "Please provide either a locator or a product name.",
      );
    }
    const product: Locator = options.productName
      ? this.locators.productLocator(options.productName)
      : (options.locator ?? this.locators.productLocator(""));
    const price =
      (await this.locators.productPrice(product).textContent()) ?? EMPTY;
    const name =
      (await this.locators.productName(product).textContent()) ?? EMPTY;
    return {
      name: name,
      price: +price.replace(RUPEES, EMPTY),
    };
  }

  /**
   * Clicks "View Product" for the product at the given position, scrolling it into view first.
   *
   * @param productIndex - 1-based position of the product in the grid.
   */
  async clickProductView(productIndex: number): Promise<void> {
    const locator = this.locators.productViewLink(productIndex);
    await locator.scrollIntoViewIfNeeded();
    await this.click(locator);
  }

  /**
   * Hovers a product tile, revealing its "Add to cart" overlay.
   *
   * @param productName - Exact product name to hover.
   */
  async hoverProduct(productName: string): Promise<void> {
    await this.hover(this.locators.productLocator(productName));
  }

  /**
   * Clicks "Add to cart" on a product's hover overlay (requires {@link hoverProduct} to have
   * been called first, so the overlay is visible).
   *
   * @param productName - Exact product name whose overlay to click.
   */
  async clickAddToCartFromHover(productName: string): Promise<void> {
    await this.click(this.locators.productAddFromOverlay(productName));
  }
}
