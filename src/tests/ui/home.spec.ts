import { DOWN, UP } from '@data/constants/common.constants';
import { test } from '@fixtures/fixtures';

test.describe('Home page validations - UI', {
    tag: ['@home', '@scroll', '@ui']
}, async () => {

    test(`Verify Scroll Up using 'Arrow' button and Scroll Down functionality`,
        { tag: ['@SAMPLE-0026', '@TC-UI-25', '@arrow-button'] },
        async ({
            homePage, sharedSteps, homeSteps
        }) => {
            await sharedSteps.navigateHome(homePage);
            await sharedSteps.validateTitle('Home');
            await sharedSteps.scrolling(homePage, DOWN);
            await sharedSteps.validateSubscriptionHeading(homePage);
            await homeSteps.scrollUp();
            await homeSteps.validateSubHeading();
        });

    test(`Verify Scroll Up without 'Arrow' button and Scroll Down functionality`,
        { tag: ['@SAMPLE-0027', '@TC-UI-26', '@arrow-button'] },
        async ({
            homePage, sharedSteps, homeSteps

        }) => {
            await sharedSteps.navigateHome(homePage);
            await sharedSteps.validateTitle('Home');
            await sharedSteps.scrolling(homePage, DOWN);
            await sharedSteps.validateSubscriptionHeading(homePage);
            await sharedSteps.scrolling(homePage, UP);
            await homeSteps.validateSubHeading();
        });

});
