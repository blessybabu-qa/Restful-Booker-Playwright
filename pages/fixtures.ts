import { test as base, APIRequestContext } from '@playwright/test';
import { POManager } from './POManager';
import { BookingService } from '../api-clients/BookingService';
import { TestData } from '../pages/TestData';


type MyFixtures = {
    pom: POManager;
    bookingService: BookingService;
    preCreatedBookingId: number;
    authToken: string;
};

export const test = base.extend<MyFixtures>({
    pom: async ({ page }, use) => {
        const pom = new POManager(page);
        await page.setViewportSize({ width: 1920, height: 1080 });
        await pom.navigate();
        await page.evaluate(() => {
            window.localStorage.clear();
            window.sessionStorage.clear();
        });
        await page.reload({ waitUntil: 'networkidle' });
        await use(pom);
        await page.close();
    },

    bookingService: async ({ request }: { request: APIRequestContext }, use: (r: BookingService) => Promise<void>) => {
        const bookingService = new BookingService(request);
        await use(bookingService);
    },

    preCreatedBookingId: async ({ bookingService }, use) => {
        const payload = TestData.getApiBookingPayload();
        const response = await bookingService.createBooking(payload);
        if (!response.ok()) {
            throw new Error(`Failed to pre-create booking: ${response.statusText()}`);
        }
       const body = await response.json();
        const id = body.bookingid;
        await use(id);

    },

    authToken: async ({ bookingService }, use) => {
        const token = await bookingService.createToken();
        await use(token);
    },
  });      

export { expect } from '@playwright/test';