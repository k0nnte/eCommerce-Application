import {
  loginCustomer,
  getAllCategories,
  sortPriceSmall,
  getTokenAnon,
} from './servercomp';

describe('loginCustomer function', () => {
  it('should return success response on valid login', async () => {
    const email = 'aa@aa.aa';
    const password = 'aA111111';

    const response = await loginCustomer(email, password);

    expect(response.istrue).toBe(true);
    expect(response.response).toBeDefined();
  });

  it('should return error response on invalid login', async () => {
    const email = 'invalid@example.com';
    const password = 'invalidpassword';

    const response = await loginCustomer(email, password);

    expect(response.istrue).toBe(false);
    expect(response.error).toBeDefined();
  });
});

describe('getAllCategories function', () => {
  it('should return an array of category keys', async () => {
    const categories = await getAllCategories();

    expect(Array.isArray(categories)).toBe(true);
    expect(categories.length).toBeGreaterThan(0);
    expect(typeof categories[0]).toBe('string');
  });
});

describe('sortPriceSmall function', () => {
  it('should return sorted product projections based on price', async () => {
    const price = 100;
    const index = 0;

    const products = await sortPriceSmall(price, index);

    expect(products).toBeDefined();
  });
});

describe('getTokenAnon function', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('should fetch anonymous token correctly', async () => {
    const mockTokenResponse = { access_token: 'token' };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: () => Promise.resolve(mockTokenResponse),
    });

    const tokenData = await getTokenAnon();
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(tokenData).toEqual(mockTokenResponse);
  });
});
