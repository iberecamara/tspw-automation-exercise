import { Locator, Page } from "@playwright/test";

export class SignupLocators {
  readonly enterAccountInformationHeader: Locator;
  readonly loginInput: Locator;
  readonly emailInput: Locator;
  readonly signupButton: Locator;
  readonly titleMrRadio: Locator;
  readonly titleMsRadio: Locator;
  readonly passwordInput: Locator;
  readonly dobDaysSelector: Locator;
  readonly dobMonthsSelector: Locator;
  readonly dobYearsSelector: Locator;
  readonly newsletterCheckbox: Locator;
  readonly optInCheckbox: Locator;
  readonly addressFirstNameInput: Locator;
  readonly addressLastNameInput: Locator;
  readonly addressCompanyInput: Locator;
  readonly addressAddressInput: Locator;
  readonly addressAddressTwoInput: Locator;
  readonly addressCountryInput: Locator;
  readonly addressStateInput: Locator;
  readonly addressCityInput: Locator;
  readonly addressZipCodeInput: Locator;
  readonly addressMobileNumberInput: Locator;
  readonly createAccountButton: Locator;

  constructor(page: Page) {
    this.enterAccountInformationHeader = page.getByText(
      "Enter Account Information",
    );
    this.loginInput = page.getByTestId("signup-name");
    this.emailInput = page.getByTestId("signup-email");
    this.signupButton = page.getByTestId("signup-button");
    this.titleMrRadio = page.locator("#id_gender1");
    this.titleMsRadio = page.locator("#id_gender2");
    this.passwordInput = page.getByTestId("password");
    this.dobDaysSelector = page.getByTestId("days");
    this.dobMonthsSelector = page.getByTestId("months");
    this.dobYearsSelector = page.getByTestId("years");
    this.newsletterCheckbox = page.getByRole("checkbox", {
      name: "newsletter",
    });
    this.optInCheckbox = page.getByRole("checkbox", {
      name: "Receive special offers from",
    });
    this.addressFirstNameInput = page.getByTestId("first_name");
    this.addressLastNameInput = page.getByTestId("last_name");
    this.addressCompanyInput = page.getByTestId("company");
    this.addressAddressInput = page.getByTestId("address");
    this.addressAddressTwoInput = page.getByTestId("address2");
    this.addressCountryInput = page.getByTestId("country");
    this.addressStateInput = page.getByTestId("state");
    this.addressCityInput = page.getByTestId("city");
    this.addressZipCodeInput = page.getByTestId("zipcode");
    this.addressMobileNumberInput = page.getByTestId("mobile_number");
    this.createAccountButton = page.getByRole("button", {
      name: "Create Account",
    });
  }
}
