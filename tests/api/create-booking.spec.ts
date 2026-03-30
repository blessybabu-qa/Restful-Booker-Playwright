import { test, expect } from '../../pages/fixtures';
import { TestData } from '../../pages/TestData';

test('should successfully create a booking ', async ({ bookingService }) => {
        const payload = TestData.getApiBookingPayload();
        const response = await bookingService.createBooking(payload);
        expect(response, `Expected 200 OK but got ${response.status()}`).toBeOK();
        const responseBody = await response.json();
        const { bookingid } = responseBody;
        expect(bookingid).toBeDefined();
        expect(typeof bookingid).toBe('number');
        expect(bookingid).toBeGreaterThan(0);
    
});

    

