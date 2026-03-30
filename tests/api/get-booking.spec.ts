import { test, expect } from '../../pages/fixtures';

test('should retrieve the booking by the fixture-generated ID', async ({ bookingService, preCreatedBookingId }) => {
        const response = await bookingService.getBookingById(preCreatedBookingId);
        expect(response).toBeOK();
        const body = await response.json();
        expect(body.firstname).toBeDefined();
        expect(body.lastname).toBeDefined();
        expect(body.totalprice).toBeGreaterThan(0);
        
    });
