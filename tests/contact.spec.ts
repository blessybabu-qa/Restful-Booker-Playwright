import { test } from '../pages/fixtures';
import { TestData } from '../pages/TestData';

test('Successful contact submission', async ({pom}) => {
    await pom.homePage.clickContactLink();
    await pom.contactPage.contactFormVisible();
    const userData = TestData.getContactDetails();
    await pom.contactPage.fillContactForm(userData);
    await pom.contactPage.submitContactForm();
    await pom.contactPage.verifySuccessMessage(userData.name);
});

test('Should display validation errors when submitting empty form', async ({ pom }) => {
    await pom.homePage.clickContactLink();
    await pom.contactPage.submitContactForm();
    const expectedErrors = [
            'Phone may not be blank',
            'Message must be between 20 and 2000 characters.',
            'Phone must be between 11 and 21 characters.',
            'Subject must be between 5 and 100 characters.',
            'Message may not be blank',
            'Email may not be blank',
            'Name may not be blank',
            'Subject may not be blank'
        ];

    await pom.contactPage.verifyValidationErrorsAreVisible(expectedErrors);
});