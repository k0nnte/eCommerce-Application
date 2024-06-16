import { loginCustomer } from './servercomp';

describe('loginCustomer function', () => {
  it('should return error object on unsuccessful login', async () => {
    const email = 'invalid@example.com';
    const password = 'wrongpassword';

    const response = await loginCustomer(email, password);
    expect(response.istrue).toBe(false);
    expect(response.error).toBeDefined();
  });
});
