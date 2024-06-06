import {
  loginCustomer,
  fetchShippingAddressId,
  fetchBillingAddressId,
} from './servercomp';

describe('loginCustomer function', () => {
  it('should return error object on unsuccessful login', async () => {
    const email = 'invalid@example.com';
    const password = 'wrongpassword';

    const response = await loginCustomer(email, password);
    expect(response.istrue).toBe(false);
    expect(response.error).toBeDefined();
  });
});

describe('fetchShippingAddressId function', () => {
  it('should return shipping address information for a valid customer ID', async () => {
    const customerId = '88b16a1f-1a77-4d2b-838f-bfa317d77334';
    const addressInfo = await fetchShippingAddressId(customerId);
    expect(addressInfo).toBeDefined();
  });
});

describe('fetchBillingAddressId function', () => {
  it('should return Billing address information for a valid customer ID', async () => {
    const customerId = '88b16a1f-1a77-4d2b-838f-bfa317d77334';
    const addressInfo = await fetchBillingAddressId(customerId);
    expect(addressInfo).toBeDefined();
  });
});
