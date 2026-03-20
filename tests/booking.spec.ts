// Import 'test' from your fixtures file
import { test } from '../pages/fixtures';

test('Positive: Room booking flow', async ({ pom }) => {
    // 1. Select the room from the home page
    await pom.homePage.clickRandomRoom();
    await pom.bookingPage.verifyBookingSectionIsVisible();
    await pom.bookingPage.selectCheckInCheckOutDates();
    await pom.bookingPage.clickReserve();
});

test('Negative: Verify validation alerts when fields are empty', async ({ pom }) => {
        await pom.homePage.clickRandomRoom();
        await pom.bookingPage.verifyBookingSectionIsVisible();
        await pom.bookingPage.selectCheckInCheckOutDates();
        await pom.bookingPage.clickReserve();
        await pom.bookingPage.clickReserve(); // Click reserve again without filling details to trigger validation
        await pom.bookingPage.verifyAllErrorsAreVisible();
 });