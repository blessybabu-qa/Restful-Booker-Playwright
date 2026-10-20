import { Locator, Page, expect,test } from '@playwright/test';
import { faker } from '@faker-js/faker';
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
    readonly successMessage: Locator;
    readonly selectedDatesDisplay: Locator;
    readonly returnHomeButton: Locator
    readonly monthLabel: Locator;
    readonly calendarDays: Locator;

     constructor(page: Page) {
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
        this.successMessage = page.getByRole('heading', { name: 'Booking Confirmed' });
        this.selectedDatesDisplay =page.locator('p.text-center.pt-2 strong');
        this.returnHomeButton = page.getByRole('link', { name: 'Return home' });
        this.monthLabel = page.locator('.rbc-toolbar-label');
        this.calendarDays = page.locator('.rbc-day-bg:not(.rbc-off-range-bg)');
        } 

        async verifyBookingSectionIsVisible() {
        await expect(this.bookThisRoom).toBeVisible({ timeout: 5000 });
       }

    async selectCheckInCheckOutDates() {
        // The calendar doesn't show booked days, so jump a random 1-12 months ahead
        // to make it unlikely that two runs pick the same dates
        const monthsAhead = faker.number.int({ min: 1, max: 12 });
        for (let i = 0; i < monthsAhead; i++) {
            await this.goToNextMonth();
        }

        const shownMonth = await this.monthLabel.innerText();
        const firstOfMonth = new Date(`1 ${shownMonth}`);
        const dayCount = await this.calendarDays.count();

        const startDays: number[] = [];
        for (let day = 1; day < dayCount; day++) {
            const checkin = new Date(firstOfMonth.getFullYear(), firstOfMonth.getMonth(), day);
            // Saturday and the next Sunday are in different calendar rows, so don't drag across them
            if (checkin.getDay() !== 6) {
                startDays.push(day);
            }
        }

        const startDay = faker.helpers.arrayElement(startDays);
        await this.dragBetweenDays(this.calendarDays.nth(startDay - 1), this.calendarDays.nth(startDay));
    }

    private async goToNextMonth() {
        const shownMonth = await this.monthLabel.innerText();
        await this.nextMonth.click();
        await expect(this.monthLabel).not.toHaveText(shownMonth);
    }

    private async dragBetweenDays(firstDay: Locator, secondDay: Locator) {
        const firstBox = await firstDay.boundingBox();
        const secondBox = await secondDay.boundingBox();
        await this.page.mouse.move(firstBox!.x + firstBox!.width / 2, firstBox!.y + firstBox!.height / 2);
        await this.page.mouse.down();
        await this.page.mouse.move(secondBox!.x + secondBox!.width / 2, secondBox!.y + secondBox!.height / 2, { steps: 60 });
        await this.page.mouse.up();
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

    async fillCustomerDetails(details: { firstName: string, lastName: string, email: string, phone: string }) {
    await this.firstName.fill(details.firstName);
    await this.lastName.fill(details.lastName);
    await this.email.fill(details.email);
    await this.phone.fill(details.phone);
}

async verifyBookingSuccess() {
    await expect(this.successMessage, 'Booking was not confirmed. Check the screenshot for an error page').toBeVisible({ timeout: 15000 });
}
}