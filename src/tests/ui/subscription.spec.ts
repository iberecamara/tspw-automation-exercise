
import { DOWN } from '@data/constants/constants';
import { test } from '@fixtures/fixtures';
import { StringUtils } from '@utils/string.utils';

test.describe('Subscription validations - UI', {
    tag: ['@subscription', '@ui']
}, async () => {

    test('Verify Subscription in home page',
        { tag: ['@SAMPLE-0005', '@TC-UI-10', '@home'] },
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
        { tag: ['@SAMPLE-0006', '@TC-UI-11', '@cart'] },
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
