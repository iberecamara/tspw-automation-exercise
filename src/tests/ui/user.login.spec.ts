import { DELETED } from '@data/constants/common.constants';
import { GenerateRandomUser, UserType } from '@data/model/user.model';
import { test } from '@fixtures/fixtures';

test.describe('User login', async () => {

    let user: UserType;
    test.beforeEach('Create valid user via API', async ({ apiSteps }) => {
        user = GenerateRandomUser();
        await apiSteps.createAccount(user);
    });

    test('Login User with correct email and password',
        { tag: ['@SAMPLE-0001', '@TC2', '@user-login', '@valid-user'] },
        async ({
            page, signupLoginSteps, accountCreatedDeletedSteps, homePage, sharedSteps
        }) => {
            await sharedSteps.navigateHome(homePage);
            await sharedSteps.validateTitle(page, 'Home');
            await sharedSteps.clickSignupLogin(homePage.header);
            await signupLoginSteps.validateLoginToAccountText();
            await signupLoginSteps.enterLoginData(user);
            await sharedSteps.validateUserLoggedText(homePage.header, user);
            await sharedSteps.clickDeleteAccount(homePage.header);
            await accountCreatedDeletedSteps.validateAccountActionText(DELETED);
        });

    test('Login User with incorrect email',
        { tag: ['@SAMPLE-0002', '@TC3', '@TC3.1', '@user-login', '@login-error', '@invalid-user'] },
        async ({
            page, signupLoginSteps, apiSteps, homePage, sharedSteps
        }) => {
            await sharedSteps.navigateHome(homePage);
            await sharedSteps.validateTitle(page, 'Home');
            await sharedSteps.clickSignupLogin(homePage.header);
            await signupLoginSteps.validateLoginToAccountText();
            const email = user.email;
            user.email = `invalid_${user.email}`;
            await signupLoginSteps.enterLoginData(user);
            await signupLoginSteps.validateInvalidCredentialsMessage();
            user.email = email;
            await apiSteps.deleteAccount(user);
        });

    test('Login User with incorrect password',
        { tag: ['@SAMPLE-0003', '@TC3', '@TC3.2', '@user-login', '@invalid-password'] },
        async ({
            page, signupLoginSteps, apiSteps, homePage, sharedSteps
        }) => {
            await sharedSteps.navigateHome(homePage);
            await sharedSteps.validateTitle(page, 'Home');
            await sharedSteps.clickSignupLogin(homePage.header);
            await signupLoginSteps.validateLoginToAccountText();
            const password = user.password;
            user.password = `invalid_${user.password}`;
            await signupLoginSteps.enterLoginData(user);
            await signupLoginSteps.validateInvalidCredentialsMessage();
            user.password = password;
            await apiSteps.deleteAccount(user);
        });

});
