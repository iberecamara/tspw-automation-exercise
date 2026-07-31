import { test } from "@fixtures/fixtures";

test.describe(
  "Home page visual regression - UI",
  {
    tag: ["@home", "@ui", "@visual"],
  },
  () => {
    test(
      "Home page visual regression",
      { tag: ["@SAMPLE-0042", "@TC-VISUAL-1"] },
      async ({ homePage, commonSteps, visualSteps }) => {
        await commonSteps.navigateHome();
        await visualSteps.validatePageScreenshot("Home", "home-header.png");
        await visualSteps.validateElementScreenshot(
          homePage.categories.locators.categoriesAccordian,
          "Home - Categories",
          "home-categories.png",
        );
        await visualSteps.validateElementScreenshot(
          homePage.brands.locators.brandsContainer,
          "Home - Brands",
          "home-brands.png",
        );
        await visualSteps.validateElementScreenshot(
          homePage.footer.locators.footerContainer,
          "Home - Footer",
          "home-footer.png",
        );
      },
    );
  },
);
