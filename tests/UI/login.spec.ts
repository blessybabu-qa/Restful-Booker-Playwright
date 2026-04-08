import { test } from '../../pages/fixtures';
import { TestData } from '../../pages/TestData';

test.describe('Admin Login - Data Driven Suite', () => {

    const loginScenarios = TestData.getAdminLoginScenarios();
    for (const data of loginScenarios) {
        
        test(`Scenario: ${data.scenario}`, async ({ pom }) => {
            await pom.homePage.clickAdminLink();
            await pom.adminLoginPage.verifyAdminLoginPageIsLoaded();
            await pom.adminLoginPage.loginAsAdmin(data.username, data.password);
            if (data.isValid) {
                await pom.adminLoginPage.loginSuccessValidation();
            } else {
               await pom.adminLoginPage.verifyErrorMessage();
            }
        });
    }
});