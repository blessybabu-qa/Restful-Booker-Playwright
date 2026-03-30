import { test, expect } from '../../pages/fixtures';
import { TestData } from '../../pages/TestData';

test('should fully update booking using dynamic token and fixture ID', async ({ 
        bookingService, 
        preCreatedBookingId, 
        authToken 
    }) => {
       const initialResponse = await bookingService.getBookingById(preCreatedBookingId);
       const initialBody = await initialResponse.json();
       const updatedPayload = TestData.getApiBookingPayload();
       const response = await bookingService.updateBooking(preCreatedBookingId, updatedPayload, authToken);
       expect(response).toBeOK();
       const updatedBody = await response.json();
       expect(updatedBody).toMatchObject(updatedPayload);
       expect(updatedBody).not.toStrictEqual(initialBody);
    });
