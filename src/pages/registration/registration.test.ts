import RegistrationForm from './registration';

function fail(message: string) {
  throw new Error(message);
}

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
  beforeEach(() => {
    document.body.innerHTML = '<input id="test-input">';
  });

  it('displays error message correctly', () => {
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

  it('does not create duplicate error messages', () => {
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
  let testInput: HTMLInputElement;

  beforeEach(() => {
    document.body.innerHTML = '<input id="test-input">';
    testInput = document.getElementById('test-input') as HTMLInputElement;
    RegistrationForm.showError(testInput, 'This field is required');
  });

  it('hides error message when called', () => {
    RegistrationForm.hideError(testInput);

    expect(testInput.nextElementSibling).toBeNull();
  });

  it('does not hide non-error elements', () => {
    const nonErrorElement = document.createElement('div');
    const originalNextSibling = nonErrorElement.nextElementSibling;

    document.body.appendChild(nonErrorElement);

    RegistrationForm.hideError(nonErrorElement as HTMLInputElement);

    expect(nonErrorElement.nextElementSibling).toEqual(originalNextSibling);
  });
});

describe('Signup Button Click Validation', () => {
  let signUpButton: HTMLButtonElement | null;

  beforeEach(() => {
    const formContainer = document.createElement('div');
    formContainer.classList.add('registration__form');
    document.body.appendChild(formContainer);
    RegistrationForm.renderRegistrationForm(formContainer);
    signUpButton = formContainer.querySelector('.btn-submit');
    if (!signUpButton) {
      throw new Error('Signup button not found1');
    }
  });

  it('should validate form fields and initiate registration process on signup button click', () => {
    const formContainer = document.querySelector('.registration__form');

    if (!formContainer) {
      throw new Error('Form container not found');
    }

    const textInput = formContainer.querySelector(
      'input[type="text"]',
    ) as HTMLInputElement | null;
    const emailInput = formContainer.querySelector(
      'input[type="email"]',
    ) as HTMLInputElement | null;
    const passwordInput = formContainer.querySelector(
      'input[type="password"]',
    ) as HTMLInputElement | null;

    if (textInput && emailInput && passwordInput) {
      textInput.value = 'John';
      emailInput.value = 'john@example.com';
      passwordInput.value = 'password123';

      const mockProcessCustomerRegistration = jest.fn();
      RegistrationForm.processCustomerRegistration =
        mockProcessCustomerRegistration;

      if (signUpButton) {
        signUpButton.click();
        expect(mockProcessCustomerRegistration).toHaveBeenCalled();
      } else {
        throw new Error('Signup button not found2');
      }
    }
  });
});
