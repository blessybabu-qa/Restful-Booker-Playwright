import { Given, When, Then } from '../../pages/fixtures';

Given('I am on the admin login page', async ({ pom }) => {
    await pom.homePage.clickAdminLink();
    await pom.adminLoginPage.verifyAdminLoginPageIsLoaded();
});

When('I log in with the admin details', async ({ pom }) => {
    // Without arguments the admin details are read from ADMIN_EMAIL and ADMIN_PASSWORD in .env
    await pom.adminLoginPage.loginAsAdmin();
});

When('I log in with username {string} and password {string}', async ({ pom }, username: string, password: string) => {
    await pom.adminLoginPage.loginAsAdmin(username, password);
});

Then('I see the admin panel', async ({ pom }) => {
    await pom.adminLoginPage.loginSuccessValidation();
});

Then('I see an invalid credentials message', async ({ pom }) => {
    await pom.adminLoginPage.verifyErrorMessage();
});
