import { BrandsComponent, HasBrands } from "@components/brands.component";
import { HasProducts, ProductComponent } from "@components/product.component";
import { BasePage } from "@pages.base/base.page";
import { BrandLocators } from "@pages.base/locators/page/brand.locators";
import { Page } from "@playwright/test";

/** The brand-filtered products listing page, reached by clicking a brand in the {@link BrandsComponent} sidebar. */
export class BrandPage extends BasePage implements HasBrands, HasProducts {
  readonly locators: BrandLocators;
  readonly brands: BrandsComponent;
  readonly products: ProductComponent;

  constructor(page: Page) {
    super(page);
    this.locators = new BrandLocators(page);
    this.brands = new BrandsComponent(page);
    this.products = new ProductComponent(page);
  }
}
