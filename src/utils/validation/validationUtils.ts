import createComponent from '@/components/components';
import {
  CLASS_NAME,
  ERROR,
} from '../../pages/registration/constants/constants';

export default class ValidationUtils {
  static isFormValid = false;

  static validateName(nameInput: HTMLInputElement | HTMLSelectElement) {
    const nameValue = nameInput.value.trim();
    const isValidName = /^[a-zA-Z]+$/.test(nameValue);

    nameInput.classList.toggle('error', !isValidName);
    nameInput.classList.toggle('correct', isValidName);

    if (!isValidName) {
      ValidationUtils.showError(nameInput, ERROR.NAME);
    } else {
      ValidationUtils.hideError(nameInput);
    }
  }

  static validateEmail(emailInput: HTMLInputElement) {
    const emailValue = emailInput.value.trim();
    const isValidEmail =
      !emailValue || !ValidationUtils.isValidEmailFormat(emailValue);

    emailInput.classList.toggle('error', isValidEmail);
    emailInput.classList.toggle('correct', !isValidEmail);

    if (isValidEmail) {
      ValidationUtils.showError(emailInput, ERROR.EMAIL);
    } else {
      ValidationUtils.hideError(emailInput);
    }
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

    if (!isValidDate) {
      ValidationUtils.showError(dateInput, ERROR.DATE_OF_BIRTH);
    } else {
      ValidationUtils.hideError(dateInput);
    }
  }

  static isValidEmailFormat(email: string): boolean {
    const emailRegex = /^\S+@\S+\.\S{2,}$/;
    return emailRegex.test(email);
  }

  static validatePassword(passwordInput: HTMLInputElement) {
    const passwordValue = passwordInput.value.trim();
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

    const isValidPassword = passwordRegex.test(passwordValue);

    passwordInput.classList.toggle('error', !isValidPassword);
    passwordInput.classList.toggle('correct', isValidPassword);

    if (!isValidPassword) {
      ValidationUtils.showError(passwordInput, ERROR.PASSWORD);
    } else {
      ValidationUtils.hideError(passwordInput);
    }
  }

  static validateCountry(field: HTMLSelectElement | HTMLInputElement) {
    const selectCountry = field as HTMLSelectElement;

    const updateValidationClasses = () => {
      const isValidSelection = selectCountry.value !== '';
      selectCountry.classList.toggle('error', !isValidSelection);
      selectCountry.classList.toggle('correct', isValidSelection);

      if (!isValidSelection) {
        ValidationUtils.showError(selectCountry, ERROR.COUNTRY);
      } else {
        ValidationUtils.hideError(selectCountry);
      }
    };

    updateValidationClasses();

    selectCountry.addEventListener('change', updateValidationClasses);
  }

  static validateShippingPostalCode(postalCodeInput: HTMLInputElement) {
    const countrySelect = document.getElementById(
      'country-shipping-address',
    ) as HTMLSelectElement;

    const updateValidationClasses = () => {
      const selectedCountry = countrySelect.value;
      const isUSACountrySelected = selectedCountry === 'US';
      const isValidPostalCode = /^\d{5}(-\d{4})?$/.test(
        postalCodeInput.value.trim(),
      );

      if (!isUSACountrySelected) {
        postalCodeInput.classList.add('error');
        postalCodeInput.classList.remove('correct');
        ValidationUtils.showError(postalCodeInput, ERROR.COUNTRY);
      } else {
        postalCodeInput.classList.toggle('error', !isValidPostalCode);
        postalCodeInput.classList.toggle('correct', isValidPostalCode);

        if (!isValidPostalCode) {
          ValidationUtils.showError(postalCodeInput, ERROR.POSTAL_CODE);
        } else {
          ValidationUtils.hideError(postalCodeInput);
        }
      }
    };

    updateValidationClasses();

    countrySelect.addEventListener('change', () => {
      if (postalCodeInput.value.trim() !== '') {
        ValidationUtils.hideError(postalCodeInput);
        updateValidationClasses();
      }
    });

    postalCodeInput.addEventListener('input', () => {
      if (postalCodeInput.value.trim() !== '') {
        ValidationUtils.hideError(postalCodeInput);
        updateValidationClasses();
      }
    });
  }

