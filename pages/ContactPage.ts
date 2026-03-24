import { Locator, Page, errors, expect,test } from '@playwright/test';
import { BasePage } from "./BasePage";


export class ContactPage extends BasePage {

    readonly contactForm: Locator;
    readonly name: Locator;
    readonly email: Locator;
    readonly phone: Locator;
    readonly subject: Locator;
    readonly message: Locator;
    readonly submitButton: Locator;
    readonly successHeading: Locator;
    readonly alert: Locator


    constructor(page: any) {
        super(page); 
        this.contactForm = page.getByText('Send Us a MessageNameEmailPhoneSubjectMessageSubmit');
        this.name = page.getByTestId('ContactName');
        this.email = page.getByTestId('ContactEmail');
        this.phone = page.getByTestId('ContactPhone');
        this.subject = page.getByTestId('ContactSubject');
        this.message = page.getByTestId('ContactDescription');
        this.submitButton = page.getByRole('button', { name: 'Submit' });
        this.successHeading = page.getByRole('heading', { name: /Thanks for getting in touch/i });
        this.alert = page.locator('.alert.alert-danger');

    }

    async contactFormVisible() {
        await expect(this.contactForm).toBeVisible({ timeout: 5000 });
    }

    async fillContactForm(details: { name: string, email: string, phone: string, subject: string, message: string }) {
    await this.name.fill(details.name);
    await this.email.fill(details.email);
    await this.phone.fill(details.phone);
    await this.subject.fill(details.subject);
    await this.message.fill(details.message);
    }

    async submitContactForm() {
        await this.submitButton.scrollIntoViewIfNeeded();
        await this.submitButton.click();
    }

    async verifySuccessMessage(name: string) {
        const expectedText = `Thanks for getting in touch ${name}!`;
        await expect(this.successHeading).toHaveText(expectedText);
    }

    async verifyValidationErrorsAreVisible(expectedErrors: string[]) {
        
        await expect(this.alert).toBeVisible();
        for (const error of expectedErrors) {
        await expect(this.alert).toContainText(error);
    }
    }
    }