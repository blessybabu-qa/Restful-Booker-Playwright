import { Page, Locator } from '@playwright/test';

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

    async waitAndFill(locator: Locator, value: string) {
        await locator.waitFor({ state: 'visible', timeout: 5000 });
        await locator.fill(value);
    }

    async waitAndClick(locator: Locator) {
        await locator.waitFor({ state: 'visible' });
        await locator.click();
    }
}