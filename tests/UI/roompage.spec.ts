import { test } from '../../pages/fixtures'; 

test('should verify details of a randomly selected room', async ({ pom }) => {
        
        const selectedRoomType = await pom.homePage.clickRandomRoom();
        const expectedRoom = `${selectedRoomType} Room`;
        await pom.roomPage.verifyRoomTitle(expectedRoom);
        await pom.roomPage.verifyRoomImageIsVisible();
        await pom.roomPage.verifyRoomDetails();
        await pom.roomPage.verifyRoomPolicies();
});
