import Header from './header';
import { isLog, getCart } from '../servercomp/servercomp';

jest.mock('../servercomp/servercomp', () => ({
  isLog: jest.fn(),
  getCart: jest.fn(),
}));

describe('Header component', () => {
  let header: Header;
  let mainWrap: HTMLElement;

  beforeAll(() => {
    header = new Header();
    mainWrap = document.createElement('div');
    mainWrap.classList.add('main_wrap');
    document.body.appendChild(mainWrap);
  });

  it('Header component should be defined', () => {
    expect(header).toBeDefined();
  });

  it('Header should have Home link', () => {
    const homeLink = header.getHeader().querySelector('.home-link');
    expect(homeLink).not.toBeNull();
    expect(homeLink?.textContent).toBe('Home');
    expect(window.location.pathname).toBe('/');
  });

  it('Header should have Login link', () => {
    const loginLink = header.getHeader().querySelector('.login-link');
    expect(loginLink).not.toBeNull();
    expect(loginLink?.textContent).toBe('Login');
  });

  it('Header should have Register link', () => {
    const regLink = header.getHeader().querySelector('.reg-link');
    expect(regLink).not.toBeNull();
    expect(regLink?.textContent).toBe('Register');
  });

  it('Header should have Catalog link', () => {
    const catalogLink = header.getHeader().querySelector('.catalog-link');
    expect(catalogLink).not.toBeNull();
    expect(catalogLink?.textContent).toBe('Catalog');
  });

  it('Header should have Profile link', () => {
    const profileLink = header.getHeader().querySelector('.profile-link');
    expect(profileLink).not.toBeNull();
    expect(profileLink?.textContent).toBe('Profile');
  });

  it('Header should have AboutUs link', () => {
    const aboutLink = header.getHeader().querySelector('.about-link');
    expect(aboutLink).not.toBeNull();
    expect(aboutLink?.textContent).toBe('AboutUs');
  });

  it('Header should have Cart link', () => {
    const cartLink = header.getHeader().querySelector('.cart-link');
    expect(cartLink).not.toBeNull();
  });

  it('Clicking on Home link should update the window location to /', () => {
    const homeLink = header
      .getHeader()
      .querySelector('.home-link') as HTMLElement;

    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
    });

    homeLink.dispatchEvent(clickEvent);
    expect(window.location.pathname).toBe('/');
  });

  it('Clicking on Catalog link should update the window location to /catalog', () => {
    const catalogLink = header
      .getHeader()
      .querySelector('.catalog-link') as HTMLElement;

    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
    });

    catalogLink.dispatchEvent(clickEvent);
    expect(window.location.pathname).toBe('/catalog');
  });

  it('Clicking on Login link should update the window location to /login', () => {
    const loginLink = header
      .getHeader()
      .querySelector('.login-link') as HTMLElement;

    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
    });

    loginLink.dispatchEvent(clickEvent);
    expect(window.location.pathname).toBe('/login');
  });

  it('Clicking on Register link should update the window location to /register', () => {
    const regLink = header
      .getHeader()
      .querySelector('.reg-link') as HTMLElement;

    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
    });

    regLink.dispatchEvent(clickEvent);
    expect(window.location.pathname).toBe('/register');
  });

  it('Clicking on Profile link should update the window location to /profile', () => {
    const profileLink = header
      .getHeader()
      .querySelector('.profile-link') as HTMLElement;

    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
    });

    profileLink.dispatchEvent(clickEvent);
    expect(window.location.pathname).toBe('/profile');
  });

  it('Clicking on About link should update the window location to /about', () => {
    const aboutLink = header
      .getHeader()
      .querySelector('.about-link') as HTMLElement;
    expect(aboutLink).not.toBeNull();

    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
    });

    jest.spyOn(window.history, 'pushState');
    aboutLink.dispatchEvent(clickEvent);
    expect(window.history.pushState).toHaveBeenCalledWith({}, '', '/about');
  });

  it('Clicking on Cart link should update the window location to /cart', () => {
    const cartLink = header
      .getHeader()
      .querySelector('.cart-link') as HTMLElement;
    expect(cartLink).not.toBeNull();

    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
    });

    jest.spyOn(window.history, 'pushState');
    cartLink.dispatchEvent(clickEvent);
    expect(window.history.pushState).toHaveBeenCalledWith({}, '', '/cart');
  });

  describe('updateCartItemCount method', () => {
    it('should update cart item count correctly', async () => {
      (isLog as jest.Mock).mockResolvedValue({
        value: 'test-value',
        anon: false,
        token: 'test-token',
      });
      (getCart as jest.Mock).mockResolvedValue({
        body: {
          lineItems: [{ quantity: 1 }, { quantity: 1 }, { quantity: 1 }],
        },
      });

      const cartItemCount = document.createElement('span');
      cartItemCount.classList.add('cart-item-count');
      document.body.appendChild(cartItemCount);
      header.cartItemCount = cartItemCount;

      await header.updateCartItemCount();

      expect(header.cartItemCount.textContent).toBe('3');
    });
  });

  afterAll(() => {
    mainWrap.remove();
  });
});
