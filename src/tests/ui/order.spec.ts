import { CREATED, DELETED } from '@data/constants/common.constants';
import { CreditCardDetailsType, GenerateRandomCard } from '@data/model/credit-card-details.model';
import { GenerateRandomUser, UserType } from '@data/model/user.model';
import { test } from '@fixtures/fixtures';
import { NumberUtils } from '@utils/number.utils';
import { StringUtils } from '@utils/string.utils';

test.describe('Orders', {
    tag: ['@orders']
}, async () => {

    test('Place Order: Register while Checkout',
        { tag: ['@SAMPLE-0015', '@TC14', '@user-register-checkout'] },
        async ({
            page, apiSteps, homePage, paymentSteps, cartSteps, signupLoginSteps, sharedSteps,
            accountCreatedDeletedSteps, signupSteps, checkoutSteps
        }) => {

            await sharedSteps.navigateHome(homePage);
            await sharedSteps.validateTitle(page, 'Home');
            const products = await apiSteps.getAllProducts();
            const selectedProducts = await sharedSteps.selectRandomProducts(products);
            await sharedSteps.addProductsToCart(homePage, selectedProducts);
            await sharedSteps.clickCart(homePage.header);
            await sharedSteps.validateTitle(page, 'Cart');
            await cartSteps.proceedToCheckout();
            await cartSteps.registerUserFromCheckout();
            const user: UserType = GenerateRandomUser();
            await signupLoginSteps.enterSignupData(user);
            await signupLoginSteps.clickSignup();
            await signupSteps.enterSignupData(user);
            await signupSteps.clickCreateAccount();
            await accountCreatedDeletedSteps.validateAccountActionText(CREATED);
            await accountCreatedDeletedSteps.clickContinue(StringUtils.capitalize(CREATED));
            await sharedSteps.validateUserLoggedText(homePage.header, user);
            await sharedSteps.clickCart(homePage.header);
            await cartSteps.proceedToCheckout();
            const checkoutCartItems = await checkoutSteps.getCartProducts();
            await checkoutSteps.validateCartItems(selectedProducts, checkoutCartItems);
            await checkoutSteps.validateCheckoutAddress(user, 'delivery');
            await checkoutSteps.validateCheckoutAddress(user, 'billing');
            const checkoutComment = StringUtils.generateRandomText({ words: NumberUtils.getRandomNumber({ min: 3, max: 10 }) });
            await checkoutSteps.enterComment(checkoutComment);
            await checkoutSteps.placeOrder();
            const cardDetails: CreditCardDetailsType = GenerateRandomCard({ name: user.name });
            await paymentSteps.enterCardDetails(cardDetails);
            await paymentSteps.payAndConfirmOrder();
            await paymentSteps.validateOrderPlaced();
            await sharedSteps.clickDeleteAccount(homePage.header);
            await accountCreatedDeletedSteps.validateAccountActionText(DELETED);
            await accountCreatedDeletedSteps.clickContinue(StringUtils.capitalize(DELETED));
        });

});
