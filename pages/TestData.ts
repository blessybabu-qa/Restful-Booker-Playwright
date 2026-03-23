import { faker } from '@faker-js/faker';

export class TestData {
    static getBookingDetails() {
        return {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: faker.internet.email(),
            phone: faker.string.numeric(11) 
        };
    }
}