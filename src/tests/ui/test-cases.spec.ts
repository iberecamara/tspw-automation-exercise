import { test } from '@fixtures/fixtures';

test.describe('Test Cases page', async () => {

    test('Verify Test Cases Page',
        { tag: ['@SAMPLE-0004', '@TC7', '@test-cases'] },
        async ({
            page, homePage, sharedSteps
        }) => {
            await sharedSteps.navigateHome(homePage);
            await sharedSteps.validateTitle(page, 'Home');
            await sharedSteps.clickTestCases(homePage.header);
            await sharedSteps.validateTitle(page, 'Test Cases');
        });

});
