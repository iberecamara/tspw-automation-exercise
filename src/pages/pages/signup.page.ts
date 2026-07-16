import { VALID_TITLES } from '@data/constants/constants';
import { TestAutomationException } from '@exceptions/test-automation.exception';
import { SignupLocators } from '@locators/page/signup.locators';
import { BasePage } from '@pages.base/base.page';
import { Locator, Page } from '@playwright/test';

export class SignupPage extends BasePage {

    readonly locators: SignupLocators;

    constructor(page: Page) {
        super(page);
        this.locators = new SignupLocators(page);
    }

    async enterLogin(login: string): Promise<void> {
        await this.fill(this.locators.loginInput, login);
    }

    async enterEmail(email: string): Promise<void> {
        await this.fill(this.locators.emailInput, email);
    }

    async clickSignup(): Promise<void> {
        await this.click(this.locators.signupButton);
    }

    async chooseTitle(title: string): Promise<void> {
        if (!VALID_TITLES.includes(title)) {
            throw new TestAutomationException(`Invalid title: ${title}, must be one of ${VALID_TITLES}`);
        }
        const locator: Locator = title === 'Mr.' ? this.locators.titleMrRadio : this.locators.titleMsRadio;
        await this.checkbox(locator, true);
    }

    async enterPassword(password: string): Promise<void> {
        await this.fill(this.locators.passwordInput, password);
    }

    async selectDobDay(day: string): Promise<void> {
        await this.selectOption(this.locators.dobDaysSelector, day);
    }

    async selectDobMonth(month: string): Promise<void> {
        await this.selectOption(this.locators.dobMonthsSelector, month);
    }

    async selectDobYear(year: string): Promise<void> {
        await this.selectOption(this.locators.dobYearsSelector, year);
    }

    async checkNewsletter(checked: boolean): Promise<void> {
        await this.checkbox(this.locators.newsletterCheckbox, checked);
    }

    async checkOptIn(checked: boolean): Promise<void> {
        await this.checkbox(this.locators.optInCheckbox, checked);
    }

    async enterAddressFirstName(name: string): Promise<void> {
        await this.fill(this.locators.addressFirstNameInput, name);
    }

    async enterAddressLastName(name: string): Promise<void> {
        await this.fill(this.locators.addressLastNameInput, name);
    }

    async enterCompany(company: string): Promise<void> {
        await this.fill(this.locators.addressCompanyInput, company);
    }

    async enterAddress(address: string): Promise<void> {
        await this.fill(this.locators.addressAddressInput, address);
    }

    async enterAddressTwo(address: string): Promise<void> {
        await this.fill(this.locators.addressAddressTwoInput, address);
    }

    async selectAddressCountry(country: string): Promise<void> {
        await this.selectOption(this.locators.addressCountryInput, country);
    }

    async enterAddressState(state: string): Promise<void> {
        await this.fill(this.locators.addressStateInput, state);
    }

    async enterAddressCity(city: string): Promise<void> {
        await this.fill(this.locators.addressCityInput, city);
    }

    async enterAddressZipCode(zipcode: string): Promise<void> {
        await this.fill(this.locators.addressZipCodeInput, zipcode);
    }

    async enterAddressMobilePhone(phone: string): Promise<void> {
        await this.fill(this.locators.addressMobileNumberInput, phone);
    }

    async clickCreateAccount(): Promise<void> {
        await this.click(this.locators.createAccountButton);
    }

}