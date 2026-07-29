import { EMPTY } from "@data/constants/string.constants";
import { UserType } from "@data/model/user.model";
import { SignupPage } from "@pages/signup.page";
import { expect } from "@playwright/test";
import { BaseSteps } from "@steps/base.steps";
import { prettyJson } from "@utils/string.utils";

/** Readable, logged steps driving {@link SignupPage}. */
export class SignupSteps extends BaseSteps {
  readonly signupPage: SignupPage;

  constructor(signupPage: SignupPage) {
    super();
    this.signupPage = signupPage;
  }

  // Actions

  /**
   * Fills the full account details form from a {@link UserType} (title, password, date of
   * birth, address). Always opts in to both the newsletter and special-offers checkboxes,
   * regardless of `user`'s own fields (there's currently no per-user control over those two
   * checkboxes through this step).
   */
  async enterSignupData(user: UserType): Promise<void> {
    this.logger.verbose(`Using signup data: ${prettyJson(user)}`);
    await this.step("Enter user data for Signup", async () => {
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

  /** Clicks "Create Account". */
  async clickCreateAccount(): Promise<void> {
    await this.step("Click Create Account in Signup page", async () => {
      await this.signupPage.clickCreateAccount();
    });
  }

  // Validations

  /** Validates the "Enter Account Information" form heading is displayed with the expected text. */
  async validateEnterAccountInformationText(): Promise<void> {
    await this.step(
      "Validate that Signup page have the expected text",
      async () => {
        const headingText = "Enter Account Information";
        await expect
          .soft(
            this.signupPage.locators.enterAccountInformationHeader,
            `Signup form heading text should be visible`,
          )
          .toBeVisible();
        await expect
          .soft(
            this.signupPage.locators.enterAccountInformationHeader,
            `Signup form heading text should be '${headingText}'`,
          )
          .toHaveText(headingText);
      },
    );
  }
}
