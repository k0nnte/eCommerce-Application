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
