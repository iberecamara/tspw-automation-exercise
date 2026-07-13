import { NEWLINE } from '@data/constants/string.constants';
import { UserType } from '@data/model/user.model';
import { test } from '@fixtures/fixtures';
import { SignupPage } from '@pages/signup.page';
import { expect } from '@playwright/test';
import { TestAutomationLogger } from '@utils/logger.utils';
import { StringUtils } from '@utils/string.utils';

export class SignupSteps {

    // Actions
    async enterSignupData(logger: TestAutomationLogger, signupPage: SignupPage, user: UserType): Promise<void> {
        logger.debug(`Using signup data: ${NEWLINE}${StringUtils.prettyJson(user)}`)
        await test.step('Enter user data for Signup', async () => {
            await signupPage.chooseTitle(user.address.title);
            await signupPage.enterPassword(user.password);
            await signupPage.selectDobDay(user.address.birthDate);
            await signupPage.selectDobMonth(user.address.birthMonth);
            await signupPage.selectDobYear(user.address.birthYear);
            await signupPage.checkNewsletter(true);
            await signupPage.checkOptIn(true);
            await signupPage.enterAddressFirstName(user.address.firstname);
            await signupPage.enterAddressLastName(user.address.lastname);
            await signupPage.enterCompany(user.address.company);
            await signupPage.enterAddress(user.address.addressOne);
            await signupPage.enterAddressTwo(user.address.addressTwo);
            await signupPage.selectAddressCountry(user.address.country);
            await signupPage.enterAddressState(user.address.state);
            await signupPage.enterAddressCity(user.address.city);
            await signupPage.enterAddressZipCode(user.address.zipcode);
            await signupPage.enterAddressMobilePhone(user.address.mobileNumber);
        });
    }

    async clickCreateAccount(logger: TestAutomationLogger, signupPage: SignupPage): Promise<void> {
        logger.debug('Clicking Signup page Create Account link.');
        await test.step('Click Create Account in Signup page', async () => {
            await signupPage.clickCreateAccount();
        });
    }

    // Validations
    async validateEnterAccountInformationText(logger: TestAutomationLogger, signupPage: SignupPage): Promise<void> {
        logger.debug('Validating Signup page data entry heading text.');
        await test.step('Validate that Signup page have the expected text', async () => {
            await expect.soft(
                signupPage.locators.enterAccountInformationHeader,
                `Signup page 'Enter Account Information' should be visible`
            ).toBeVisible();
        });
    }

}