import { test } from '../../pages/fixtures'; 
test.describe('Restful Booker - Homepage Validation', () => {

    test('should verify all main UI elements are visible', async ({ pom }) => {
       await pom.homePage.waitForPageLoad();
       await pom.homePage.verifyHomePageIsLoaded();
    });

});

