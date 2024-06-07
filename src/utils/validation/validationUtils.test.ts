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

  it('validatePassword should set error class for invalid password', () => {
    passwordInput.value = 'password';
    ValidationUtils.validatePassword(passwordInput);

    expect(passwordInput.classList.contains('error')).toBe(true);
  });

  it('validateRequiredField should set error class for empty field', () => {
    streetShippingInput.value = '';
    ValidationUtils.validateRequiredField(streetShippingInput);

    expect(streetShippingInput.classList.contains('error')).toBe(true);
  });

  it('validateDateOfBirth should set error class for invalid date of birth', () => {
    birthDateInput.value = '10/10/2030';
    ValidationUtils.validateDateOfBirth(birthDateInput);

    expect(birthDateInput.classList.contains('error')).toBe(true);
  });

  it('showError should display error message after the input field', () => {
    const errorMessage = 'This field is required';
    ValidationUtils.showError(nameInput, errorMessage);

    const errorSpan = nameInput.nextElementSibling as HTMLElement;
    expect(errorSpan.innerText).toBe(errorMessage);
  });

  it('hideError should remove the error message element', () => {
    const testInput = document.createElement('input');
    const errorMessage = 'This field is required';
    ValidationUtils.showError(testInput, errorMessage);
    ValidationUtils.hideError(testInput);
    const errorSpan = testInput.nextElementSibling;
    expect(errorSpan).toBeNull();
  });

  it('validateDateOfBirth should mark field as correct for a valid date of birth', () => {
    birthDateInput.value = '1990-01-01';
    ValidationUtils.validateDateOfBirth(birthDateInput);

    expect(birthDateInput.classList.contains('correct')).toBe(true);
  });

  it('validatePassword should mark field as correct for a valid password', () => {
    passwordInput.value = 'StrongPassword123';
    ValidationUtils.validatePassword(passwordInput);

    expect(passwordInput.classList.contains('correct')).toBe(true);
  });
});

describe('validateName', () => {
  let nameInput: HTMLInputElement;

  beforeEach(() => {
    nameInput = document.createElement('input');
    nameInput.id = 'first-name-info';
    document.body.appendChild(nameInput);
  });

  it('should return true for valid names without special characters', () => {
    nameInput.value = 'John';
    ValidationUtils.validateName(nameInput);

    expect(nameInput.classList.contains('correct')).toBe(true);
  });

  it('should return false for names with special characters', () => {
    nameInput.value = 'John@Doe';
    ValidationUtils.validateName(nameInput);

    expect(nameInput.classList.contains('error')).toBe(true);
  });
});

describe('validateEmail', () => {
  let emailInput: HTMLInputElement;

  beforeEach(() => {
    emailInput = document.createElement('input');
    emailInput.id = 'email-info';
    document.body.appendChild(emailInput);
  });

  it('should return true for a valid email', () => {
    emailInput.value = 'john.doe@example.com';
    ValidationUtils.validateEmail(emailInput);

    expect(emailInput.classList.contains('correct')).toBe(true);
  });

  it('should return false for an invalid email format', () => {
    emailInput.value = 'invalid_email_address';
    ValidationUtils.validateEmail(emailInput);

    expect(emailInput.classList.contains('error')).toBe(true);
  });

  it('should return true when email input is empty', () => {
    emailInput.value = '';
    ValidationUtils.validateEmail(emailInput);

    expect(emailInput.classList.contains('correct')).toBe(false);
  });
});

describe('checkAllFieldsValidity', () => {
  it('should mark form as invalid if any field is empty', () => {
    const inputOne = document.createElement('input');
    const inputTwo = document.createElement('input');

    inputOne.value = 'John';
    inputTwo.value = '';

    document.body.append(inputOne);
    document.body.append(inputTwo);

    ValidationUtils.checkAllFieldsValidity();

    expect(ValidationUtils.isFormValid).toBe(false);
  });
});
