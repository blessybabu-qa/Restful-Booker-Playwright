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
    readonly errorMessage: Locator;

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
        this.errorMessage = page.getByText('Invalid credentials');

    }

    async verifyAdminLoginPageIsLoaded() {
        await expect(this.loginHeading).toBeVisible();
        await expect(this.userName).toBeVisible();
        await expect(this.password).toBeVisible();
        await expect(this.loginButton).toBeVisible();
    }

   async loginAsAdmin(user?: string, pass?: string) {
    const finalUser = user ?? process.env.ADMIN_EMAIL;
    const finalPass = pass ?? process.env.ADMIN_PASSWORD;
    if (finalUser === undefined || finalPass === undefined) {
        throw new Error(`Login Failed: Username or Password not found. 
            Check your .env file or the data being passed.`);
    }
    await this.userName.fill(finalUser!);
    await this.password.fill(finalPass!);
    await this.loginButton.click();
}

    async loginSuccessValidation() {
       await expect(this.rooms).toBeVisible();
       await expect(this.report).toBeVisible();
       await expect(this.branding).toBeVisible();
       await expect(this.messages).toBeVisible();
    }

    async verifyErrorMessage() {
        await expect(this.errorMessage).toBeVisible();
    }

}