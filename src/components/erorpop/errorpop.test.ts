import createErrorPopup from './erorpop';

describe('popup', () => {
  let popup: HTMLElement;

  beforeEach(() => {
    popup = createErrorPopup('Test Error');
  });

  afterEach(() => {
    document.body.removeChild(popup);
  });

  test('popup is crater in body', () => {
    expect(document.body.contains(popup)).toBeTruthy();
  });

  test('text correct', () => {
    const textElement = popup.querySelector('.text_error');
    expect(textElement).toBeTruthy();
    expect(textElement?.tagName.toLowerCase()).toBe('p');
    setTimeout(() => {
      expect(textElement?.textContent).toBe('Test Error');
    }, 0);
  });

  test('click the button hides the error popup', () => {
    const button = popup.querySelector('.btn_continue');
    button?.dispatchEvent(new MouseEvent('click'));
    expect(popup.classList.contains('visible')).toBeFalsy();
  });
});
