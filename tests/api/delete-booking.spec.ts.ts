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

test('should return 401 when deleting a booking without proper authentication', async ({ 
    bookingService, 
    preCreatedBookingId, 
}) => {
    
    const deleteResponse = await bookingService.deleteBooking(preCreatedBookingId,"");
    expect(deleteResponse.status()).toBe(403);
    const getResponse = await bookingService.getBookingById(preCreatedBookingId);
    expect(getResponse.status()).toBe(200);
    });