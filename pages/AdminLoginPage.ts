import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from "./BasePage";


export class AdminLoginPage extends BasePage {
    readonly loginHeading: Locator;
    readonly userName: Locator;
    readonly password: Locator;
    readonly loginButton: Locator
    readonly rooms: Locator;
    readonly report: Locator;
    readonly branding: Locator;
    readonly messages: Locator;

    constructor(page: Page) {
        super(page);
        this.loginHeading = page.getByRole('heading', { name: 'Login' });
        this.userName = page.getByRole('textbox', { name: 'Username' });
        this.password = page.getByRole('textbox', { name: 'Password' });
        this.loginButton = page.getByRole('button', { name: 'Login' });
        this.rooms = page.getByRole('link', { name: 'Rooms' });
        this.report = page.getByRole('link', { name: 'Report' });
        this.branding = page.getByRole('link', { name: 'Branding' });
        this.messages = page.getByRole('link', { name: 'Messages' });

    }

    async verifyAdminLoginPageIsLoaded() {
        await expect(this.loginHeading).toBeVisible();
        await expect(this.userName).toBeVisible();
        await expect(this.password).toBeVisible();
        await expect(this.loginButton).toBeVisible();
    }

    async loginAsAdmin() {
       
        const username = process.env.ADMIN_EMAIL;
        const password = process.env.ADMIN_PASSWORD;
        if (!username || !password) {
    throw new Error("Missing credentials..."); 
}
        await this.waitAndFill(this.userName, username);
        await this.waitAndFill(this.password, password);
        await this.waitAndClick(this.loginButton);
    }

    async loginSuccessValidation() {
       await expect(this.rooms).toBeVisible();
       await expect(this.report).toBeVisible();
       await expect(this.branding).toBeVisible();
       await expect(this.messages).toBeVisible();
    }

}