import Main from './main';

describe('Main component', () => {
  let mainComponent: Main;

  beforeEach(() => {
    mainComponent = new Main();
  });

  test('Main component should render correctly', () => {
    const mainElement = mainComponent.getMain();

    expect(mainElement.tagName).toBe('MAIN');

    const navElement = mainElement.querySelector('.main-items');
    expect(navElement).not.toBeNull();

    const homeLink = mainElement.querySelector('.main-home');
    expect(homeLink?.textContent).toBe('Home 🏠');

    const loginLink = mainElement.querySelector('.main-login');
    expect(loginLink?.textContent).toBe('Login');

    const regLink = mainElement.querySelector('.main-reg');
    expect(regLink?.textContent).toBe('Register');
  });
});
