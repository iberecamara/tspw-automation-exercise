import { EMPTY } from "@data/constants/string.constants";
import { BrandsComponentLocators } from "@locators/component/brands.component.locators";
import { BasePage } from "@pages.base/base.page";
import { Page } from "@playwright/test";

/** Implemented by any page object that composes a {@link BrandsComponent}, so steps can accept "any page with a brands sidebar" without depending on a specific page class. */
export interface HasBrands {
  brands: BrandsComponent;
}

/** The brands sidebar (shown on the products/category/brand listing pages), listing every brand with a link to filter products by it. */
export class BrandsComponent extends BasePage {
  readonly locators: BrandsComponentLocators;

  constructor(page: Page) {
    super(page);
    this.locators = new BrandsComponentLocators(page);
  }

  /**
   * Reads every brand name currently listed in the sidebar, stripping leading whitespace and
   * any trailing parenthesized product count (e.g. `"Polo (5)"` → `"Polo"`).
   *
   * @returns The brand names, in display order.
   */
  async getBrands(): Promise<string[]> {
    const brands: string[] = [];
    const brandsLocators = await this.locators.brands.all();
    for (const locator of brandsLocators) {
      const text = (await locator.textContent()) ?? EMPTY;
      if (text) {
        brands.push(text.replace(/^\s+/, EMPTY).replace(/\(.*?\)/, EMPTY));
      }
    }
    return brands;
  }

  /**
   * Clicks a brand in the sidebar, navigating to that brand's filtered product listing.
   *
   * @param brand - Exact brand name to select.
   */
  async selectBrand(brand: string): Promise<void> {
    await this.click(this.locators.brandByName(brand));
  }
}
