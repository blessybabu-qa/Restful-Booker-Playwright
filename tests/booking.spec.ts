// Import 'test' from your fixtures file
import { test } from '../pages/fixtures';

test('Positive: Room booking flow', async ({ pom }) => {
    // 1. Select the room from the home page
    await pom.homePage.clickRandomRoom();
    await pom.bookingPage.verifyBookingSectionIsVisible();
    const bookedDates = await pom.bookingPage.selectCheckInCheckOutDates();
    await pom.bookingPage.clickReserve();
    await pom.bookingPage.fillCustomerDetails()
    await pom.bookingPage.clickReserve();
    await pom.bookingPage.verifyBookingSuccess();
 });

test('Negative: Verify validation alerts when fields are empty', async ({ pom }) => {
        await pom.homePage.clickRandomRoom();
        await pom.bookingPage.verifyBookingSectionIsVisible();
        await pom.bookingPage.selectCheckInCheckOutDates();
        await pom.bookingPage.clickReserve();
        await pom.bookingPage.clickReserve(); 
        await pom.bookingPage.verifyAllErrorsAreVisible();
 });