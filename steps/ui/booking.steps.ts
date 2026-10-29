import { Given, When, Then } from '../../pages/fixtures';
import { TestData } from '../../pages/TestData';

Given('I am on the home page', async ({ pom }) => {
    await pom.homePage.verifyHomePageIsLoaded();
});

When('I choose a room', async ({ pom }) => {
    await pom.homePage.clickRandomRoom();
    await pom.bookingPage.verifyBookingSectionIsVisible();
});

When('I select my check-in and check-out dates', async ({ pom }) => {
    await pom.bookingPage.selectCheckInCheckOutDates();
});

When('I reserve the room with my details', async ({ pom }) => {
    const guestDetails = TestData.getBookingDetails();
    // The first click opens the guest details form, the second one sends the booking
    await pom.bookingPage.clickReserve();
    await pom.bookingPage.fillCustomerDetails(guestDetails);
    await pom.bookingPage.clickReserve();
});

Then('I see that my booking is confirmed', async ({ pom }) => {
    await pom.bookingPage.verifyBookingSuccess();
});
