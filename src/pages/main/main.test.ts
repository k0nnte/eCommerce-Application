import Main from './main';

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

    expect(homeLink?.textContent).toBe('Home');
    expect(loginLink?.textContent).toBe('Login');
    expect(regLink?.textContent).toBe('Register');
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

  it('Main component should render the main image with correct attributes', () => {
    const image = mainElement.querySelector('.main-image') as HTMLImageElement;

    expect(image).toBeTruthy();
    expect(image.getAttribute('src')).toBe('mock-vector-image-path');
    expect(image.getAttribute('alt')).toBe(
      'Minimalistically designed living room in light colors',
    );
  });
});
