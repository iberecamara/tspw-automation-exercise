import { BrandsComponent, HasBrands } from "@components/brands.component";
import { CategoriesComponent } from "@components/categories.component";
import { ContinueShoppingViewCartComponent } from "@components/continueshopping-viewcart.component";
import { ProductComponent } from "@components/product.component";
import { BasePage } from "@pages.base/base.page";
import { ProductsLocators } from "@pages.base/locators/page/products.locators";
import { Page } from "@playwright/test";

/** The all-products listing page, with search and brand-filtering (via the {@link BrandsComponent} sidebar). */
export class ProductsPage extends BasePage implements HasBrands {
  readonly locators: ProductsLocators;
  readonly products: ProductComponent;
  readonly continueShoppingViewCart: ContinueShoppingViewCartComponent;
  readonly brands: BrandsComponent;
  readonly categories: CategoriesComponent;

  constructor(page: Page) {
    super(page);
    this.locators = new ProductsLocators(page);
    this.products = new ProductComponent(page);
    this.continueShoppingViewCart = new ContinueShoppingViewCartComponent(page);
    this.brands = new BrandsComponent(page);
    this.categories = new CategoriesComponent(page);
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
}
