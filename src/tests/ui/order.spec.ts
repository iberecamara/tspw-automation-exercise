import { CREATED, DELETED } from "@data/constants/common.constants";
import {
  CreditCardDetailsType,
  GenerateRandomCard,
} from "@data/model/credit-card-details.model";
import { ProductType } from "@data/model/product.model";
import { GenerateRandomUser, UserType } from "@data/model/user.model";
import { test } from "@fixtures/fixtures";
import { FileUtils } from "@utils/file.utils";
import { NumberUtils } from "@utils/number.utils";
import { StringUtils } from "@utils/string.utils";

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
        sharedSteps,
        accountCreatedDeletedSteps,
        signupSteps,
        checkoutSteps,
      }) => {
        await sharedSteps.navigateHome(homePage);
        await sharedSteps.validateTitle("Home");
        const products = (await productApiSteps.all()) as ProductType[];
        const selectedProducts =
          await sharedSteps.selectRandomProducts(products);
        await sharedSteps.addProductsToCart(homePage, selectedProducts);
        await sharedSteps.clickCart(homePage.header);
        await sharedSteps.validateTitle("Cart");
        await cartSteps.proceedToCheckout();
        await cartSteps.registerUserFromCheckout();
        const user: UserType = GenerateRandomUser();
        await signupLoginSteps.enterSignupData(user);
        await signupLoginSteps.clickSignup();
        await signupSteps.enterSignupData(user);
        await signupSteps.clickCreateAccount();
        await accountCreatedDeletedSteps.validateAccountActionText(CREATED);
        await accountCreatedDeletedSteps.clickContinue(
          StringUtils.capitalize(CREATED),
        );
        await sharedSteps.validateUserLoggedText(homePage.header, user);
        await sharedSteps.clickCart(homePage.header);
        await cartSteps.proceedToCheckout();
        const checkoutCartItems = await checkoutSteps.getCartProducts();
        await checkoutSteps.validateCartItems(
          checkoutCartItems,
          selectedProducts,
        );
        await checkoutSteps.validateCheckoutAddress(user, "delivery");
        await checkoutSteps.validateCheckoutAddress(user, "billing");
        const checkoutComment = StringUtils.generateRandomText({
          words: NumberUtils.getRandomNumber({ min: 3, max: 10 }),
        });
        await checkoutSteps.enterComment(checkoutComment);
        await checkoutSteps.placeOrder();
        const cardDetails: CreditCardDetailsType = GenerateRandomCard({
          name: user.name,
        });
        await paymentSteps.enterCardDetails(cardDetails);
        await paymentSteps.payAndConfirmOrder();
        await paymentSteps.validateOrderPlaced();
        await sharedSteps.clickDeleteAccount(homePage.header);
        await accountCreatedDeletedSteps.validateAccountActionText(DELETED);
        await accountCreatedDeletedSteps.clickContinue(
          StringUtils.capitalize(DELETED),
        );
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
        sharedSteps,
        accountCreatedDeletedSteps,
        signupSteps,
        checkoutSteps,
      }) => {
        const user: UserType = GenerateRandomUser();
        await sharedSteps.navigateHome(homePage);
        await sharedSteps.validateTitle("Home");
        await sharedSteps.clickSignupLogin(homePage.header);
        await signupLoginSteps.validateNewUserSignupText();
        await signupLoginSteps.enterSignupData(user);
        await signupLoginSteps.clickSignup();
        await signupSteps.validateEnterAccountInformationText();
        await signupSteps.enterSignupData(user);
        await signupSteps.clickCreateAccount();
        await accountCreatedDeletedSteps.validateAccountActionText(CREATED);
        await accountCreatedDeletedSteps.clickContinue(
          StringUtils.capitalize(CREATED),
        );
        await sharedSteps.validateUserLoggedText(homePage.header, user);
        const products = (await productApiSteps.all()) as ProductType[];
        const selectedProducts =
          await sharedSteps.selectRandomProducts(products);
        await sharedSteps.addProductsToCart(homePage, selectedProducts);
        await sharedSteps.clickCart(homePage.header);
        await sharedSteps.validateTitle("Cart");
        await cartSteps.proceedToCheckout();
        const checkoutCartItems = await checkoutSteps.getCartProducts();
        await checkoutSteps.validateCartItems(
          checkoutCartItems,
          selectedProducts,
        );
        await checkoutSteps.validateCheckoutAddress(user, "delivery");
        await checkoutSteps.validateCheckoutAddress(user, "billing");
        const checkoutComment = StringUtils.generateRandomText({
          words: NumberUtils.getRandomNumber({ min: 3, max: 10 }),
        });
        await checkoutSteps.enterComment(checkoutComment);
        await checkoutSteps.placeOrder();
        const cardDetails: CreditCardDetailsType = GenerateRandomCard({
          name: user.name,
        });
        await paymentSteps.enterCardDetails(cardDetails);
        await paymentSteps.payAndConfirmOrder();
        await paymentSteps.validateOrderPlaced();
        await sharedSteps.clickDeleteAccount(homePage.header);
        await accountCreatedDeletedSteps.validateAccountActionText(DELETED);
        await accountCreatedDeletedSteps.clickContinue(
          StringUtils.capitalize(DELETED),
        );
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
        sharedSteps,
        accountCreatedDeletedSteps,
        checkoutSteps,
      }) => {
        const user: UserType = GenerateRandomUser();
        await userApiSteps.createAccount(user);
        await sharedSteps.navigateHome(homePage);
        await sharedSteps.validateTitle("Home");
        await sharedSteps.clickSignupLogin(homePage.header);
        await signupLoginSteps.login(user);
        await sharedSteps.validateUserLoggedText(homePage.header, user);
        const products = (await productApiSteps.all()) as ProductType[];
        const selectedProducts =
          await sharedSteps.selectRandomProducts(products);
        await sharedSteps.addProductsToCart(homePage, selectedProducts);
        await sharedSteps.clickCart(homePage.header);
        await sharedSteps.validateTitle("Cart");
        await cartSteps.proceedToCheckout();
        const checkoutCartItems = await checkoutSteps.getCartProducts();
        await checkoutSteps.validateCartItems(
          checkoutCartItems,
          selectedProducts,
        );
        await checkoutSteps.validateCheckoutAddress(user, "delivery");
        await checkoutSteps.validateCheckoutAddress(user, "billing");
        const checkoutComment = StringUtils.generateRandomText({
          words: NumberUtils.getRandomNumber({ min: 3, max: 10 }),
        });
        await checkoutSteps.enterComment(checkoutComment);
        await checkoutSteps.placeOrder();
        const cardDetails: CreditCardDetailsType = GenerateRandomCard({
          name: user.name,
        });
        await paymentSteps.enterCardDetails(cardDetails);
        await paymentSteps.payAndConfirmOrder();
        await paymentSteps.validateOrderPlaced();
        await sharedSteps.clickDeleteAccount(homePage.header);
        await accountCreatedDeletedSteps.validateAccountActionText(DELETED);
        await accountCreatedDeletedSteps.clickContinue(
          StringUtils.capitalize(DELETED),
        );
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
        sharedSteps,
        accountCreatedDeletedSteps,
        signupSteps,
        checkoutSteps,
      }) => {
        const user: UserType = GenerateRandomUser();
        await sharedSteps.navigateHome(homePage);
        await sharedSteps.validateTitle("Home");
        await sharedSteps.clickSignupLogin(homePage.header);
        await signupLoginSteps.validateNewUserSignupText();
        await signupLoginSteps.enterSignupData(user);
        await signupLoginSteps.clickSignup();
        await signupSteps.validateEnterAccountInformationText();
        await signupSteps.enterSignupData(user);
        await signupSteps.clickCreateAccount();
        await accountCreatedDeletedSteps.validateAccountActionText(CREATED);
        await accountCreatedDeletedSteps.clickContinue(
          StringUtils.capitalize(CREATED),
        );
        await sharedSteps.validateUserLoggedText(homePage.header, user);
        const products = (await productApiSteps.all()) as ProductType[];
        const selectedProducts =
          await sharedSteps.selectRandomProducts(products);
        await sharedSteps.addProductsToCart(homePage, selectedProducts);
        await sharedSteps.clickCart(homePage.header);
        await sharedSteps.validateTitle("Cart");
        await cartSteps.proceedToCheckout();
        const checkoutCartItems = await checkoutSteps.getCartProducts();
        await checkoutSteps.validateCartItems(
          checkoutCartItems,
          selectedProducts,
        );
        await checkoutSteps.validateCheckoutAddress(user, "delivery");
        await checkoutSteps.validateCheckoutAddress(user, "billing");
        await sharedSteps.clickDeleteAccount(homePage.header);
        await accountCreatedDeletedSteps.validateAccountActionText(DELETED);
        await accountCreatedDeletedSteps.clickContinue(
          StringUtils.capitalize(DELETED),
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
        sharedSteps,
        accountCreatedDeletedSteps,
        signupSteps,
        checkoutSteps,
      }) => {
        await sharedSteps.navigateHome(homePage);
        await sharedSteps.validateTitle("Home");
        const products = (await productApiSteps.all()) as ProductType[];
        const selectedProducts =
          await sharedSteps.selectRandomProducts(products);
        await sharedSteps.addProductsToCart(homePage, selectedProducts);
        await sharedSteps.clickCart(homePage.header);
        await sharedSteps.validateTitle("Cart");
        await cartSteps.proceedToCheckout();
        await cartSteps.registerUserFromCheckout();
        const user: UserType = GenerateRandomUser();
        await signupLoginSteps.enterSignupData(user);
        await signupLoginSteps.clickSignup();
        await signupSteps.enterSignupData(user);
        await signupSteps.clickCreateAccount();
        await accountCreatedDeletedSteps.validateAccountActionText(CREATED);
        await accountCreatedDeletedSteps.clickContinue(
          StringUtils.capitalize(CREATED),
        );
        await sharedSteps.validateUserLoggedText(homePage.header, user);
        await sharedSteps.clickCart(homePage.header);
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
        await checkoutSteps.validateCheckoutAddress(user, "delivery");
        await checkoutSteps.validateCheckoutAddress(user, "billing");
        const checkoutComment = StringUtils.generateRandomText({
          words: NumberUtils.getRandomNumber({ min: 3, max: 10 }),
        });
        await checkoutSteps.enterComment(checkoutComment);
        await checkoutSteps.placeOrder();
        const cardDetails: CreditCardDetailsType = GenerateRandomCard({
          name: user.name,
        });
        await paymentSteps.enterCardDetails(cardDetails);
        await paymentSteps.payAndConfirmOrder();
        await paymentSteps.validateOrderPlaced();
        const filepath: string = await paymentSteps.downloadInvoice();
        await paymentSteps.continue();
        const fileContents: string[] = FileUtils.readFile(filepath);
        await paymentSteps.validateInvoiceFileContents(
          fileContents,
          user,
          cartTotalPrice,
        );
        await sharedSteps.clickDeleteAccount(homePage.header);
        await accountCreatedDeletedSteps.validateAccountActionText(DELETED);
        await accountCreatedDeletedSteps.clickContinue(
          StringUtils.capitalize(DELETED),
        );
      },
    );
  },
);
