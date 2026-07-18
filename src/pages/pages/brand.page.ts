import { BrandsComponent } from "@components/brands.component";
import { ProductComponent } from "@components/product.component";
import { BrandLocators } from "@locators/page/brand.locators";
import { BasePage } from "@pages.base/base.page";
import { Page } from "@playwright/test";

export class BrandPage extends BasePage {
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
