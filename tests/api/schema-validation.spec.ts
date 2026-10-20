import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { test, expect } from '../../pages/fixtures';
import { TestData } from '../../pages/TestData';
import { bookingSchema } from '../../schemas/booking.schema';
import { createBookingSchema } from '../../schemas/create-booking.schema';
import { tokenSchema } from '../../schemas/token.schema';

// allErrors lists every wrong field, not only the first one; addFormats adds checks like format: 'date'
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

test.describe('API response schemas', () => {

    test('should return a created booking that matches the schema', async ({ bookingService }) => {
        const payload = TestData.getApiBookingPayload();

        const response = await bookingService.createBooking(payload);
        expect(response.status()).toBe(200);

        const responseBody = await response.json();
        const validate = ajv.compile(createBookingSchema);
        validate(responseBody);

        // errors is null when the response matches; otherwise it lists each wrong field
        expect(validate.errors).toBeNull();
    });

    test('should return a booking that matches the schema', async ({ bookingService, preCreatedBookingId }) => {
        const response = await bookingService.getBookingById(preCreatedBookingId);
        expect(response.status()).toBe(200);

        const responseBody = await response.json();
        const validate = ajv.compile(bookingSchema);
        validate(responseBody);

        expect(validate.errors).toBeNull();
    });

    test('should return an updated booking that matches the schema', async ({ bookingService, preCreatedBookingId, authToken }) => {
        const updatedPayload = TestData.getApiBookingPayload();

        const response = await bookingService.updateBooking(preCreatedBookingId, updatedPayload, authToken);
        expect(response.status()).toBe(200);

        const responseBody = await response.json();
        const validate = ajv.compile(bookingSchema);
        validate(responseBody);

        expect(validate.errors).toBeNull();
    });

    test('should return a partially updated booking that matches the schema', async ({ bookingService, preCreatedBookingId }) => {
        const patchData = TestData.getPatchPayload();

        const response = await bookingService.patchBooking(preCreatedBookingId, patchData, process.env.API_ADMIN_TOKEN);
        expect(response.status()).toBe(200);

        const responseBody = await response.json();
        const validate = ajv.compile(bookingSchema);
        validate(responseBody);

        expect(validate.errors).toBeNull();
    });

    test('should return a token that matches the schema', async ({ bookingService }) => {
        const response = await bookingService.login(process.env.API_ADMIN_USER!, process.env.API_ADMIN_PASSWORD!);
        expect(response.status()).toBe(200);

        const responseBody = await response.json();
        const validate = ajv.compile(tokenSchema);
        validate(responseBody);

        expect(validate.errors).toBeNull();
    });
});
