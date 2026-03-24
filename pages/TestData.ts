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

    static getContactDetails() {
        return {
            name: faker.person.fullName(),         
            email: faker.internet.email(),
            phone: faker.string.numeric(11),           
            subject: faker.word.words(3),          
            message: faker.lorem.paragraph(2)      
        };
    }
}