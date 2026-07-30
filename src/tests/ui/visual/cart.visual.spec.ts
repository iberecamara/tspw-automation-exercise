import { test } from "@fixtures/fixtures";

test.describe(
  "Cart page visual regression - UI",
  {
    tag: ["@cart", "@ui", "@visual"],
  },
  () => {
    test(
      "Cart page visual regression",
      { tag: ["@SAMPLE-0044", "@TC-VISUAL-3"] },
      async ({ commonSteps, headerComponentSteps, cartPage, visualSteps }) => {
        await commonSteps.navigateHome();
        await headerComponentSteps.clickCart();
        await visualSteps.validatePageScreenshot("Cart", "cart-header.png");
        await visualSteps.validateElementScreenshot(
          cartPage.cart.locators.cartItemsTable,
          "Cart - Cart Items",
          "cart-cart-items.png",
        );
        await visualSteps.validateElementScreenshot(
          cartPage.footer.locators.footerContainer,
          "Cart - Footer",
          "cart-footer.png",
        );
      },
    );
  },
);
