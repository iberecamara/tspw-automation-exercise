
import { DOWN } from '@data/constants/constants';
import { test } from '@fixtures/fixtures';
import { StringUtils } from '@utils/string.utils';

test.describe('Subscription validations', async () => {

    test('Verify Subscription in home page',
        { tag: ['@SAMPLE-0005', '@TC10', '@home', '@subscription'] },
        async ({
            homePage, sharedSteps
        }) => {
            await sharedSteps.navigateHome(homePage);
            await sharedSteps.validateTitle('Home');
            await sharedSteps.scrolling(homePage, DOWN);
            await sharedSteps.validateSubscriptionHeading(homePage);
            await sharedSteps.subscribeEmail(homePage, StringUtils.generateRandomEmail());
            await sharedSteps.validateSubscriptionMessage(homePage);
        });

    test('Verify Subscription in Cart page',
        { tag: ['@SAMPLE-0006', '@TC11', '@cart', '@subscription'] },
        async ({
            homePage, sharedSteps
        }) => {
            await sharedSteps.navigateHome(homePage);
            await sharedSteps.validateTitle('Home');
            await sharedSteps.clickCart(homePage.header);
            await sharedSteps.scrolling(homePage, DOWN);
            await sharedSteps.validateSubscriptionHeading(homePage);
            await sharedSteps.subscribeEmail(homePage, StringUtils.generateRandomEmail());
            await sharedSteps.validateSubscriptionMessage(homePage);
        });
});
