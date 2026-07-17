import { test } from '@fixtures/fixtures';

test.describe('Test Cases page validations - UI', {
    tag: ['@test-cases', '@ui']
}, async () => {

    test('Verify Test Cases Page',
        { tag: ['@SAMPLE-0004', '@TC-UI-7'] },
        async ({
            homePage, sharedSteps
        }) => {
            await sharedSteps.navigateHome(homePage);
            await sharedSteps.validateTitle('Home');
            await sharedSteps.clickTestCases(homePage.header);
            await sharedSteps.validateTitle('Test Cases');
        });

});
