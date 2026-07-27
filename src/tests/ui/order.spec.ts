import {
  CreditCardDetailsType,
  generateRandomCard,
} from "@data/model/credit-card-details.model";
import { ProductType } from "@data/model/product.model";
import { test } from "@fixtures/fixtures";
import { readFile } from "@utils/file.utils";
import { getRandomNumber } from "@utils/number.utils";
import { capitalize, generateRandomText } from "@utils/string.utils";

test.describe(
  "Orders validations - UI",
  {
    tag: ["@orders", "@checkout", "@ui"],
  },
  () => {
    test(
      "Place Order: Register while Checkout",
      { tag: ["@SAMPLE-0015", "@TC-UI-14", "@user-register-checkout"] },
      async ({
        productApiSteps,
        homePage,
        paymentSteps,
        cartSteps,
        signupLoginSteps,
        commonSteps,
        accountCreatedDeletedSteps,
        signupSteps,
        checkoutSteps,
        unregisteredUser,
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
        await cartSteps.proceedToCheckout();
        await cartSteps.registerUserFromCheckout();
        await signupLoginSteps.enterSignupData(unregisteredUser);
        await signupLoginSteps.clickSignup();
        await signupSteps.enterSignupData(unregisteredUser);
        await signupSteps.clickCreateAccount();
        await accountCreatedDeletedSteps.validateAccountActionText("created");
        await accountCreatedDeletedSteps.clickContinue(capitalize("created"));
        await headerComponentSteps.validateUserLoggedText(
          homePage.header,
          unregisteredUser,
        );
        await headerComponentSteps.clickCart(homePage.header);
        await cartSteps.proceedToCheckout();
        const checkoutCartItems = await checkoutSteps.getCartProducts();
        await checkoutSteps.validateCartItems(
          checkoutCartItems,
          selectedProducts,
        );
        await checkoutSteps.validateCheckoutAddress(
          unregisteredUser,
          "delivery",
        );
        await checkoutSteps.validateCheckoutAddress(
          unregisteredUser,
          "billing",
        );
        const checkoutComment = generateRandomText({
          words: getRandomNumber({ min: 3, max: 10 }),
        });
        await checkoutSteps.enterComment(checkoutComment);
        await checkoutSteps.placeOrder();
        const cardDetails: CreditCardDetailsType = generateRandomCard({
          name: unregisteredUser.name,
        });
        await paymentSteps.enterCardDetails(cardDetails);
        await paymentSteps.payAndConfirmOrder();
        await paymentSteps.validateOrderPlaced();
      },
    );

    test(
      "Place Order: Register before Checkout",
      { tag: ["@SAMPLE-0016", "@TC-UI-15"] },
      async ({
        productApiSteps,
        homePage,
        paymentSteps,
        cartSteps,
        signupLoginSteps,
        commonSteps,
        accountCreatedDeletedSteps,
        signupSteps,
        checkoutSteps,
        unregisteredUser,
        headerComponentSteps,
        productListingComponentSteps,
      }) => {
        await commonSteps.navigateHome(homePage);
        await commonSteps.validateTitle("Home");
        await headerComponentSteps.clickSignupLogin(homePage.header);
        await signupLoginSteps.validateNewUserSignupText();
        await signupLoginSteps.enterSignupData(unregisteredUser);
        await signupLoginSteps.clickSignup();
        await signupSteps.validateEnterAccountInformationText();
        await signupSteps.enterSignupData(unregisteredUser);
        await signupSteps.clickCreateAccount();
        await accountCreatedDeletedSteps.validateAccountActionText("created");
        await accountCreatedDeletedSteps.clickContinue(capitalize("created"));
        await headerComponentSteps.validateUserLoggedText(
          homePage.header,
          unregisteredUser,
        );
        const products = (await productApiSteps.all()) as ProductType[];
        const selectedProducts =
          await productListingComponentSteps.selectRandomProducts(products);
        await productListingComponentSteps.addProductsToCart(
          homePage,
          selectedProducts,
        );
        await headerComponentSteps.clickCart(homePage.header);
        await commonSteps.validateTitle("Cart");
        await cartSteps.proceedToCheckout();
        const checkoutCartItems = await checkoutSteps.getCartProducts();
        await checkoutSteps.validateCartItems(
          checkoutCartItems,
          selectedProducts,
        );
        await checkoutSteps.validateCheckoutAddress(
          unregisteredUser,
          "delivery",
        );
        await checkoutSteps.validateCheckoutAddress(
          unregisteredUser,
          "billing",
        );
        const checkoutComment = generateRandomText({
          words: getRandomNumber({ min: 3, max: 10 }),
        });
        await checkoutSteps.enterComment(checkoutComment);
        await checkoutSteps.placeOrder();
        const cardDetails: CreditCardDetailsType = generateRandomCard({
          name: unregisteredUser.name,
        });
        await paymentSteps.enterCardDetails(cardDetails);
        await paymentSteps.payAndConfirmOrder();
        await paymentSteps.validateOrderPlaced();
      },
    );

    test(
      "Place Order: Login before Checkout",
      { tag: ["@SAMPLE-0017", "@TC-UI-16"] },
      async ({
        productApiSteps,
        userApiSteps,
        homePage,
        paymentSteps,
        cartSteps,
        signupLoginSteps,
        commonSteps,
        checkoutSteps,
        unregisteredUser,
        headerComponentSteps,
        productListingComponentSteps,
      }) => {
        await userApiSteps.createAccount(unregisteredUser);
        await commonSteps.navigateHome(homePage);
        await commonSteps.validateTitle("Home");
        await headerComponentSteps.clickSignupLogin(homePage.header);
        await signupLoginSteps.login(unregisteredUser);
        await headerComponentSteps.validateUserLoggedText(
          homePage.header,
          unregisteredUser,
        );
        const products = (await productApiSteps.all()) as ProductType[];
        const selectedProducts =
          await productListingComponentSteps.selectRandomProducts(products);
        await productListingComponentSteps.addProductsToCart(
          homePage,
          selectedProducts,
        );
        await headerComponentSteps.clickCart(homePage.header);
        await commonSteps.validateTitle("Cart");
        await cartSteps.proceedToCheckout();
        const checkoutCartItems = await checkoutSteps.getCartProducts();
        await checkoutSteps.validateCartItems(
          checkoutCartItems,
          selectedProducts,
        );
        await checkoutSteps.validateCheckoutAddress(
          unregisteredUser,
          "delivery",
        );
        await checkoutSteps.validateCheckoutAddress(
          unregisteredUser,
          "billing",
        );
        const checkoutComment = generateRandomText({
          words: getRandomNumber({ min: 3, max: 10 }),
        });
        await checkoutSteps.enterComment(checkoutComment);
        await checkoutSteps.placeOrder();
        const cardDetails: CreditCardDetailsType = generateRandomCard({
          name: unregisteredUser.name,
        });
        await paymentSteps.enterCardDetails(cardDetails);
        await paymentSteps.payAndConfirmOrder();
        await paymentSteps.validateOrderPlaced();
      },
    );

    test(
      "Verify address details in checkout page",
      { tag: ["@SAMPLE-0024", "@TC-UI-23", "@address-validation"] },
      async ({
        productApiSteps,
        homePage,
        cartSteps,
        signupLoginSteps,
        commonSteps,
        accountCreatedDeletedSteps,
        signupSteps,
        checkoutSteps,
        unregisteredUser,
        headerComponentSteps,
        productListingComponentSteps,
      }) => {
        await commonSteps.navigateHome(homePage);
        await commonSteps.validateTitle("Home");
        await headerComponentSteps.clickSignupLogin(homePage.header);
        await signupLoginSteps.validateNewUserSignupText();
        await signupLoginSteps.enterSignupData(unregisteredUser);
        await signupLoginSteps.clickSignup();
        await signupSteps.validateEnterAccountInformationText();
        await signupSteps.enterSignupData(unregisteredUser);
        await signupSteps.clickCreateAccount();
        await accountCreatedDeletedSteps.validateAccountActionText("created");
        await accountCreatedDeletedSteps.clickContinue(capitalize("created"));
        await headerComponentSteps.validateUserLoggedText(
          homePage.header,
          unregisteredUser,
        );
        const products = (await productApiSteps.all()) as ProductType[];
        const selectedProducts =
          await productListingComponentSteps.selectRandomProducts(products);
        await productListingComponentSteps.addProductsToCart(
          homePage,
          selectedProducts,
        );
        await headerComponentSteps.clickCart(homePage.header);
        await commonSteps.validateTitle("Cart");
        await cartSteps.proceedToCheckout();
        const checkoutCartItems = await checkoutSteps.getCartProducts();
        await checkoutSteps.validateCartItems(
          checkoutCartItems,
          selectedProducts,
        );
        await checkoutSteps.validateCheckoutAddress(
          unregisteredUser,
          "delivery",
        );
        await checkoutSteps.validateCheckoutAddress(
          unregisteredUser,
          "billing",
        );
      },
    );

    test(
      "Download Invoice after purchase order",
      { tag: ["@SAMPLE-0025", "@TC-UI-24", "@user-register-checkout"] },
      async ({
        productApiSteps,
        homePage,
        paymentSteps,
        cartSteps,
        signupLoginSteps,
        commonSteps,
        accountCreatedDeletedSteps,
        signupSteps,
        checkoutSteps,
        unregisteredUser,
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
        await cartSteps.proceedToCheckout();
        await cartSteps.registerUserFromCheckout();
        await signupLoginSteps.enterSignupData(unregisteredUser);
        await signupLoginSteps.clickSignup();
        await signupSteps.enterSignupData(unregisteredUser);
        await signupSteps.clickCreateAccount();
        await accountCreatedDeletedSteps.validateAccountActionText("created");
        await accountCreatedDeletedSteps.clickContinue(capitalize("created"));
        await headerComponentSteps.validateUserLoggedText(
          homePage.header,
          unregisteredUser,
        );
        await headerComponentSteps.clickCart(homePage.header);
        await cartSteps.proceedToCheckout();
        const checkoutCartItems = await checkoutSteps.getCartProducts();
        const cartTotalPrice = checkoutCartItems.reduce(
          (sum, item) => sum + (item.totalPrice ?? 0),
          0,
        );
        await checkoutSteps.validateCartItems(
          checkoutCartItems,
          selectedProducts,
        );
        await checkoutSteps.validateCheckoutAddress(
          unregisteredUser,
          "delivery",
        );
        await checkoutSteps.validateCheckoutAddress(
          unregisteredUser,
          "billing",
        );
        const checkoutComment = generateRandomText({
          words: getRandomNumber({ min: 3, max: 10 }),
        });
        await checkoutSteps.enterComment(checkoutComment);
        await checkoutSteps.placeOrder();
        const cardDetails: CreditCardDetailsType = generateRandomCard({
          name: unregisteredUser.name,
        });
        await paymentSteps.enterCardDetails(cardDetails);
        await paymentSteps.payAndConfirmOrder();
        await paymentSteps.validateOrderPlaced();
        const filepath: string = await paymentSteps.downloadInvoice();
        await paymentSteps.continue();
        const fileContents: string[] = readFile(filepath);
        await paymentSteps.validateInvoiceFileContents(
          fileContents,
          unregisteredUser,
          cartTotalPrice,
        );
      },
    );
  },
);
