import { GenerateRandomUser, UserType } from '@data/model/user.model';
import { test } from '@fixtures/fixtures';

test.describe('User logout', async () => {

    let user: UserType;
    test.beforeEach('Create valid user via API', async ({ userApiSteps }) => {
        user = GenerateRandomUser();
        await userApiSteps.createAccount(user);
    });

    test('Logout User',
        { tag: ['@SAMPLE-0012', '@TC4', '@user-logout'] },
        async ({
            signupLoginSteps, userApiSteps, homePage, sharedSteps
        }) => {
            await sharedSteps.navigateHome(homePage);
            await sharedSteps.validateTitle('Home');
            await sharedSteps.clickSignupLogin(homePage.header);
            await signupLoginSteps.validateLoginToAccountText();
            await signupLoginSteps.login(user);
            await sharedSteps.validateUserLoggedText(homePage.header, user);
            await sharedSteps.clickLogout(homePage.header);
            await sharedSteps.validateTitle('Signup / Login');
            await userApiSteps.deleteAccount(user);
        });

});
