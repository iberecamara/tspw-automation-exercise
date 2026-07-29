import { VALID_TITLES } from "@data/constants/constants";
import { TestAutomationException } from "@exceptions/test-automation.exception";
import { BasePage } from "@pages.base/base.page";
import { SignupLocators } from "@pages.base/locators/page/signup.locators";
import { Locator, Page } from "@playwright/test";

/** The account signup (registration) page — full account details form (title, name/email/password, date of birth, newsletter/offers opt-ins, and address). */
export class SignupPage extends BasePage {
  readonly locators: SignupLocators;

  constructor(page: Page) {
    super(page);
    this.locators = new SignupLocators(page);
  }

  /** Fills the "Name" field. */
  async enterLogin(login: string): Promise<void> {
    await this.fill(this.locators.loginInput, login);
  }

  /** Fills the "Email" field. */
  async enterEmail(email: string): Promise<void> {
    await this.fill(this.locators.emailInput, email);
  }

  /** Clicks "Signup". */
  async clickSignup(): Promise<void> {
    await this.click(this.locators.signupButton);
  }

  /**
   * Selects the "Mr."/"Ms." title radio button.
   *
   * @param title - Must be one of {@link VALID_TITLES}.
   * @throws {TestAutomationException} If `title` isn't a valid title.
   */
  async chooseTitle(title: string): Promise<void> {
    if (!VALID_TITLES.includes(title)) {
      throw new TestAutomationException(
        `Invalid title: ${title}, must be one of ${VALID_TITLES.join(", ")}`,
      );
    }
    const locator: Locator =
      title === "Mr." ? this.locators.titleMrRadio : this.locators.titleMsRadio;
    await this.checkbox(locator, true);
  }

  /** Fills the "Password" field. */
  async enterPassword(password: string): Promise<void> {
    await this.fill(this.locators.passwordInput, password);
  }

  /** Selects the date-of-birth day dropdown, waiting for it to be visible first. */
  async selectDobDay(day: string): Promise<void> {
    await this.locators.dobDaysSelector.waitFor({ state: "visible" });
    await this.selectOption(this.locators.dobDaysSelector, day);
  }

  /** Selects the date-of-birth month dropdown, waiting for it to be visible first. */
  async selectDobMonth(month: string): Promise<void> {
    await this.locators.dobMonthsSelector.waitFor({ state: "visible" });
    await this.selectOption(this.locators.dobMonthsSelector, month);
  }

  /** Selects the date-of-birth year dropdown, waiting for it to be visible first. */
  async selectDobYear(year: string): Promise<void> {
    await this.locators.dobYearsSelector.waitFor({ state: "visible" });
    await this.selectOption(this.locators.dobYearsSelector, year);
  }

  /** Checks/unchecks the "Sign up for our newsletter!" checkbox. */
  async checkNewsletter(checked: boolean): Promise<void> {
    await this.checkbox(this.locators.newsletterCheckbox, checked);
  }

  /** Checks/unchecks the "Receive special offers from our partners!" checkbox. */
  async checkOptIn(checked: boolean): Promise<void> {
    await this.checkbox(this.locators.optInCheckbox, checked);
  }

  /** Fills the address section's first name field. */
  async enterAddressFirstName(name: string): Promise<void> {
    await this.fill(this.locators.addressFirstNameInput, name);
  }

  /** Fills the address section's last name field. */
  async enterAddressLastName(name: string): Promise<void> {
    await this.fill(this.locators.addressLastNameInput, name);
  }

  /** Fills the "Company" field. */
  async enterCompany(company: string): Promise<void> {
    await this.fill(this.locators.addressCompanyInput, company);
  }

  /** Fills the "Address" field. */
  async enterAddress(address: string): Promise<void> {
    await this.fill(this.locators.addressAddressInput, address);
  }

  /** Fills the "Address 2" field. */
  async enterAddressTwo(address: string): Promise<void> {
    await this.fill(this.locators.addressAddressTwoInput, address);
  }

  /** Selects the "Country" dropdown. */
  async selectAddressCountry(country: string): Promise<void> {
    await this.selectOption(this.locators.addressCountryInput, country);
  }

  /** Fills the "State" field. */
  async enterAddressState(state: string): Promise<void> {
    await this.fill(this.locators.addressStateInput, state);
  }

  /** Fills the "City" field. */
  async enterAddressCity(city: string): Promise<void> {
    await this.fill(this.locators.addressCityInput, city);
  }

  /** Fills the "Zipcode" field. */
  async enterAddressZipCode(zipcode: string): Promise<void> {
    await this.fill(this.locators.addressZipCodeInput, zipcode);
  }

  /** Fills the "Mobile Number" field. */
  async enterAddressMobilePhone(phone: string): Promise<void> {
    await this.fill(this.locators.addressMobileNumberInput, phone);
  }

  /** Clicks "Create Account", submitting the form. */
  async clickCreateAccount(): Promise<void> {
    await this.click(this.locators.createAccountButton);
  }
}
