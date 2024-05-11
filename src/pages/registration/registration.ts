import './registration.scss';
import '@fortawesome/fontawesome-free/css/all.min.css';
import createComponent from '../../components/components';

export default class RegistrationForm {
  static isFormValid = false;

  constructor() {
    RegistrationForm.initForm();
    RegistrationForm.setupCountrySelect();
    RegistrationForm.setupSignUpButton();
  }

  static initForm() {
    const formContainer = document.createElement('div');
    formContainer.id = 'form-container';
    document.body.append(formContainer);

    const title = document.createElement('h2');
    title.textContent = 'Registration Form';
    title.classList.add('title');
    formContainer.append(title);

    const form = document.createElement('div');
    form.id = 'registration-form-container';
    formContainer.append(form);

    const fields = [
      {
        type: 'text',
        placeholder: 'First Name*',
        validationFn: RegistrationForm.validateName,
        attributes: {
          autocomplete: 'off',
        },
      },
      {
        type: 'text',
        placeholder: 'Last Name*',
        validationFn: RegistrationForm.validateName,
        attributes: {
          autocomplete: 'off',
        },
      },
      {
        type: 'date',
        placeholder: 'Date of Birth',
        validationFn: RegistrationForm.validateDateOfBirth,
        attributes: {
          autocomplete: 'off',
        },
      },
      {
        type: 'text',
        placeholder: 'Street*',
        validationFn: RegistrationForm.validateRequiredField,
        attributes: {
          autocomplete: 'off',
        },
      },
      {
        type: 'text',
        placeholder: 'City*',
        validationFn: RegistrationForm.validateName,
        attributes: {
          autocomplete: 'off',
        },
      },
      {
        type: 'text',
        placeholder: 'Postal Code*',
        validationFn: RegistrationForm.validatePostalCode,
        attributes: {
          autocomplete: 'off',
        },
      },
      {
        type: 'email',
        placeholder: 'Email*',
        validationFn: RegistrationForm.validateEmail,
        attributes: {
          autocomplete: 'off',
        },
      },
      {
        type: 'password',
        placeholder: 'Password*',
        validationFn: RegistrationForm.validatePassword,
        attributes: {
          autocomplete: 'off',
        },
      },
    ];

    fields.forEach((field) => {
      const input = createComponent('input', ['form-control'], {
        type: field.type,
        placeholder: field.placeholder,
        ...field.attributes,
      }) as HTMLInputElement;

      if (field.type === 'password') {
        const passwordInputDiv = document.createElement('div');
        passwordInputDiv.classList.add('password-input-wrapper');
        input.classList.add('password-input');

        const togglePasswordIcon = document.createElement('i');
        togglePasswordIcon.classList.add('password-icon', 'fa', 'fa-eye');

        togglePasswordIcon.addEventListener('click', () => {
          const isPasswordVisible = input.type === 'text';

          input.type = isPasswordVisible ? 'password' : 'text';
          togglePasswordIcon.classList.toggle(
            'fa-eye-slash',
            !isPasswordVisible,
          );
          togglePasswordIcon.classList.toggle('fa-eye', isPasswordVisible);
        });

        passwordInputDiv.append(input);
        passwordInputDiv.append(togglePasswordIcon);
        form.append(passwordInputDiv);
      } else {
        form.append(input);
      }

      input.addEventListener('input', () => {
        field.validationFn(input);
      });

      input.addEventListener('blur', () => field.validationFn(input));
    });

    const signUpButton = createComponent('button', ['btn', 'btn-submit'], {
      type: 'submit',
    }) as HTMLButtonElement;
    signUpButton.textContent = 'Sign up';

    form.append(signUpButton);
  }

  static setupSignUpButton() {
    const signUpButton = document.querySelector(
      '.btn-submit',
    ) as HTMLButtonElement;

    signUpButton.addEventListener('click', (event) => {
      event.preventDefault();
      RegistrationForm.checkFormValidity();

      if (RegistrationForm.isFormValid) {
        /* eslint-disable no-alert */
        alert('All fields are filled correctly. You can now submit the form!');
      }
    });
  }

  static checkFormValidity() {
    const formContainer = document.getElementById(
      'registration-form-container',
    );
    const allInputs = formContainer?.querySelectorAll('input, select');

    RegistrationForm.isFormValid = true;

    if (allInputs) {
      allInputs.forEach((input) => {
        if (
          input instanceof HTMLInputElement ||
          input instanceof HTMLSelectElement
        ) {
          const isFieldValid =
            input.value.trim() !== '' && !input.classList.contains('error');

          if (!isFieldValid) {
            input.classList.add('error');
            const passwordWrapper = document.querySelector(
              '.password-input-wrapper',
            );
            passwordWrapper?.classList.add('error');
            RegistrationForm.isFormValid = false;
          }
        }
      });
    }
  }

