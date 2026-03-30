import { test } from '../../pages/fixtures';

test('Positive: Admin login flow', async ({ pom }) => {
    await pom.homePage.clickAdminLink();
    await pom.adminLoginPage.verifyAdminLoginPageIsLoaded();
    await pom.adminLoginPage.loginAsAdmin();
    await pom.adminLoginPage.loginSuccessValidation();
 });