// Import 'test' from your fixtures file
import { test } from '../pages/fixtures';
import { TestData } from '../pages/TestData';

test('Positive: Room booking flow', async ({ pom }) => {
    // 1. Select the room from the home page
    await pom.homePage.clickRandomRoom();
    await pom.bookingPage.verifyBookingSectionIsVisible();
    await pom.bookingPage.selectCheckInCheckOutDates();
    await pom.bookingPage.clickReserve();
    const userData = TestData.getBookingDetails();
    await pom.bookingPage.fillCustomerDetails(userData);
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