  static validateName(nameInput: HTMLInputElement) {
    const nameValue = nameInput.value.trim();
    const isValidName = /^[a-zA-Z]+$/.test(nameValue);

    nameInput.classList.toggle('error', !isValidName);
    nameInput.classList.toggle('correct', isValidName);
  }

  static validateDateOfBirth(dateInput: HTMLInputElement) {
    const minAge = 13;
    const maxAge = 130;
    const dateOfBirth = new Date(dateInput.value);
    const currentDate = new Date();

    const minAgeDate = new Date(
      currentDate.getFullYear() - minAge,
      currentDate.getMonth(),
      currentDate.getDate(),
    );
    const maxAgeDate = new Date(
      currentDate.getFullYear() - maxAge,
      currentDate.getMonth(),
      currentDate.getDate(),
    );

    const isValidDate =
      !Number.isNaN(dateOfBirth.getTime()) &&
      dateOfBirth <= currentDate &&
      dateOfBirth >= maxAgeDate &&
      dateOfBirth < minAgeDate;

    dateInput.classList.toggle('error', !isValidDate);
    dateInput.classList.toggle('correct', isValidDate);
  }

  static validateRequiredField(input: HTMLInputElement) {
    const value = input.value.trim();
    const isValid = value !== '';

    input.classList.toggle('error', !isValid);
    input.classList.toggle('correct', isValid);
  }

  static validateEmail(emailInput: HTMLInputElement) {
    const emailValue = emailInput.value.trim();
    const isValidEmail =
      !emailValue || !RegistrationForm.isValidEmailFormat(emailValue);

    emailInput.classList.toggle('error', isValidEmail);
    emailInput.classList.toggle('correct', !isValidEmail);
  }

  static isValidEmailFormat(email: string): boolean {
    const emailRegex = /^\S+@\S+\.\S+$/;
    return emailRegex.test(email);
  }

  static validatePassword(passwordInput: HTMLInputElement) {
    const passwordValue = passwordInput.value.trim();
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    const passwordWrapper = document.querySelector('.password-input-wrapper');

    const isValidPassword = passwordRegex.test(passwordValue);

    passwordWrapper?.classList.toggle('error', !isValidPassword);
    passwordWrapper?.classList.toggle('correct', isValidPassword);

    passwordInput.classList.toggle('error', !isValidPassword);
    passwordInput.classList.toggle('correct', isValidPassword);
  }

  static setupCountrySelect() {
    const countrySelect = createComponent('select', ['form-control'], {
      autocomplete: 'off',
    }) as HTMLSelectElement;
    countrySelect.classList.add('select-country');

    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = 'Select country*';

    countrySelect.append(placeholder);

    const countries = ['United States of America'];
    countries.forEach((country) => {
      const option = document.createElement('option');
      option.value = country;
      option.textContent = country;
      countrySelect.append(option);
    });

    const formContainer = document.getElementById(
      'registration-form-container',
    );

    if (formContainer) {
      const postalCodeField = formContainer.querySelector(
        'input[placeholder="Postal Code*"]',
      );
      if (postalCodeField) {
        postalCodeField.parentElement?.insertBefore(
          countrySelect,
          postalCodeField,
        );
      }
    }

    countrySelect.addEventListener('blur', () => {
      RegistrationForm.validateCountry(countrySelect);
    });
  }

  static validateCountry(countrySelect: HTMLSelectElement) {
    const updateValidationClasses = () => {
      const isValidSelection = countrySelect.value !== '';
      countrySelect.classList.toggle('error', !isValidSelection);
      countrySelect.classList.toggle('correct', isValidSelection);
    };

    updateValidationClasses();

    countrySelect.addEventListener('change', updateValidationClasses);
  }

  static validatePostalCode(postalCodeInput: HTMLInputElement) {
    const postalCodeValue = postalCodeInput.value.trim();
    const countrySelect = document.querySelector(
      'select.select-country',
    ) as HTMLSelectElement;
    const selectedCountry = countrySelect.value;
    const isUSACountrySelected = selectedCountry === 'United States of America';
    const isValidPostalCode = /^\d{5}(-\d{4})?$/.test(postalCodeValue);

    postalCodeInput.classList.toggle(
      'error',
      !(isUSACountrySelected && isValidPostalCode),
    );
    postalCodeInput.classList.toggle(
      'correct',
      isUSACountrySelected && isValidPostalCode,
    );
  }
}
