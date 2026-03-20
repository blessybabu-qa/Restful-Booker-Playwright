import { test } from '@playwright/test';
import { HomePage } from '../pages/HomePage'; 

test.describe('Restful Booker - Homepage Validation', () => {

    test('should verify all main UI elements are visible', async ({ page }) => {
        
        const homePage = new HomePage(page);
        await homePage.navigate();
        await homePage.waitForPageLoad();
        await homePage.verifyHomePageIsLoaded();
    });

});