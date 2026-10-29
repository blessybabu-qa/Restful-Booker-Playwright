import { Given, When, Then, expect } from '../../pages/fixtures';
import { TestData } from '../../pages/TestData';

Given('I have valid booking details', async ({ testContext }) => {
    testContext.bookingPayload = TestData.getApiBookingPayload();
});

When('I create the booking', async ({ bookingService, testContext }) => {
    testContext.createResponse = await bookingService.createBooking(testContext.bookingPayload);
});

Then('the booking is created', async ({ testContext }) => {
    expect(testContext.createResponse).toBeOK();
});

Then('the booking is saved with the same details', async ({ bookingService, testContext }) => {
    const createBody = await testContext.createResponse.json();
    const getResponse = await bookingService.getBookingById(createBody.bookingid);
    expect(getResponse).toBeOK();
    const savedBooking = await getResponse.json();
    expect(savedBooking).toEqual(testContext.bookingPayload);
});

Given('a booking already exists', async ({ preCreatedBookingId, testContext }) => {
    testContext.bookingId = preCreatedBookingId;
});

When('I update the booking', async ({ bookingService, authToken, testContext }) => {
    testContext.updateResponse = await bookingService.updateBooking(testContext.bookingId, testContext.bookingPayload, authToken);
});

Then('the booking is updated with the new details', async ({ bookingService, testContext }) => {
    expect(testContext.updateResponse).toBeOK();
    const getResponse = await bookingService.getBookingById(testContext.bookingId);
    expect(getResponse).toBeOK();
    const savedBooking = await getResponse.json();
    expect(savedBooking).toEqual(testContext.bookingPayload);
});

When('I delete the booking', async ({ bookingService, authToken, testContext }) => {
    testContext.deleteResponse = await bookingService.deleteBooking(testContext.bookingId, authToken);
});

Then('the booking can no longer be found', async ({ bookingService, testContext }) => {
    // Restful Booker returns 201 for a successful delete
    expect(testContext.deleteResponse.status()).toBe(201);
    const getResponse = await bookingService.getBookingById(testContext.bookingId);
    expect(getResponse.status()).toBe(404);
});
