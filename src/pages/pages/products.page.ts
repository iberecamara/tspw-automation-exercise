import { BrandsComponent, HasBrands } from "@components/brands.component";
import { ContinueShoppingViewCartComponent } from "@components/continueshopping-viewcart.component";
import { HeaderComponent } from "@components/header.component";
import { ProductComponent } from "@components/product.component";
import { BasePage } from "@pages.base/base.page";
import { ProductsLocators } from "@pages.base/locators/page/products.locators";
import { expect, Page } from "@playwright/test";

/** The all-products listing page, with search and brand-filtering (via the {@link BrandsComponent} sidebar). */
export class ProductsPage extends BasePage implements HasBrands {
  readonly locators: ProductsLocators;
  readonly header: HeaderComponent;
  readonly products: ProductComponent;
  readonly continueShoppingViewCart: ContinueShoppingViewCartComponent;
  readonly brands: BrandsComponent;

  constructor(page: Page) {
    super(page);
    this.locators = new ProductsLocators(page);
    this.header = new HeaderComponent(page);
    this.products = new ProductComponent(page);
    this.continueShoppingViewCart = new ContinueShoppingViewCartComponent(page);
    this.brands = new BrandsComponent(page);
  }

  /**
   * Fills the search box and submits the search.
   *
   * @param terms - Search terms to enter.
   */
  async searchProducts(terms: string): Promise<void> {
    await this.fill(this.locators.searchProductsInput, terms);
    await this.click(this.locators.searchProductsButton);
  }

  /** Waits for and clicks this page's own "Continue Shopping" button (distinct from the one on `ContinueShoppingViewCartComponent`, which lives inside the "added to cart" modal). */
  async clickContinueShopping(): Promise<void> {
    await expect(this.locators.continueShoppingButton).toBeVisible();
    await this.click(this.locators.continueShoppingButton);
  }
}
