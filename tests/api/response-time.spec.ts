import { test, expect } from '../../pages/fixtures';
import { TestData } from '../../pages/TestData';

// Measures the full round trip from the test machine, so it includes network time
const MAX_RESPONSE_TIME_MS = 2000;

test.describe('API response times', () => {

    test('should create a booking within 2 seconds', async ({ bookingService }) => {
        const payload = TestData.getApiBookingPayload();

        const startTime = Date.now();
        const response = await bookingService.createBooking(payload);
        const responseTime = Date.now() - startTime;

        expect(response.status()).toBe(200);
        expect(responseTime).toBeLessThan(MAX_RESPONSE_TIME_MS);
    });

    test('should get a booking within 2 seconds', async ({ bookingService, preCreatedBookingId }) => {
        const startTime = Date.now();
        const response = await bookingService.getBookingById(preCreatedBookingId);
        const responseTime = Date.now() - startTime;

        expect(response.status()).toBe(200);
        expect(responseTime).toBeLessThan(MAX_RESPONSE_TIME_MS);
    });

    test('should log in within 2 seconds', async ({ bookingService }) => {
        const startTime = Date.now();
        const response = await bookingService.login(process.env.API_ADMIN_USER!, process.env.API_ADMIN_PASSWORD!);
        const responseTime = Date.now() - startTime;

        expect(response.status()).toBe(200);
        expect(responseTime).toBeLessThan(MAX_RESPONSE_TIME_MS);
    });
});
