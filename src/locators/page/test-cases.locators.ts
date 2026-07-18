import { Page } from '@playwright/test';

export class TestCasesLocators {

    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

}