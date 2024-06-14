import Cookies from 'js-cookie';
import Main from './main';
import Profile from '../profile/profile';

jest.mock('../../../public/files/Vector.png', () => 'mock-vector-image-path');

describe('Main component', () => {
  let mainComponent: Main;
  let mainElement: HTMLElement;

  beforeEach(() => {
    mainComponent = new Main();
    mainElement = mainComponent.getMain();
  });

  it('Main component should render correctly', () => {
    expect(mainElement.tagName).toBe('DIV');

    const navElement = mainElement.querySelector('.main-items');
    expect(navElement).not.toBeNull();

    const homeLink = mainElement.querySelector('.home-link');
    expect(homeLink?.textContent).toBe('Home');

    const loginLink = mainElement.querySelector('.login-link');
    expect(loginLink?.textContent).toBe('Login');

    const regLink = mainElement.querySelector('.reg-link');
    expect(regLink?.textContent).toBe('Register');

    const profileLink = mainElement.querySelector('.profile-link');
    expect(profileLink?.textContent).toBe('Profile');

    const catalogLink = mainElement.querySelector('.catalog-link');
    expect(catalogLink?.textContent).toBe('Catalog');

    const cartLink = mainElement.querySelector('.cart-link');
    expect(cartLink?.textContent).toBe('Cart');

    const aboutLink = mainElement.querySelector('.about-link');
    expect(aboutLink?.textContent).toBe('About Us');
  });

  it('Main component should be defined', () => {
    expect(mainComponent).toBeDefined();
  });

  it('Main component should render a main element', () => {
    expect(mainElement.tagName).toBe('DIV');
  });

  it('Main component should render navigation elements', () => {
    const navElement = mainElement.querySelector('.main-items');
    expect(navElement).not.toBeNull();

    const homeLink = mainElement.querySelector('.home-link');
    const loginLink = mainElement.querySelector('.login-link');
    const regLink = mainElement.querySelector('.reg-link');
    const profileLink = mainElement.querySelector('.profile-link');
    const catalogLink = mainElement.querySelector('.catalog-link');
    const cartLink = mainElement.querySelector('.cart-link');
    const aboutLink = mainElement.querySelector('.about-link');

    expect(homeLink?.textContent).toBe('Home');
    expect(loginLink?.textContent).toBe('Login');
    expect(regLink?.textContent).toBe('Register');
    expect(profileLink?.textContent).toBe('Profile');
    expect(catalogLink?.textContent).toBe('Catalog');
    expect(cartLink?.textContent).toBe('Cart');
    expect(aboutLink?.textContent).toBe('About Us');
  });

  it('Clicking on Home link should update the window location to /', () => {
    const homeLink = mainElement.querySelector('.home-link') as HTMLElement;
    homeLink.click();

    expect(window.location.pathname).toBe('/');
  });

  it('Clicking on Login link without cookies should update window location to /login', () => {
    const loginLink = mainElement.querySelector('.login-link') as HTMLElement;
    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    });
    loginLink.dispatchEvent(event);

    expect(window.location.pathname).toBe('/login');
  });

  it('Clicking on Register link without cookies should update window location to /register', () => {
    const regLink = mainElement.querySelector('.reg-link') as HTMLElement;
    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    });
    regLink.dispatchEvent(event);

    expect(window.location.pathname).toBe('/register');
  });

  it('Clicking on Profile link without cookies should update window location to /login', () => {
    const profileLink = mainElement.querySelector(
      '.profile-link',
    ) as HTMLElement;
    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    });
    profileLink.dispatchEvent(event);

    expect(window.location.pathname).toBe('/login');
  });

  it('Clicking on Profile link with cookies should update the window location to /profile', () => {
    Profile.populateProfileForm = jest.fn();
    Cookies.get = jest
      .fn()
      .mockImplementation((key): 'some-auth-token' | undefined => {
        if (key === 'log') {
          return 'some-auth-token';
        }
        return undefined;
      });
    const profileLink = mainElement.querySelector(
      '.profile-link',
    ) as HTMLElement;
    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    });
    profileLink.dispatchEvent(event);

    expect(Profile.populateProfileForm).toHaveBeenCalled();

    expect(window.location.pathname).toBe('/profile');
  });

  it('Clicking on Catalog link should update the window location to /catalog', () => {
    const catalogLink = mainElement.querySelector(
      '.catalog-link',
    ) as HTMLElement;
    catalogLink.click();

    expect(window.location.pathname).toBe('/catalog');
  });

  it('Clicking on Cart link should update the window location to /cart', () => {
    const cartLink = mainElement.querySelector('.cart-link') as HTMLElement;
    cartLink.click();

    expect(window.location.pathname).toBe('/cart');
  });

  it('Clicking on About Us link should update the window location to /about', () => {
    const aboutLink = mainElement.querySelector('.about-link') as HTMLElement;
    aboutLink.click();

    expect(window.location.pathname).toBe('/about');
  });

  it('Main component should render the main image with correct attributes', () => {
    const image = mainElement.querySelector('.main-image') as HTMLImageElement;

    expect(image).toBeTruthy();
    expect(image.getAttribute('src')).toBe('mock-vector-image-path');
    expect(image.getAttribute('alt')).toBe(
      'Minimalistically designed living room in light colors',
    );
  });
});
