import { test, expect } from '../../pages/fixtures';

test('should verify the booking service is alive (Ping)', async ({ bookingService }) => {
        const response = await bookingService.checkApiHealth();
        console.log(`Ping Response Status: ${response.status()}`);
        expect(response.status()).toBe(201);
        });

