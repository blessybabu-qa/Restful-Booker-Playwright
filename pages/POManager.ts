import { Page } from '@playwright/test';
import { HomePage } from './HomePage';
import { BookingPage } from './BookingPage';

export class POManager {
    readonly page: Page;
    readonly homePage: HomePage;
    readonly bookingPage: BookingPage;

    constructor(page: Page) {
        this.page = page;
        this.homePage = new HomePage(this.page);
        this.bookingPage = new BookingPage(this.page);
    }

    async navigate() {
        await this.homePage.navigate();
    }
}