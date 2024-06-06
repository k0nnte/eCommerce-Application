import Header from './header';

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

  afterAll(() => {
    mainWrap.remove();
  });
});
