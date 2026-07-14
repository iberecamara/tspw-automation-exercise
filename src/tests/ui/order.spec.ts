import { CREATED } from '@data/constants/common.constants';
import { GenerateRandomUser, UserType } from '@data/model/user.model';
import { faker } from '@faker-js/faker';
import { test } from '@fixtures/fixtures';
import { ArraysUtils } from '@utils/arrays.utils';
import { NumberUtils } from '@utils/number.utils';
import { StringUtils } from '@utils/string.utils';

test.describe('Orders', {
    tag: ['@orders']
}, async () => {

    test('Place Order: Register while Checkout',
        { tag: ['@SAMPLE-0015', '@TC14', '@user-register-checkout'] },
        async ({
            page, logger, homeSteps, cartSteps, cartPage, signupLoginSteps, apiSteps, homePage, signupLoginPage, sharedSteps,
            accountCreatedDeletedSteps, accountCreatedDeletedPage, signupSteps, signupPage, productApi, checkoutSteps, checkoutPage
        }) => {

            await sharedSteps.navigateHome(logger, homePage);
            await sharedSteps.validateTitle(logger, page, 'Home');
            const products = await apiSteps.getAllProducts(logger, productApi);
            const selectedProducts = await sharedSteps.selectRandomProducts(logger, products);
            await sharedSteps.addProductsToCart(logger, homePage, selectedProducts);
            await sharedSteps.clickCart(logger, homePage.header);
            await sharedSteps.validateTitle(logger, page, 'Cart');
            await cartSteps.proceedToCheckout(logger, cartPage);
            await cartSteps.registerUserFromCheckout(logger, cartPage);
            const user: UserType = GenerateRandomUser();
            await signupLoginSteps.enterSignupData(logger, signupLoginPage, user);
            await signupLoginSteps.clickSignup(logger, signupLoginPage);
            await signupSteps.enterSignupData(logger, signupPage, user);
            await signupSteps.clickCreateAccount(logger, signupPage);
            await accountCreatedDeletedSteps.validateAccountActionText(logger, accountCreatedDeletedPage, CREATED);
            await accountCreatedDeletedSteps.clickContinue(logger, accountCreatedDeletedPage, StringUtils.capitalize(CREATED));
            await sharedSteps.validateUserLoggedText(logger, homePage.header, user);
            await sharedSteps.clickCart(logger, homePage.header);
            await cartSteps.proceedToCheckout(logger, cartPage);
            const checkoutCartItems = await checkoutSteps.getCartProducts(logger, checkoutPage);
            await checkoutSteps.validateCartItems(logger, selectedProducts, checkoutCartItems);
            await checkoutSteps.validateCheckoutAddress(logger, checkoutPage, user, 'delivery');
            await checkoutSteps.validateCheckoutAddress(logger, checkoutPage, user, 'billing');
            const checkoutComment = StringUtils.generateRandomText({ words: NumberUtils.getRandomNumber({ min: 3, max: 10 }) });
            await checkoutSteps.enterComment(logger, checkoutPage, checkoutComment);
            await checkoutSteps.placeOrder(logger, checkoutPage);



        });

});
