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

test('should return 400 when creating a booking with invalid data', async ({ bookingService }) => {
        const invalidPayload = true;
        const response = await bookingService.createBooking(invalidPayload as any);
        expect(response.status()).toBe(400);
    
});

test('should return 400 when firstname is empty', {
    annotation: { type: 'known bug', description: 'API returns 200 and creates the booking with a blank firstname' },
}, async ({ bookingService }) => {
        test.fail();
        const payload = TestData.getApiBookingPayload();
        (payload as any).firstname = '';
        const response = await bookingService.createBooking(payload);
        expect(response.status()).toBe(400);

});

test('should return 400 when firstname is missing', {
    annotation: { type: 'known bug', description: 'API returns 500 Internal Server Error when the firstname field is left out' },
}, async ({ bookingService }) => {
    test.fail();
    const payload = TestData.getApiBookingPayload();
    delete (payload as any).firstname;
    const response = await bookingService.createBooking(payload);
    expect(response.status()).toBe(400);
});

test.describe('Boundary Testing - totalprice', () => {

    test('should allow totalprice to be 0 (Free Booking)', async ({ bookingService }) => {
        const payload = TestData.getApiBookingPayload();
        payload.totalprice = 0;
        const response = await bookingService.createBooking(payload);
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.booking.totalprice).toBe(0);
    });

    test('should return 400 when totalprice is negative', {
        annotation: { type: 'known bug', description: 'API returns 200 and creates the booking with totalprice -1' },
    }, async ({ bookingService }) => {
        test.fail();
        const payload = TestData.getApiBookingPayload();
        (payload as any).totalprice = -1;
        const response = await bookingService.createBooking(payload);
        expect(response.status()).toBe(400);
    });

    test('should allow a very large totalprice (999999)', async ({ bookingService }) => {
        const payload = TestData.getApiBookingPayload();
        payload.totalprice = 999999;
        const response = await bookingService.createBooking(payload);
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.booking.totalprice).toBe(999999);
    });
});

    

