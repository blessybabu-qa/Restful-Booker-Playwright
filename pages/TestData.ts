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
        const checkinDate = faker.date.soon({ days: 10 });
        const checkoutDate = faker.date.soon({ days: 5, refDate: checkinDate });
        return {
            firstname: safeFirstName, 
            lastname: safeLastName,  
            totalprice: faker.number.int({ min: 100, max: 500 }),
            depositpaid: true,
            bookingdates: {
                checkin: checkinDate.toISOString().split('T')[0],
                checkout: checkoutDate.toISOString().split('T')[0]
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

    static getAdminLoginScenarios() {
        return [
            {
                scenario: "Positive: Valid Admin Login",
                username: process.env.ADMIN_EMAIL!, 
                password: process.env.ADMIN_PASSWORD!,
                isValid: true
            },
            {
                scenario: "Negative: Invalid Random Credentials",
                username: faker.internet.email(),
                password: faker.internet.password(),
                isValid: false,
            },  
                
            {
                scenario: "Negative: SQL Injection Attempt",
                username: "' OR 1=1 --", 
                password: "any_password",
                isValid: false,
               },

            {
                scenario: "Negative: Empty Username",
                username: "",
                password: process.env.ADMIN_PASSWORD!,
                isValid: false,
            }
        ];
    }

}