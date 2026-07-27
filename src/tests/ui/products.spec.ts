import { ProductType } from "@data/model/product.model";
import { test } from "@fixtures/fixtures";
import { getRandomElement } from "@utils/arrays.utils";
import { generateRandomText, prettyJson } from "@utils/string.utils";

test.describe(
  "Products page validations - UI",
  {
    tag: ["@products", "@ui"],
  },
  () => {
    test(
      "Verify All Products and product detail page",
      { tag: ["@SAMPLE-0007", "@TC-UI-8"] },
      async ({
        homePage,
        productsSteps,
        productsPage,
        productSteps,
        commonSteps,
        headerComponentSteps,
        productListingComponentSteps,
      }) => {
        await commonSteps.navigateHome(homePage);
        await commonSteps.validateTitle("Home");
        await headerComponentSteps.clickProducts(homePage.header);
        await commonSteps.validateTitle("Products");
        const count = await productsSteps.getProductsCount();
        const expectedCount = 34;
        await productListingComponentSteps.validateProductsCount(
          count,
          expectedCount,
        );
        const firstProduct: ProductType = {
          id: 1,
          name: "Blue Top",
          category: {
            usertype: { usertype: "Women" },
            category: "Tops",
          },
          price: 500,
          availability: "In Stock",
          condition: "New",
          brand: "Polo",
        };
        await productListingComponentSteps.viewProduct(
          productsPage,
          firstProduct.id ?? -1,
        );
        const productDetails: ProductType = await productSteps.productDetails();
        await productSteps.validateProductDetails(firstProduct, productDetails);
      },
    );

    test(
      "Search Product",
      { tag: ["@SAMPLE-0008", "@TC-UI-9", "@search-products"] },
      async ({
        homePage,
        productsSteps,
        productsPage,
        commonSteps,
        headerComponentSteps,
        productListingComponentSteps,
      }) => {
        await commonSteps.navigateHome(homePage);
        await commonSteps.validateTitle("Home");
        await headerComponentSteps.clickProducts(homePage.header);
        await commonSteps.validateTitle("Products");
        const searchTerm = "blue";
        await productsSteps.searchProducts(searchTerm);
        const products: ProductType[] =
          await productListingComponentSteps.getProducts(productsPage);
        await productsSteps.validateDisplayedProductsHaveSearchTerm(
          products,
          searchTerm,
        );
      },
    );

    test(
      "Add review on Product",
      { tag: ["@SAMPLE-0022", "@TC-UI-21", "@review"] },
      async ({
        homePage,
        productSteps,
        productsPage,
        commonSteps,
        productApiSteps,
        logger,
        unregisteredUser,
        headerComponentSteps,
        productListingComponentSteps,
      }) => {
        await commonSteps.navigateHome(homePage);
        await commonSteps.validateTitle("Home");
        await headerComponentSteps.clickProducts(homePage.header);
        await commonSteps.validateTitle("Products");
        const apiProducts = (await productApiSteps.all()) as ProductType[];
        const selectedProduct = getRandomElement(apiProducts);
        logger.info(prettyJson(selectedProduct));
        await productListingComponentSteps.viewProduct(
          productsPage,
          selectedProduct.id ?? -1,
        );
        const review: string = generateRandomText({ words: 10 });
        await productSteps.enterReviewName(unregisteredUser.name);
        await productSteps.enterReviewEmail(unregisteredUser.email);
        await productSteps.enterReviewText(review);
        await productSteps.submitReview();
        await productSteps.validateReviewSuccessMessage();
      },
    );
  },
);
