import { SPACE } from "@data/constants/string.constants";
import { ProductType } from "@data/model/product.model";
import { test } from "@fixtures/fixtures";
import { getRandomElement } from "@utils/arrays.utils";

test.describe(
  "Cart validations - UI",
  {
    tag: ["@products", "@cart", "@ui"],
  },
  () => {
    test(
      "Add Products in Cart",
      { tag: ["@SAMPLE-0010", "@TC-UI-12"] },
      async ({
        homePage,
        productsPage,
        commonSteps,
        cartSteps,
        headerComponentSteps,
        productListingComponentSteps,
      }) => {
        await commonSteps.navigateHome(homePage);
        await commonSteps.validateTitle("Home");
        await headerComponentSteps.clickProducts(homePage.header);
        await commonSteps.validateTitle("Products");

        const quantity = 1;

        const firstProductName = "Blue Top";
        const firstProductData: ProductType =
          await productListingComponentSteps.getProductDetails(
            productsPage,
            firstProductName,
          );
        firstProductData.id = 1;
        firstProductData.quantity = quantity;
        firstProductData.category = {
          usertype: { usertype: "Women" },
          category: "Tops",
        };
        firstProductData.totalPrice =
          firstProductData.quantity * firstProductData.price;
        const secondProductName = "Men Tshirt";
        const secondProductData: ProductType =
          await productListingComponentSteps.getProductDetails(
            productsPage,
            secondProductName,
          );
        secondProductData.id = 2;
        secondProductData.quantity = quantity;
        secondProductData.category = {
          usertype: { usertype: "Men" },
          category: "Tshirts",
        };
        secondProductData.totalPrice =
          secondProductData.quantity * secondProductData.price;
        await productListingComponentSteps.hoverProduct(
          productsPage,
          firstProductName,
        );
        await productListingComponentSteps.addProductToCartFromHover(
          productsPage,
          firstProductName,
        );
        await productListingComponentSteps.continueShopping(productsPage);
        await productListingComponentSteps.hoverProduct(
          productsPage,
          secondProductName,
        );
        await productListingComponentSteps.addProductToCartFromHover(
          productsPage,
          secondProductName,
        );
        await productListingComponentSteps.continueShopping(productsPage);
        await headerComponentSteps.clickCart(productsPage.header);
        const items = await cartSteps.getCartProducts();
        await cartSteps.validateCartItems(items, [
          firstProductData,
          secondProductData,
        ]);
      },
    );

    test(
      "Verify Product quantity in Cart",
      { tag: ["@SAMPLE-0011", "@TC-UI-13"] },
      async ({
        homePage,
        productSteps,
        commonSteps,
        cartSteps,
        productApiSteps,
        productListingComponentSteps,
      }) => {
        await commonSteps.navigateHome(homePage);
        await commonSteps.validateTitle("Home");
        const products = (await productApiSteps.all()) as ProductType[];
        const randomProduct = getRandomElement(products);
        await productListingComponentSteps.viewProduct(
          homePage,
          randomProduct.id ?? -1,
        );
        await commonSteps.validateTitle("Product");
        const quantity = 4;
        await productSteps.setProductQuantity(quantity);
        await productSteps.addToCart();
        await productSteps.viewCart();
        await cartSteps.validateProductQuantity(quantity);
      },
    );

    test(
      "Remove Products from Cart",
      { tag: ["@SAMPLE-0018", "@TC-UI-17"] },
      async ({
        homePage,
        productApiSteps,
        commonSteps,
        cartSteps,
        headerComponentSteps,
        productListingComponentSteps,
      }) => {
        await commonSteps.navigateHome(homePage);
        await commonSteps.validateTitle("Home");
        const products = (await productApiSteps.all()) as ProductType[];
        const selectedProducts =
          await productListingComponentSteps.selectRandomProducts(products);
        await productListingComponentSteps.addProductsToCart(
          homePage,
          selectedProducts,
        );
        await headerComponentSteps.clickCart(homePage.header);
        await commonSteps.validateTitle("Cart");
        await cartSteps.removeProducts(selectedProducts);
        const cartProducts = await cartSteps.getCartProducts();
        await cartSteps.validateCartItems(cartProducts, []);
      },
    );

    test(
      "Search Products and Verify Cart After Login",
      { tag: ["@SAMPLE-0021", "@TC-UI-20"] },
      async ({
        homePage,
        userApiSteps,
        productApiSteps,
        commonSteps,
        productsPage,
        productsSteps,
        cartSteps,
        cartPage,
        signupLoginSteps,
        unregisteredUser,
        headerComponentSteps,
        productListingComponentSteps,
      }) => {
        await commonSteps.navigateHome(homePage);
        await commonSteps.validateTitle("Home");
        await headerComponentSteps.clickProducts(homePage.header);
        await commonSteps.validateTitle("Products");
        const apiProducts = (await productApiSteps.all()) as ProductType[];
        const selectedProduct: ProductType = getRandomElement(apiProducts);
        const searchTerm: string =
          selectedProduct.name.split(SPACE)[0] ?? selectedProduct.name;
        await productsSteps.searchProducts(searchTerm);
        const products: ProductType[] =
          await productListingComponentSteps.getProducts(productsPage);
        await productsSteps.validateDisplayedProductsHaveSearchTerm(
          products,
          searchTerm,
        );
        await productListingComponentSteps.addProductsToCart(
          productsPage,
          products,
        );
        await headerComponentSteps.clickCart(homePage.header);
        await commonSteps.validateTitle("Cart");
        const cartProducts = await cartSteps.getCartProducts();
        await productListingComponentSteps.validateProductsByName(
          products,
          cartProducts,
        );
        await headerComponentSteps.clickSignupLogin(cartPage.header);
        await userApiSteps.createAccount(unregisteredUser);
        await signupLoginSteps.login(unregisteredUser);
        await headerComponentSteps.clickCart(homePage.header);
        await commonSteps.validateTitle("Cart");
        const loggedCartProducts = await cartSteps.getCartProducts();
        await productListingComponentSteps.validateProductsByName(
          products,
          loggedCartProducts,
        );
      },
    );

    test(
      "Add to cart from Recommended items",
      { tag: ["@SAMPLE-0023", "@TC-UI-22"] },
      async ({
        homePage,
        homeSteps,
        commonSteps,
        cartSteps,
        headerComponentSteps,
        productListingComponentSteps,
      }) => {
        await commonSteps.navigateHome(homePage);
        await commonSteps.validateTitle("Home");
        await commonSteps.scrolling(homePage, "down");
        await homeSteps.validateRecommendedItems();
        const recommendedItems: ProductType[] =
          await homeSteps.getRecommendedItems();
        const item: ProductType = getRandomElement(recommendedItems);
        await homeSteps.addRecommendedItem(item);
        await productListingComponentSteps.continueShopping(homePage);
        await headerComponentSteps.clickCart(homePage.header);
        await commonSteps.validateTitle("Cart");
        const cartItems: ProductType[] = await cartSteps.getCartProducts();
        await cartSteps.validateCartItems(cartItems, [item], { partial: true });
      },
    );
  },
);