  static validateBillingPostalCode(postalCodeInput: HTMLInputElement) {
    const countrySelect = document.getElementById(
      'country-billing-address',
    ) as HTMLSelectElement;

    const updateValidationClasses = () => {
      const selectedCountry = countrySelect.value;
      const isUSACountrySelected = selectedCountry === 'US';
      const isValidPostalCode = /^\d{5}(-\d{4})?$/.test(
        postalCodeInput.value.trim(),
      );

      if (!isUSACountrySelected) {
        postalCodeInput.classList.add('error');
        postalCodeInput.classList.remove('correct');
        ValidationUtils.showError(postalCodeInput, ERROR.COUNTRY);
      } else {
        postalCodeInput.classList.toggle('error', !isValidPostalCode);
        postalCodeInput.classList.toggle('correct', isValidPostalCode);

        if (!isValidPostalCode) {
          ValidationUtils.showError(postalCodeInput, ERROR.POSTAL_CODE);
        } else {
          ValidationUtils.hideError(postalCodeInput);
        }
      }
    };

    updateValidationClasses();

    countrySelect.addEventListener('change', () => {
      if (postalCodeInput.value.trim() !== '') {
        ValidationUtils.hideError(postalCodeInput);
        updateValidationClasses();
      }
    });

    postalCodeInput.addEventListener('input', () => {
      if (postalCodeInput.value.trim() !== '') {
        ValidationUtils.hideError(postalCodeInput);
        updateValidationClasses();
      }
    });
  }

  static validateRequiredField(input: HTMLInputElement | HTMLSelectElement) {
    const value = input.value.trim();
    const isValid = value !== '';

    input.classList.toggle('error', !isValid);
    input.classList.toggle('correct', isValid);

    if (!isValid) {
      ValidationUtils.showError(input, ERROR.EMPTY);
    } else {
      ValidationUtils.hideError(input);
    }
  }

  static showError(
    nameInput: HTMLInputElement | HTMLSelectElement,
    message: string,
  ) {
    const errorMessage = nameInput.nextElementSibling as HTMLElement;

    if (
      !errorMessage ||
      !errorMessage.classList.contains(CLASS_NAME.ERROR_MESSAGE)
    ) {
      const newErrorMessage = createComponent(
        'span',
        [CLASS_NAME.ERROR_MESSAGE],
        {},
      );
      newErrorMessage.innerText = message;
      nameInput.insertAdjacentElement('afterend', newErrorMessage);
    }
  }

  static hideError(nameInput: HTMLInputElement | HTMLSelectElement) {
    const errorMessage = nameInput.nextElementSibling as HTMLElement;

    if (
      errorMessage &&
      errorMessage.classList.contains(CLASS_NAME.ERROR_MESSAGE)
    ) {
      errorMessage.remove();
    }
  }

  static checkAllFieldsValidity() {
    let allFieldsValid = true;

    const inputFields = document.querySelectorAll('input, select');

    inputFields.forEach((element) => {
      const field = element as HTMLInputElement | HTMLSelectElement;

      if (!field.type || field.type !== 'checkbox') {
        if (field.value.trim() === '' || !field.classList.contains('correct')) {
          allFieldsValid = false;

          const errorMessage = ERROR.ERROR;
          ValidationUtils.showError(field, errorMessage);
        } else {
          ValidationUtils.hideError(field);
        }
      }

      if (field.type === 'checkbox') {
        return;
      }

      field.addEventListener('input', () => {
        const inputField = field as HTMLInputElement | HTMLSelectElement;

        if (inputField.value.trim() === '') {
          const errorMessage = ERROR.ERROR;
          ValidationUtils.showError(inputField, errorMessage);
        } else {
          ValidationUtils.hideError(field);
          if (
            inputField.id === 'last-name-info' ||
            inputField.id === 'first-name-info' ||
            inputField.id === 'city-shipping-address' ||
            inputField.id === 'city-billing-address'
          ) {
            ValidationUtils.validateName(inputField as HTMLInputElement);
          }
          if (inputField.id === 'birth-date-info') {
            ValidationUtils.validateDateOfBirth(inputField as HTMLInputElement);
          }
          if (inputField.id === 'email-info') {
            ValidationUtils.validateEmail(inputField as HTMLInputElement);
          }
          if (inputField.id === 'password-info') {
            ValidationUtils.validatePassword(inputField as HTMLInputElement);
          }
          if (
            inputField.id === 'street-shipping-address' ||
            inputField.id === 'street-billing-address'
          ) {
            ValidationUtils.validateRequiredField(
              inputField as HTMLInputElement,
            );
          }
          if (
            inputField.id === 'country-shipping-address' ||
            inputField.id === 'country-billing-address'
          ) {
            ValidationUtils.validateCountry(inputField as HTMLSelectElement);
          }
          if (inputField.id === 'postal-code-shipping-address') {
            ValidationUtils.validateShippingPostalCode(
              inputField as HTMLInputElement,
            );
          }
          if (inputField.id === 'postal-code-billing-address') {
            ValidationUtils.validateBillingPostalCode(
              inputField as HTMLInputElement,
            );
          }
        }
      });

      if (allFieldsValid) {
        ValidationUtils.isFormValid = true;
      } else {
        ValidationUtils.isFormValid = false;
      }
    });
  }
}
