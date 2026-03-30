import { test, expect } from '../../pages/fixtures';
import { TestData } from '../../pages/TestData';

test('should partially update and verify data has changed', async ({ bookingService, preCreatedBookingId }) => {
        const initialResponse = await bookingService.getBookingById(preCreatedBookingId);
        const initialBody = await initialResponse.json();
        const patchData = TestData.getPatchPayload();
        const response = await bookingService.patchBooking(preCreatedBookingId, patchData);
        expect(response).toBeOK();
        const updatedBody = await response.json();
        expect(updatedBody.firstname).toBe(patchData.firstname);
        expect(updatedBody.firstname).not.toBe(initialBody.firstname);
        expect(updatedBody.lastname).toBe(initialBody.lastname);

    });
