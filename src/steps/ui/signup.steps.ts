import { EMPTY } from "@data/constants/string.constants";
import { UserType } from "@data/model/user.model";
import { test } from "@fixtures/fixtures";
import { SignupPage } from "@pages/signup.page";
import { expect } from "@playwright/test";
import { BaseSteps } from "@steps/base.steps";
import { StringUtils } from "@utils/string.utils";

export class SignupSteps extends BaseSteps {
  readonly signupPage: SignupPage;

  constructor(signupPage: SignupPage) {
    super();
    this.signupPage = signupPage;
  }

  // Actions
  async enterSignupData(user: UserType): Promise<void> {
    this.logger.debug(`Using signup data: ${StringUtils.prettyJson(user)}`);

    await test.step("Enter user data for Signup", async () => {
      await this.signupPage.chooseTitle(user.address.title);
      await this.signupPage.enterPassword(user.password ?? EMPTY);
      await this.signupPage.selectDobDay(user.address.birthDate);
      await this.signupPage.selectDobMonth(user.address.birthMonth);
      await this.signupPage.selectDobYear(user.address.birthYear);
      await this.signupPage.checkNewsletter(true);
      await this.signupPage.checkOptIn(true);
      await this.signupPage.enterAddressFirstName(user.address.firstname);
      await this.signupPage.enterAddressLastName(user.address.lastname);
      await this.signupPage.enterCompany(user.address.company);
      await this.signupPage.enterAddress(user.address.addressOne);
      await this.signupPage.enterAddressTwo(user.address.addressTwo);
      await this.signupPage.selectAddressCountry(user.address.country);
      await this.signupPage.enterAddressState(user.address.state);
      await this.signupPage.enterAddressCity(user.address.city);
      await this.signupPage.enterAddressZipCode(user.address.zipcode);
      await this.signupPage.enterAddressMobilePhone(
        user.address.mobileNumber ?? EMPTY,
      );
    });
  }

  async clickCreateAccount(): Promise<void> {
    this.logger.debug("Clicking Signup page Create Account link.");

    await test.step("Click Create Account in Signup page", async () => {
      await this.signupPage.clickCreateAccount();
    });

    this.logger.debug("Clicked Signup page Create Account link.");
  }

  // Validations
  async validateEnterAccountInformationText(): Promise<void> {
    this.logger.debug("Validating Signup page data entry heading text.");

    await test.step("Validate that Signup page have the expected text", async () => {
      await expect
        .soft(
          this.signupPage.locators.enterAccountInformationHeader,
          `Signup page 'Enter Account Information' should be visible`,
        )
        .toBeVisible();
    });
  }
}
