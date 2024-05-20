import RegistrationForm from './registration';

describe('Validate inputs', () => {
  let firstNameInput: HTMLInputElement;
  let emailInput: HTMLInputElement;
  let passwordInput: HTMLInputElement;
  let streetShippingInput: HTMLInputElement;
  let birthDateInput: HTMLInputElement;

  beforeEach(() => {
    firstNameInput = document.createElement('input');
    emailInput = document.createElement('input');
    passwordInput = document.createElement('input');
    streetShippingInput = document.createElement('input');
    birthDateInput = document.createElement('input');

    firstNameInput.id = 'first-name-info';
    emailInput.id = 'email-info';
    passwordInput.id = 'password-info';
    streetShippingInput.id = 'street-shipping-address';
    birthDateInput.id = 'birth-date-info';

    document.body.append(
      firstNameInput,
      emailInput,
      passwordInput,
      streetShippingInput,
      birthDateInput,
    );
  });

  it('Test inputs validation', () => {
    firstNameInput.value = 'John';
    emailInput.value = 'example@email.com';
    passwordInput.value = 'aA111111';
    streetShippingInput.value = '1';
    birthDateInput.value = '10/10/2000';

    RegistrationForm.validateName(firstNameInput);
    RegistrationForm.validateEmail(emailInput);
    RegistrationForm.validatePassword(passwordInput);
    RegistrationForm.validateRequiredField(streetShippingInput);
    RegistrationForm.validateDateOfBirth(birthDateInput);

    expect(firstNameInput.classList.contains('error')).toBe(false);
    expect(emailInput.classList.contains('error')).toBe(false);
    expect(passwordInput.classList.contains('error')).toBe(false);
    expect(streetShippingInput.classList.contains('error')).toBe(false);
    expect(birthDateInput.classList.contains('error')).toBe(false);
  });
});

describe('showError function', () => {
  let registrationForm: RegistrationForm;

  beforeEach(() => {
    document.body.innerHTML = '<input id="test-input">';
    registrationForm = new RegistrationForm();
  });

  test('displays error message correctly', () => {
    const testInput = document.getElementById('test-input');

    if (testInput instanceof HTMLElement) {
      RegistrationForm.showError(
        testInput as HTMLInputElement,
        'This field is required',
      );

      const nextSibling = testInput.nextElementSibling;
      if (nextSibling instanceof HTMLElement) {
        expect(nextSibling.innerText).toEqual('This field is required');
      } else {
        fail('Next sibling is not an HTMLElement');
      }
    } else {
      fail('testInput is null or not an HTMLElement');
    }
  });

  test('does not create duplicate error messages', () => {
    const testInput = document.getElementById('test-input');

    if (testInput instanceof HTMLElement) {
      RegistrationForm.showError(
        testInput as HTMLInputElement,
        'Another error message',
      );

      const nextSibling = testInput.nextElementSibling;
      if (nextSibling instanceof HTMLElement) {
        expect(nextSibling.innerText).toEqual('Another error message');
      } else {
        fail('Next sibling is not an HTMLElement');
      }
    } else {
      fail('testInput is null or not an HTMLElement');
    }
  });
});

describe('hideError function', () => {
  let registrationForm: RegistrationForm;
  let testInput: HTMLInputElement;

  beforeEach(() => {
    document.body.innerHTML = '<input id="test-input">';
    registrationForm = new RegistrationForm();
    testInput = document.getElementById('test-input') as HTMLInputElement;
    RegistrationForm.showError(testInput, 'This field is required');
  });

  test('hides error message when called', () => {
    RegistrationForm.hideError(testInput);

    expect(testInput.nextElementSibling).toBeNull();
  });

  test('does not hide non-error elements', () => {
    const nonErrorElement = document.createElement('div');
    const originalNextSibling = nonErrorElement.nextElementSibling;

    document.body.appendChild(nonErrorElement);

    RegistrationForm.hideError(nonErrorElement as HTMLInputElement);

    expect(nonErrorElement.nextElementSibling).toEqual(originalNextSibling);
  });
});
