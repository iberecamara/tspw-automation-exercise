import { GenerateRandomUser, UserType } from '@data/model/user.model';
import { test } from '@fixtures/fixtures';

test.describe('User logout', async () => {

    let user: UserType;
    test.beforeEach('Create valid user via API', async ({ apiSteps }) => {
        user = GenerateRandomUser();
        await apiSteps.createAccount(user);
    });

    test('Logout User',
        { tag: ['@SAMPLE-0012', '@TC4', '@user-logout'] },
        async ({
            page, signupLoginSteps, apiSteps, homePage, sharedSteps
        }) => {
            await sharedSteps.navigateHome(homePage);
            await sharedSteps.validateTitle(page, 'Home');
            await sharedSteps.clickSignupLogin(homePage.header);
            await signupLoginSteps.validateLoginToAccountText();
            await signupLoginSteps.enterLoginData(user);
            await sharedSteps.validateUserLoggedText(homePage.header, user);
            await sharedSteps.clickLogout(homePage.header);
            await sharedSteps.validateTitle(page, 'Signup / Login');
            await apiSteps.deleteAccount(user);
        });

});
