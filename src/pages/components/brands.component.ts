import { EMPTY } from '@data/constants/string.constants';
import { BrandsComponentLocators } from '@locators/component/brands.locators';
import { BasePage } from '@pages.base/base.page';
import { Page } from '@playwright/test';

export class BrandsComponent extends BasePage {

    readonly locators: BrandsComponentLocators;

    constructor(page: Page) {
        super(page);
        this.locators = new BrandsComponentLocators(page);
    }

    async getBrands(): Promise<string[]> {
        const brands: string[] = [];
        const brandsLocators = await this.locators.brands.all();
        for (const locator of brandsLocators) {
            const text = await locator.textContent() ?? EMPTY;
            if (text) {
                brands.push(text.replace(/^\s+/, EMPTY).replace(/\(.*?\)/, EMPTY));
            }
        }
        return brands;
    }

    async selectBrand(brand: string): Promise<void> {
        await this.click(this.locators.brandByName(brand));
    }
}
