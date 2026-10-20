import { bookingSchema } from './booking.schema';

export const createBookingSchema = {
    type: 'object',
    required: ['bookingid', 'booking'],
    properties: {
        bookingid: { type: 'integer' },
        booking: bookingSchema,
    },
};
