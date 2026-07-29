import { Locator, Page } from "@playwright/test";

/** Raw `Locator` definitions for the shared brands sidebar, used by `BrandsComponent`. */
export class BrandsComponentLocators {
  readonly brandsHeading: Locator;
  readonly brandsContainer: Locator;
  readonly brands: Locator;
  readonly brandByName: (brand: string) => Locator;

  constructor(page: Page) {
    this.brandsHeading = page.getByText("Brands");
    this.brandsContainer = page.locator(".brands-name");
    this.brandByName = (brand: string) => {
      return page.getByRole("link", { name: brand });
    };
    this.brands = this.brandsContainer.getByRole("link");
  }
}
