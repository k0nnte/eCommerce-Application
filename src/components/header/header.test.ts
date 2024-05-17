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
  });

  test('Header should have navigation links', () => {
    const navLinks = header.getHeader().querySelectorAll('.nav-links');
    expect(navLinks.length).toBe(2);
    expect(navLinks[0].textContent).toBe('Login');
    expect(navLinks[1].textContent).toBe('Register');
  });

  test('should render the navigation links', () => {
    mainWrap.appendChild(header.getHeader());
    const navItems = mainWrap.querySelector('.nav-items');
    expect(navItems).not.toBeNull();

    const links = navItems?.querySelectorAll('a');
    expect(links).toHaveLength(2);
  });

  afterAll(() => {
    mainWrap.remove();
  });
});
