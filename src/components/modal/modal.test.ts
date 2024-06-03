import createModal from './modal';

describe('popup', () => {
  let popup: HTMLElement;

  beforeEach(() => {
    popup = createModal('Test Modal');
  });

  afterEach(() => {
    document.body.removeChild(popup);
  });

  test('popup is created in body', () => {
    expect(document.body.contains(popup)).toBeTruthy();
  });

  test('text correct', () => {
    const textElement = popup.querySelector('.text_modal');
    expect(textElement).toBeTruthy();
    expect(textElement?.tagName.toLowerCase()).toBe('p');
    setTimeout(() => {
      expect(textElement?.textContent).toBe('Test Modal');
    }, 0);
  });

  test('click the button hides the error popup', () => {
    const button = popup.querySelector('.btn_continue');
    button?.dispatchEvent(new MouseEvent('click'));
    expect(popup.classList.contains('visible')).toBeFalsy();
  });
});
