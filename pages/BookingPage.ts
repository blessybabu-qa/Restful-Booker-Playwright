import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from "./BasePage";

export class BookingPage extends BasePage {
    readonly bookThisRoom: Locator;
    readonly nextMonth : Locator
    readonly dateCells: Locator;
    readonly reserveButton: Locator;
    readonly firstName: Locator;
    readonly lastName: Locator;
    readonly email: Locator;
    readonly phone: Locator;
    readonly alert: Locator


     constructor(page: any) {
        super(page); 
        this.bookThisRoom = page.getByRole('heading', { name: 'Book This Room' });
        this.dateCells = page.locator('.rbc-date-cell');
        this.reserveButton = page.getByRole('button', { name: 'Reserve Now' });
        this.nextMonth = page.getByRole('button', { name: 'Next' });
        this.firstName = page.getByRole('textbox', { name: 'Firstname' });
        this.lastName = page.getByRole('textbox', { name: 'Lastname' });
        this.email = page.getByRole('textbox', { name: 'Email' });
        this.phone = page.getByRole('textbox', { name: 'Phone' });
        this.alert = page.locator('.alert.alert-danger');
        } 

        async verifyBookingSectionIsVisible() {
        await expect(this.bookThisRoom).toBeVisible({ timeout: 5000 });
       }

       async selectCheckInCheckOutDates() {
        await this.nextMonth.click();
        await this.dateCells.filter({ hasText: /^01$/ }).first().waitFor({ state: 'visible' });
        const startDay = this.dateCells.filter({ hasText: /^01$/ }).first();
        const endDay = this.dateCells.filter({ hasText: /^04$/ }).first();
        const startBox = await startDay.boundingBox();
        const endBox = await endDay.boundingBox();
        if (startBox && endBox) {
            await this.page.mouse.move(
                startBox.x + startBox.width / 2, 
                startBox.y + startBox.height / 2
            );
            await this.page.mouse.down();
            await this.page.mouse.move(
                endBox.x + endBox.width / 2, 
                endBox.y + endBox.height / 2, 
                { steps: 10 }
            );
            await this.page.mouse.up();
        } else {
            throw new Error("Could not calculate calendar day coordinates. Check if the calendar is visible.");
        }
}

    async clickReserve() {
        await this.reserveButton.click();
    }

    async verifyCustomerDetailsFormIsVisible() {
        await expect(this.firstName).toBeVisible({ timeout: 5000 });
        await expect(this.email).toBeVisible();
       
    }

    async verifyAllErrorsAreVisible() {
        
        await expect(this.alert).toBeVisible();

    const expectedErrors = [
            'Lastname should not be blank',
            'Firstname should not be blank',
            'size must be between 11 and 21',
            'must not be empty'
        ];

        for (const error of expectedErrors) {
            await expect(this.alert).toContainText(error);
        }
    }
}