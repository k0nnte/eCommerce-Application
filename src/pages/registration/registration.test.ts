import RegistrationForm from './registration';

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

describe('RegistrationForm Tests', () => {
  let formContainer: HTMLDivElement;
  let signUpButton: HTMLButtonElement;
  let mockProcessCustomerRegistration: jest.Mock;

  beforeEach(() => {
    formContainer = document.createElement('div');
    formContainer.classList.add('registration__form');
    document.body.appendChild(formContainer);
    RegistrationForm.renderRegistrationForm(formContainer);
    signUpButton = formContainer.querySelector(
      '.btn-submit',
    ) as HTMLButtonElement;

    mockProcessCustomerRegistration = jest.fn();
    RegistrationForm.processCustomerRegistration =
      mockProcessCustomerRegistration;
  });

  afterEach(() => {
    document.body.removeChild(formContainer);
    mockProcessCustomerRegistration.mockRestore();
  });

  it('should validate email format', () => {
    const emailInput = formContainer.querySelector(
      'input[type="email"]',
    ) as HTMLInputElement | null;

    if (emailInput) {
      emailInput.value = 'invalidemail';

      signUpButton.click();

      expect(emailInput.classList.contains('error')).toBeTruthy();
    }
  });

  it('should clear errors and inputs on form reset', () => {
    const textInput = formContainer.querySelector(
      'input[type="text"]',
    ) as HTMLInputElement | null;

    if (textInput) {
      textInput.value = 'John';
      textInput.classList.add('error');

      const mockClearErrorsAndInputs = jest.spyOn(
        RegistrationForm,
        'clearErrorsAndInputs',
      );

      RegistrationForm.clearErrorsAndInputs();

      setTimeout(() => {
        expect(textInput.classList.contains('error')).toBeFalsy();
        expect(textInput.value).toBe('');
        expect(mockClearErrorsAndInputs).toHaveBeenCalled();
      }, 0);
    }
  });
});
