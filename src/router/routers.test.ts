import Router from './router';

describe('router', () => {
  let router: Router;
  let routers: { [key: string]: HTMLElement };
  let wrapper: HTMLElement;

  beforeEach(() => {
    routers = {
      '/': document.createElement('div'),
      '/login': document.createElement('button'),
      '/err': document.createElement('span'),
    };
    wrapper = document.createElement('div');
    router = new Router(routers, wrapper);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('main', () => {
    Object.defineProperty(window, 'location', {
      value: { pathname: '/' },
      writable: true,
    });

    router.rout();
    expect(wrapper.firstChild).toBe(routers['/']);
  });

  it('error', () => {
    Object.defineProperty(window, 'location', {
      value: { pathname: '/unknown' },
      writable: true,
    });
    router.rout();
    expect(wrapper.firstChild).toBe(routers['/err']);
  });

  it('login', () => {
    Object.defineProperty(window, 'location', {
      value: { pathname: '/login' },
      writable: true,
    });

    router.rout();

    expect(wrapper.firstChild).toBe(routers['/login']);
  });
});
