import { test, expect } from '../../pages/fixtures';

test('should not return a token when the login credentials are wrong', async ({ bookingService }) => {
    const response = await bookingService.login('wrong-user', 'wrong-password');

    // restful-booker answers a failed login with 200, so the body is the only way to tell it failed
    expect(response.status()).toBe(200);

    const responseBody = await response.json();
    expect(responseBody.reason).toBe('Bad credentials');
    expect(responseBody.token).toBeUndefined();
});
