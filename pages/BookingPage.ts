import { Locator, Page, expect,test } from '@playwright/test';
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
    readonly bookingConfirmation: Locator;
    readonly selectedDatesDisplay: Locator;
    readonly returnHomeButton: Locator

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
        this.bookingConfirmation = page.getByRole('heading', { name: 'Booking Confirmed' });
        this.selectedDatesDisplay =page.locator('p.text-center.pt-2 strong');
        this.returnHomeButton = page.getByRole('link', { name: 'Return home' });
        } 

        async verifyBookingSectionIsVisible() {
        await expect(this.bookThisRoom).toBeVisible({ timeout: 5000 });
       }

    async selectCheckInCheckOutDates() {
    const maxMonths = 5;

    for (let i = 0; i < maxMonths; i++) {
        await this.page.waitForTimeout(2000); 

        const dayCells = this.page.locator('.rbc-day-bg:not(.rbc-off-range)');
        const cellCount = await dayCells.count();

        for (let j = 0; j < cellCount - 1; j++) {
            const dayA = dayCells.nth(j);
            const dayB = dayCells.nth(j + 1);
            const hasEventA = await dayA.locator('xpath=./../..//*[contains(@class, "rbc-event")]').count() > 0;
            const hasEventB = await dayB.locator('xpath=./../..//*[contains(@class, "rbc-event")]').count() > 0;

            if (!hasEventA && !hasEventB) {
                const boxA = await dayA.boundingBox();
                const boxB = await dayB.boundingBox();

                if (boxA && boxB) {
                    await this.page.mouse.move(boxA.x + (boxA.width / 2), boxA.y + (boxA.height / 2));
                    await this.page.mouse.down();
                    await this.page.mouse.move(boxB.x + (boxB.width / 2), boxB.y + (boxB.height / 2), { steps: 60 });
                    await this.page.waitForTimeout(500); 
                    await this.page.mouse.up();
                    return; 
                }
            }
        }
        await this.nextMonth.click();
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

    async fillCustomerDetails(details: { firstName: string, lastName: string, email: string, phone: string }) {
    await this.firstName.fill(details.firstName);
    await this.lastName.fill(details.lastName);
    await this.email.fill(details.email);
    await this.phone.fill(details.phone);
}

async verifyBookingSuccess(): Promise<boolean> {
    await Promise.race([
        this.bookingConfirmation.waitFor({ state: 'visible', timeout: 15000 }).catch(() => {}),
        this.page.getByText('Application error').waitFor({ state: 'visible', timeout: 15000 }).catch(() => {})
    ]);
    const isAppError = await this.page.getByText('Application error').isVisible();
    if (isAppError) {
       
        return false; 
    }
    try {
        await expect(this.bookingConfirmation).toBeVisible({ timeout: 5000 });
        await this.returnHomeButton.click();
        await expect(this.bookingConfirmation).toBeHidden();
        return true;
    } catch (e) {
        return false;
    }
}
}