import { HasBrands } from "@components/brands.component";
import { expect, Page } from "@playwright/test";
import { BaseSteps } from "@steps/ui/common/base.steps";

export class BrandComponentSteps extends BaseSteps {
  readonly page: Page;

  constructor(page: Page) {
    super();
    this.page = page;
  }

  // Actions
  async selectBrand(pageObject: HasBrands, brand: string): Promise<void> {
    await this.step(`Selecting ${brand} brand`, async () => {
      await pageObject.brands.selectBrand(brand);
    });
  }

  async getBrands(pageObject: HasBrands): Promise<string[]> {
    return await this.step("Retrieve Brands", async () => {
      return await pageObject.brands.getBrands();
    });
  }

  // Validations
  async validateBrandSection(pageObject: HasBrands): Promise<void> {
    await this.step(
      "Validate that Brand Section have the expected heading",
      async () => {
        await expect
          .soft(
            pageObject.brands.locators.brandsHeading,
            "Brands heading should be displayed.",
          )
          .toBeVisible();
        const headingText = "Brands";
        await expect
          .soft(
            pageObject.brands.locators.brandsHeading,
            `Brands heading text should be '${headingText}'`,
          )
          .toHaveText(headingText);
      },
    );
  }

  async validateBrandPageHeading(brand: string): Promise<void> {
    await this.step(`Validate Brand heading for ${brand}.`, async () => {
      const headingText = `Brand - ${brand} Products`;
      await expect
        .soft(
          this.page.getByText(headingText),
          `Brand page heading should match the expected '${headingText}'.`,
        )
        .toBeVisible();
    });
  }
}
