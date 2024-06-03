import ValidationUtils from './validationUtils';

describe('ValidationUtils', () => {
  let nameInput: HTMLInputElement;
  let emailInput: HTMLInputElement;
  let passwordInput: HTMLInputElement;
  let streetShippingInput: HTMLInputElement;
  let birthDateInput: HTMLInputElement;

  beforeEach(() => {
    nameInput = document.createElement('input');
    emailInput = document.createElement('input');
    passwordInput = document.createElement('input');
    streetShippingInput = document.createElement('input');
    birthDateInput = document.createElement('input');

    nameInput.id = 'first-name-info';
    emailInput.id = 'email-info';
    passwordInput.id = 'password-info';
    streetShippingInput.id = 'street-shipping-address';
    birthDateInput.id = 'birth-date-info';

    document.body.append(
      nameInput,
      emailInput,
      passwordInput,
      streetShippingInput,
      birthDateInput,
    );
  });

  test('validateName should set error class for invalid name', () => {
    nameInput.value = '123';
    ValidationUtils.validateName(nameInput);

    expect(nameInput.classList.contains('error')).toBe(true);
  });

  test('validateEmail should set error class for invalid email format', () => {
    emailInput.value = 'invalidemail';
    ValidationUtils.validateEmail(emailInput);

    expect(emailInput.classList.contains('error')).toBe(true);
  });

  test('validatePassword should set error class for invalid password', () => {
    passwordInput.value = 'password';
    ValidationUtils.validatePassword(passwordInput);

    expect(passwordInput.classList.contains('error')).toBe(true);
  });

  test('validateRequiredField should set error class for empty field', () => {
    streetShippingInput.value = '';
    ValidationUtils.validateRequiredField(streetShippingInput);

    expect(streetShippingInput.classList.contains('error')).toBe(true);
  });

  test('validateDateOfBirth should set error class for invalid date of birth', () => {
    birthDateInput.value = '10/10/2030';
    ValidationUtils.validateDateOfBirth(birthDateInput);

    expect(birthDateInput.classList.contains('error')).toBe(true);
  });

  test('showError should display error message after the input field', () => {
    const errorMessage = 'This field is required';
    ValidationUtils.showError(nameInput, errorMessage);

    const errorSpan = nameInput.nextElementSibling as HTMLElement;
    expect(errorSpan.innerText).toBe(errorMessage);
  });

  test('hideError should remove the error message element', () => {
    const testInput = document.createElement('input');
    const errorMessage = 'This field is required';
    ValidationUtils.showError(testInput, errorMessage);
    ValidationUtils.hideError(testInput);
    const errorSpan = testInput.nextElementSibling;
    expect(errorSpan).toBeNull();
  });
});
