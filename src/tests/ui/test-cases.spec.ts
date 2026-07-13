import { test } from '@fixtures/fixtures';

test.describe('Test Cases page', async () => {

    test('Verify Test Cases Page',
        { tag: ['@SAMPLE-0004', '@TC7', '@test-cases'] },
        async ({
            logger, page, homeSteps, homePage, testCaseSteps, sharedSteps
        }) => {
            await sharedSteps.navigateHome(logger, homePage);
            await sharedSteps.validateTitle(logger, page, 'Home');
            await sharedSteps.clickTestCases(logger, homePage.header);
            await sharedSteps.validateTitle(logger, page, 'Test Cases');
        });

});
