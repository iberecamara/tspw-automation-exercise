import { Environment } from '@configs/environment.config';
import { MINUTE_IN_MILISSECONDS } from '@data/constants/common.constants';
import { Locator, Page } from '@playwright/test';

export class BasePage {

    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async goToHome(): Promise<void> {
        await this.page.goto(Environment.BASE_URL, { timeout: 30 * MINUTE_IN_MILISSECONDS });
    }

    async click(locator: Locator): Promise<void> {
        await locator.click();
    }

    async checkbox(locator: Locator, checked: boolean): Promise<void> {
        if (checked) {
            await locator.check();
        } else {
            await locator.uncheck();
        }
    }

    async fill(locator: Locator, text: string): Promise<void> {
        await locator.fill(text);
    }

    async selectOption(locator: Locator, option: string): Promise<void> {
        await locator.selectOption(option);
    }

    async hover(locator: Locator): Promise<void> {
        await locator.hover();
    }

    async scroll(direction: string) {
        const scroller = (async (direction: string) => {
            const DOWN = 'down'; // Redeclaring the constant here due to hoisting
            const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
            const scrollHeight = () => document.body.scrollHeight;
            const start = direction === DOWN ? 0 : scrollHeight();
            const shouldStop = (position: number) => direction === DOWN ? position > scrollHeight() : position < 0;
            const increment = direction === DOWN ? 100 : -100;
            for (let i = start; !shouldStop(i); i += increment) {
                window.scrollTo(0, i);
                await delay(5);
            }
        });
        await this.page.evaluate(scroller, direction);
    }


}