import { Page } from '@playwright/test';

export class BasePage {
    readonly page: Page;
    constructor(page: Page) {
        this.page = page;
    }

    async navigate() {
        await this.page.goto('/');
    }

    async waitForPageLoad() {
        await this.page.waitForLoadState('networkidle');
    }
}