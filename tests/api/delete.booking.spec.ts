import { test, expect } from '../../pages/fixtures';

test('should delete a booking and verify it no longer exists', async ({ 
    bookingService, 
    preCreatedBookingId, 
    authToken 
}) => {
    
    const deleteResponse = await bookingService.deleteBooking(preCreatedBookingId, authToken);
    expect(deleteResponse.status()).toBe(201);
    const getResponse = await bookingService.getBookingById(preCreatedBookingId);
    expect(getResponse.status()).toBe(404);
    });