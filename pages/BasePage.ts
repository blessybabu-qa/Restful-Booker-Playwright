import { Page } from '@playwright/test';

export class BasePage {
    readonly page: Page;
    readonly baseUrl: string = 'https://automationintesting.online/';

    constructor(page: Page) {
        this.page = page;
    }

    //method to navigate to the base URL
    async navigate() {
        await this.page.goto(this.baseUrl);
    }

   // method to wait for the page to be ready
    async waitForPageLoad() {
        await this.page.waitForLoadState('networkidle');
    }
}