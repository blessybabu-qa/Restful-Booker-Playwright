export const bookingSchema = {
    type: 'object',
    required: ['firstname', 'lastname', 'totalprice', 'depositpaid', 'bookingdates'],
    properties: {
        firstname: { type: 'string' },
        lastname: { type: 'string' },
        totalprice: { type: 'number' },
        depositpaid: { type: 'boolean' },
        bookingdates: {
            type: 'object',
            required: ['checkin', 'checkout'],
            properties: {
                checkin: { type: 'string', format: 'date' },
                checkout: { type: 'string', format: 'date' },
            },
        },
        additionalneeds: { type: 'string' },
    },
};
