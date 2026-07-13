import { test } from '@fixtures/fixtures';
import { GenerateRandomUser, UserType } from '@data/model/user.model';

test.describe('User logout', async () => {

    let user: UserType;
    test.beforeEach('Create valid user via API', async ({ logger, userApi, apiSteps }) => {
        user = GenerateRandomUser();
        await apiSteps.createAccount(logger, userApi, user);
    });

    test('Logout User',
        { tag: ['@SAMPLE-0012', '@TC4', '@user-logout'] },
        async ({
            logger, page, homeSteps, signupLoginSteps, apiSteps, userApi,
            homePage, signupLoginPage, sharedSteps
        }) => {
            await sharedSteps.navigateHome(logger, homePage);
            await sharedSteps.validateTitle(logger, page, 'Home');
            await sharedSteps.clickSignupLogin(logger, homePage.header);
            await signupLoginSteps.validateLoginToAccountText(logger, signupLoginPage);
            await signupLoginSteps.enterLoginData(logger, signupLoginPage, user);
            await sharedSteps.validateUserLoggedText(logger, homePage.header, user);
            await sharedSteps.clickLogout(logger, homePage.header);
            await sharedSteps.validateTitle(logger, page, 'Signup / Login');
            await apiSteps.deleteAccount(logger, userApi, user);
        });

});
