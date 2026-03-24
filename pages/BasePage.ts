import { Page } from '@playwright/test';

export class BasePage {
    readonly page: Page;
    readonly baseUrl: string = 'https://automationintesting.online/';

    constructor(page: Page) {
        this.page = page;
    }

    async navigate() {
        await this.page.goto(this.baseUrl);
    }

    async waitForPageLoad() {
        await this.page.waitForLoadState('networkidle');
    }
}