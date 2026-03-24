import { Page } from '@playwright/test';
import { HomePage } from './HomePage';
import { BookingPage } from './BookingPage';
import { RoomPage } from './RoomPage';
import { ContactPage } from './ContactPage';

export class POManager {
    readonly page: Page;
    readonly homePage: HomePage;
    readonly bookingPage: BookingPage;
    readonly roomPage: RoomPage;
    readonly contactPage: ContactPage;

    constructor(page: Page) {
        this.page = page;
        this.homePage = new HomePage(this.page);
        this.bookingPage = new BookingPage(this.page);
        this.roomPage = new RoomPage(this.page);
        this.contactPage = new ContactPage(this.page);
    }

    async navigate() {
        await this.homePage.navigate();
    }
}