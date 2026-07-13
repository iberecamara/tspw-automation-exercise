
import { DOWN } from '@data/constants/constants';
import { test } from '@fixtures/fixtures';
import { StringUtils } from '@utils/string.utils';

test.describe('Subscription validations', async () => {

    test('Verify Subscription in home page',
        { tag: ['@SAMPLE-0005', '@TC10', '@home', '@subscription'] },
        async ({
            logger, page, homeSteps, homePage, sharedSteps
        }) => {
            await sharedSteps.navigateHome(logger, homePage);
            await homeSteps.validateHomeTitle(logger, page);
            await sharedSteps.scrolling(logger, homePage, DOWN);
            await sharedSteps.validateSubscriptionHeading(logger, homePage);
            await sharedSteps.subscribeEmail(logger, homePage, StringUtils.generateRandomEmail());
            await sharedSteps.validateSubscriptionMessage(logger, homePage);
        });

    test('Verify Subscription in Cart page',
        { tag: ['@SAMPLE-0006', '@TC11', '@cart', '@subscription'] },
        async ({
            logger, page, homeSteps, homePage, sharedSteps
        }) => {
            await sharedSteps.navigateHome(logger, homePage);
            await homeSteps.validateHomeTitle(logger, page);
            await sharedSteps.clickCart(logger, homePage.header);
            await sharedSteps.scrolling(logger, homePage, DOWN);
            await sharedSteps.validateSubscriptionHeading(logger, homePage);
            await sharedSteps.subscribeEmail(logger, homePage, StringUtils.generateRandomEmail());
            await sharedSteps.validateSubscriptionMessage(logger, homePage);
        });
});
