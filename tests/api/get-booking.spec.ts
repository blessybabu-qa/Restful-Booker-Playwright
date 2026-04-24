import { test, expect } from '../../pages/fixtures';

test('should retrieve the booking by the fixture-generated ID', async ({ bookingService, preCreatedBookingId }) => {
        const response = await bookingService.getBookingById(preCreatedBookingId);
        expect(response).toBeOK();
        const body = await response.json();
        expect(body.firstname).toBeDefined();
        expect(body.lastname).toBeDefined();
        expect(body.totalprice).toBeGreaterThan(0);
        
    });

    test('should return 404 when retrieving a non-existent booking', async ({ bookingService }) => {
        const nonExistentBookingId = 1010101010;
        const response = await bookingService.getBookingById(nonExistentBookingId);
        expect(response.status()).toBe(404);
    });
