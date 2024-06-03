import Main from './main';

jest.mock('../../../public/files/Vector.png', () => 'mock-vector-image-path');

describe('Main component', () => {
  let mainComponent: Main;

  beforeEach(() => {
    mainComponent = new Main();
  });

  test('Main component should render correctly', () => {
    const mainElement = mainComponent.getMain();

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

  test('renderCatalog method should render products correctly', async () => {
    const mainElement = mainComponent.getMain();

    const catalogWrapper = mainElement.querySelector('.wrapper_catalog');
    await mainComponent.renderCatalog();

    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });

    expect(catalogWrapper?.children.length).toBeGreaterThan(0);
  });

  test('Search button should trigger product search', async () => {
    const mainElement = mainComponent.getMain();
    const searchInput = mainElement.querySelector(
      '.select_search',
    ) as HTMLInputElement;
    const searchButton = mainElement.querySelector(
      '.btn_search',
    ) as HTMLButtonElement;

    searchInput.value = 'Test Product';
    searchButton.click();

    await new Promise((resolve) => {
      setTimeout(resolve, 500);
    });

    const catalogWrapper = mainElement.querySelector('.wrapper_catalog');
    expect(catalogWrapper?.children.length).toBeGreaterThan(0);
  });
});
