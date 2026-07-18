import { Locator, Page } from '@playwright/test';

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
        this.enterAccountInformationHeader = page.getByText('Enter Account Information');
        this.loginInput = page.getByTestId('signup-name');
        this.emailInput = page.getByTestId('signup-email');
        this.signupButton = page.getByTestId('signup-button');
        this.titleMrRadio = page.locator('#id_gender1');
        this.titleMsRadio = page.locator('#id_gender2');
        this.passwordInput = page.getByTestId('password');
        this.dobDaysSelector = page.getByTestId('days');
        this.dobMonthsSelector = page.getByTestId('months');
        this.dobYearsSelector = page.getByTestId('years');
        this.newsletterCheckbox = page.getByRole('checkbox', { name: 'newsletter' });
        this.optInCheckbox = page.getByRole('checkbox', { name: 'Receive special offers from' });
        this.addressFirstNameInput = page.getByTestId('first_name');
        this.addressLastNameInput = page.getByTestId('last_name');
        this.addressCompanyInput = page.getByTestId('company');
        this.addressAddressInput = page.getByTestId('address');
        this.addressAddressTwoInput = page.getByTestId('address2');
        this.addressCountryInput = page.getByTestId('country');
        this.addressStateInput = page.getByTestId('state');
        this.addressCityInput = page.getByTestId('city');
        this.addressZipCodeInput = page.getByTestId('zipcode');
        this.addressMobileNumberInput = page.getByTestId('mobile_number');
        this.createAccountButton = page.getByRole('button', { name: 'Create Account' });
    }

    async inputLogin(login: string): Promise<void> {
        await this.loginInput.fill(login);
    }

    async inputEmail(email: string): Promise<void> {
        await this.emailInput.fill(email);
    }

    async clickSignup(): Promise<void> {
        await this.signupButton.click();
    }

    async setTitle(title: 'Mr.' | 'Ms.'): Promise<void> {
        const locator = title === 'Mr.' ? this.titleMrRadio : this.titleMsRadio;
        await locator.check();
    }

    async inputPassword(password: string): Promise<void> {
        await this.passwordInput.fill(password);
    }

    async selectDobDay(day: string): Promise<void> {
        await this.dobDaysSelector.selectOption(day);
    }

    async selectDobMonth(month: string): Promise<void> {
        await this.dobMonthsSelector.selectOption(month);
    }

    async selectDobYear(year: string): Promise<void> {
        await this.dobYearsSelector.selectOption(year);
    }

    async checkNewsletter(checked: boolean): Promise<void> {
        if (checked) {
            await this.newsletterCheckbox.check();
        } else {
            await this.newsletterCheckbox.uncheck();
        }
    }

    async checkOptIn(checked: boolean): Promise<void> {
        if (checked) {
            await this.optInCheckbox.check();
        } else {
            await this.optInCheckbox.uncheck();
        }
    }

    async inputAddressFirstName(name: string): Promise<void> {
        await this.addressFirstNameInput.fill(name);
    }

    async inputAddressLastName(name: string): Promise<void> {
        await this.addressLastNameInput.fill(name);
    }

    async inputCompany(company: string): Promise<void> {
        await this.addressCompanyInput.fill(company);
    }

    async inputAddress(address: string): Promise<void> {
        await this.addressAddressInput.fill(address);
    }

    async inputAddressTwo(address: string): Promise<void> {
        await this.addressAddressTwoInput.fill(address);
    }

    async selectAddressCountry(country: string): Promise<void> {
        await this.addressCountryInput.selectOption(country);
    }

    async inputAddressState(state: string): Promise<void> {
        await this.addressStateInput.fill(state);
    }

    async inputAddressCity(city: string): Promise<void> {
        await this.addressCityInput.fill(city);
    }

    async inputAddressZipCode(zipcode: string): Promise<void> {
        await this.addressZipCodeInput.fill(zipcode);
    }

    async inputAddressMobilePhone(phone: string): Promise<void> {
        await this.addressMobileNumberInput.fill(phone);
    }

    async clickCreateAccountButton(): Promise<void> {
        await this.createAccountButton.click();
    }

}