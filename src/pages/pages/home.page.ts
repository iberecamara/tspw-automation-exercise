import { BrandsComponent, HasBrands } from "@components/brands.component";
import {
  CategoriesComponent,
  HasCategories,
} from "@components/categories.component";
import { ContinueShoppingViewCartComponent } from "@components/continueshopping-viewcart.component";
import { HeaderComponent } from "@components/header.component";
import { HasProducts, ProductComponent } from "@components/product.component";
import { SubscriptionComponent } from "@components/subscription.component";
import { RUPEES } from "@data/constants/common.constants";
import { EMPTY } from "@data/constants/string.constants";
import { ProductType } from "@data/model/product.model";
import { BasePage } from "@pages.base/base.page";
import { HomeLocators } from "@pages.base/locators/page/home.locators";
import { Locator, Page } from "@playwright/test";

/**
 * The site's home page — composes the header, subscription box, product grid, categories
 * sidebar, and brands sidebar (all shared components), plus its own recommended-items carousel
 * and scroll-to-top control.
 */
export class HomePage
  extends BasePage
  implements HasBrands, HasProducts, HasCategories
{
  readonly locators: HomeLocators;
  readonly header: HeaderComponent;
  readonly subscription: SubscriptionComponent;
  readonly products: ProductComponent;
  readonly continueShoppingViewCart: ContinueShoppingViewCartComponent;
  readonly categories: CategoriesComponent;
  readonly brands: BrandsComponent;

  constructor(page: Page) {
    super(page);
    this.locators = new HomeLocators(page);
    this.header = new HeaderComponent(page);
    this.subscription = new SubscriptionComponent(page);
    this.products = new ProductComponent(page);
    this.continueShoppingViewCart = new ContinueShoppingViewCartComponent(page);
    this.categories = new CategoriesComponent(page);
    this.brands = new BrandsComponent(page);
  }

  /**
   * Reads every item in the home page's "recommended items" carousel.
   *
   * @returns Every recommended product (id, name, price), in carousel order.
   */
  async getRecommendedItems(): Promise<ProductType[]> {
    const recommendedItems: ProductType[] = [];
    const recommendedItemsLocators: Locator[] =
      await this.locators.recommendedItemsProducts.all();
    for (const locator of recommendedItemsLocators) {
      const product: ProductType = await this.parseRecommendedItem(locator);
      recommendedItems.push(product);
    }
    return recommendedItems;
  }

  /** Parses a single recommended-items carousel entry into a {@link ProductType}. */
  private async parseRecommendedItem(locator: Locator): Promise<ProductType> {
    const id =
      (await this.locators
        .recommendedProductsId(locator)
        .getAttribute("data-product-id")) ?? EMPTY;
    const name =
      (await this.locators.recommendedProductsName(locator).textContent()) ??
      EMPTY;
    const price =
      (await this.locators.recommendedProductsPrice(locator).textContent()) ??
      EMPTY;
    return {
      id: +id,
      name: name,
      price: +price.replaceAll(RUPEES, EMPTY),
    };
  }

  /**
   * Clicks "Add to cart" for a recommended-items carousel entry, identified by product id.
   *
   * @param item - The recommended product to add (only `item.id` is used).
   */
  async addRecommendedItem(item: ProductType): Promise<void> {
    await this.click(this.locators.addRecommendedItem(item.id ?? -1));
  }

  /**
   * Waits for the scroll-up control to appear, clicks it, and waits for the page's subheading to
   * be visible again — confirming the page actually scrolled back to the top.
   */
  async clickScrollUp(): Promise<void> {
    await this.locators.scrollUpButton.waitFor({ state: "visible" });
    await this.click(this.locators.scrollUpButton);
    await this.locators.subheading.waitFor({ state: "visible" });
  }
}
