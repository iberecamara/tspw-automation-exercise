import { test } from "@fixtures/fixtures";

test.describe(
  "Products page visual regression - UI",
  {
    tag: ["@products", "@ui", "@visual"],
  },
  () => {
    test(
      "Products page visual regression",
      { tag: ["@SAMPLE-0043", "@TC-VISUAL-2"] },
      async ({
        commonSteps,
        headerComponentSteps,
        productsPage,
        visualSteps,
      }) => {
        await commonSteps.navigateHome();
        await headerComponentSteps.clickProducts();
        await visualSteps.validatePageScreenshot(
          "Products",
          "products-header.png",
        );
        await visualSteps.validateElementScreenshot(
          productsPage.locators.productsAdvertisement,
          "Products - Advertisement",
          "products-advertisement.png",
        );
        await visualSteps.validateElementScreenshot(
          productsPage.categories.locators.categoriesAccordian,
          "Products - Categories",
          "products-categories.png",
        );
        await visualSteps.validateElementScreenshot(
          productsPage.brands.locators.brandsContainer,
          "Products - Brands",
          "products-brands.png",
        );
        await visualSteps.validateElementScreenshot(
          productsPage.footer.locators.footerContainer,
          "Products - Footer",
          "products-footer.png",
        );
      },
    );
  },
);
