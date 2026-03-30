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

    static getApiBookingPayload() {
        const safeFirstName = faker.person.firstName().replace(/[^a-z]/gi, '');
        const safeLastName = faker.person.lastName().replace(/[^a-z]/gi, '');
        return {
            firstname: safeFirstName, 
            lastname: safeLastName,  
            totalprice: faker.number.int({ min: 100, max: 500 }),
            depositpaid: true,
            bookingdates: {
                checkin: "2026-04-20",
                checkout: "2026-04-22"
            },
            additionalneeds: "Breakfast"
        };
   }
   static getPatchPayload() {
        return {
            firstname: faker.person.firstName(),
            totalprice: faker.number.int({ min: 50, max: 99 })
        };
    }

}