import { CREATED, DELETED } from '@data/constants/common.constants';
import { GenerateRandomUser, UserType } from '@data/model/user.model';
import { test } from '@fixtures/fixtures';
import { StringUtils } from '@utils/string.utils';

test.describe('User registration', {
    tag: ['@user-register']
}, async () => {

    test('Register user',
        { tag: ['@SAMPLE-0013', '@TC1'] },
        async ({
            signupLoginSteps, signupSteps, accountCreatedDeletedSteps, homePage, sharedSteps
        }) => {

            const user: UserType = GenerateRandomUser();
            await sharedSteps.navigateHome(homePage);
            await sharedSteps.validateTitle('Home');
            await sharedSteps.clickSignupLogin(homePage.header);
            await signupLoginSteps.validateNewUserSignupText();
            await signupLoginSteps.enterSignupData(user);
            await signupLoginSteps.clickSignup();
            await signupSteps.validateEnterAccountInformationText();
            await signupSteps.enterSignupData(user);
            await signupSteps.clickCreateAccount();
            await accountCreatedDeletedSteps.validateAccountActionText(CREATED);
            await accountCreatedDeletedSteps.clickContinue(StringUtils.capitalize(CREATED));
            await sharedSteps.validateUserLoggedText(homePage.header, user);
            await sharedSteps.clickDeleteAccount(homePage.header);
            await accountCreatedDeletedSteps.validateAccountActionText(DELETED);
            await accountCreatedDeletedSteps.clickContinue(StringUtils.capitalize(DELETED));

        });

    test('Register User with existing email',
        { tag: ['@SAMPLE-0014', '@TC5', '@user-register-error'] },
        async ({
            signupLoginSteps, apiSteps, homePage, sharedSteps
        }) => {

            const user: UserType = GenerateRandomUser();
            await apiSteps.createAccount(user);
            await sharedSteps.navigateHome(homePage);
            await sharedSteps.validateTitle('Home');
            await sharedSteps.clickSignupLogin(homePage.header);
            await signupLoginSteps.validateNewUserSignupText();
            await signupLoginSteps.enterSignupData(user);
            await signupLoginSteps.clickSignup();
            await signupLoginSteps.validateEmailAlreadyExistsMessage();
            await apiSteps.deleteAccount(user);
        });

});
