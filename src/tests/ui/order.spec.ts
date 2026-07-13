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
            await homeSteps.validateHomeTitle(logger, page);
            const products = await apiSteps.getAllProducts(logger, productApi);
            const quantity = faker.number.int({ min: 1, max: 3 });
            const selectedProducts = ArraysUtils.getRandomElements(products, { quantity: quantity, indexLimit: 10 });
            await sharedSteps.addProductsToCart(logger, homePage, selectedProducts);
            await sharedSteps.clickCart(logger, homePage.header);
            await cartSteps.validateCartTitle(logger, page);
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
            for (const product of selectedProducts) {
                product.quantity = 1;
                product.totalPrice = 1 * product.price;
                delete product.brand;
            }
            await checkoutSteps.validateCartItems(logger, selectedProducts, checkoutCartItems);
            const deliveryAddress = await checkoutSteps.getAddress(logger, checkoutPage, 'delivery');
            await checkoutSteps.validateCheckoutAddress(logger, user, deliveryAddress, 'delivery');
            const billingAddress = await checkoutSteps.getAddress(logger, checkoutPage, 'billing');
            await checkoutSteps.validateCheckoutAddress(logger, user, billingAddress, 'billing');
            const checkoutComment = StringUtils.generateRandomText({ words: NumberUtils.getRandomNumber({ min: 3, max: 10 }) });
            await checkoutSteps.enterComment(logger, checkoutPage, checkoutComment);
            await checkoutSteps.placeOrder(logger, checkoutPage);


            await page.waitForTimeout(10000)
        });

});
