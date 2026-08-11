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
  "Download validations - UI",
  {
    tag: ["@download", "@ui"],
  },
  () => {
    test(
      "Download Invoice after purchase order",
      {
        tag: ["@SAMPLE-0025", "@TC-UI-24", "@user-register-checkout"],
      },
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
        await commonSteps.navigateHome();
        await commonSteps.validateTitle("Home");
        const products = (await productApiSteps.all()) as ProductType[];
        const selectedProducts =
          await productListingComponentSteps.selectRandomProducts(products);
        await productListingComponentSteps.addProductsToCart(
          homePage,
          selectedProducts,
        );
        await headerComponentSteps.clickCart();
        await commonSteps.validateTitle("Cart");
        await cartSteps.proceedToCheckout();
        await cartSteps.registerUserFromCheckout();
        await signupLoginSteps.enterSignupData(unregisteredUser);
        await signupLoginSteps.clickSignup();
        await signupSteps.enterSignupData(unregisteredUser);
        await signupSteps.clickCreateAccount();
        await accountCreatedDeletedSteps.validateAccountActionText("created");
        await accountCreatedDeletedSteps.clickContinue(capitalize("created"));
        await headerComponentSteps.validateUserLoggedText(unregisteredUser);
        await headerComponentSteps.clickCart();
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
