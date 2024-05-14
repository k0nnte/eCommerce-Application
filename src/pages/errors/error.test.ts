import ErrorPage from '@/pages/errors/error';

describe('ErrorPage', () => {
  let errorPage: ErrorPage;
  beforeEach(() => {
    errorPage = new ErrorPage();
    const el = document.querySelector('.center');
    el?.append(errorPage.getWrap());
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });
  test('triggers pushState', () => {
    const pushStateSpy = jest.spyOn(window.history, 'pushState');
    const button = errorPage.wrapper.querySelector(
      '.btn_main',
    ) as HTMLButtonElement;
    button.click();
    expect(pushStateSpy).toHaveBeenCalledWith({}, '', '/');
  });

  test('triggers popstate', () => {
    const dispatchEventSpy = jest.spyOn(window, 'dispatchEvent');
    const button = errorPage.wrapper.querySelector(
      '.btn_main',
    ) as HTMLButtonElement;
    button.click();
    expect(dispatchEventSpy).toHaveBeenCalledWith(expect.any(PopStateEvent));
  });

  test('getWrap return', () => {
    const wrapper = errorPage.getWrap();
    expect(wrapper).toBeInstanceOf(HTMLElement);
    expect(wrapper.classList.contains('wrapper_errorlog')).toBe(true);
  });
});
