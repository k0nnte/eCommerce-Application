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

  test('Header component should be defined', () => {
    expect(header).toBeDefined();
  });

  test('Header should have Home link', () => {
    const homeLink = header.getHeader().querySelector('.home-link');
    expect(homeLink).not.toBeNull();
    expect(homeLink?.textContent).toBe('Home');
    expect(window.location.pathname).toBe('/');
  });

  test('Header should have Login link', () => {
    const loginLink = header.getHeader().querySelector('.login-link');
    expect(loginLink).not.toBeNull();
    expect(loginLink?.textContent).toBe('Login');
  });

  test('Header should have Register link', () => {
    const regLink = header.getHeader().querySelector('.reg-link');
    expect(regLink).not.toBeNull();
    expect(regLink?.textContent).toBe('Register');
  });

  afterAll(() => {
    mainWrap.remove();
  });
});
