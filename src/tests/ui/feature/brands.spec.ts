import { ProductType } from "@data/model/product.model";
import { test } from "@fixtures/fixtures";
import { getRandomElement } from "@utils/arrays.utils";

test.describe(
  "Brands validations - UI",
  {
    tag: ["@brands", "@ui"],
  },
  () => {
    test(
      "View & Cart Brand Products",
      { tag: ["@SAMPLE-0020", "@TC-UI-19"] },
      async ({
        commonSteps,
        productsPage,
        brandPage,
        productApiSteps,
        headerComponentSteps,
        brandComponentSteps,
        productListingComponentSteps,
      }) => {
        await commonSteps.navigateHome();
        await commonSteps.validateTitle("Home");
        await headerComponentSteps.clickProducts();
        await brandComponentSteps.validateBrandSection(productsPage);
        let brands = await brandComponentSteps.getBrands(productsPage);
        let selectedBrand = getRandomElement(brands);
        await brandComponentSteps.selectBrand(productsPage, selectedBrand);
        await commonSteps.validateTitleDirectly(
          "Brand",
          `Automation Exercise - ${selectedBrand} Products`,
        );
        await brandComponentSteps.validateBrandPageHeading(selectedBrand);
        let products =
          await productListingComponentSteps.getProducts(brandPage);
        let apiProducts = (await productApiSteps.all({
          brand: selectedBrand,
        })) as ProductType[];
        await productListingComponentSteps.validateProductsByName(
          products,
          apiProducts,
        );
        brands = await brandComponentSteps.getBrands(productsPage);
        selectedBrand = getRandomElement(brands, {
          exclude: [selectedBrand],
        });
        await brandComponentSteps.selectBrand(productsPage, selectedBrand);
        await commonSteps.validateTitleDirectly(
          "Brand",
          `Automation Exercise - ${selectedBrand} Products`,
        );
        await brandComponentSteps.validateBrandPageHeading(selectedBrand);
        products = await productListingComponentSteps.getProducts(brandPage);
        apiProducts = (await productApiSteps.all({
          brand: selectedBrand,
        })) as ProductType[];
        await productListingComponentSteps.validateProductsByName(
          products,
          apiProducts,
        );
      },
    );
  },
);
