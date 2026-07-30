import { Locator, Page } from "@playwright/test";

/** Raw `Locator` definitions for the shared brands sidebar, used by `BrandsComponent`. */
export class BrandsComponentLocators {
  readonly brandsContainer: Locator;
  readonly brandsHeading: Locator;
  readonly brandsLinks: Locator;
  readonly brands: Locator;
  readonly brandByName: (brand: string) => Locator;

  constructor(page: Page) {
    this.brandsContainer = page.locator(".brands_products");
    this.brandsHeading = page.getByText("Brands");
    this.brandsLinks = page.locator(".brands-name");
    this.brandByName = (brand: string) => {
      return page.getByRole("link", { name: brand });
    };
    this.brands = this.brandsLinks.getByRole("link");
  }
}
