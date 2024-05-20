/* eslint-disable no-console */
import './registration.scss';
import 'font-awesome/css/font-awesome.min.css';
import createComponent from '../../components/components';
import FieldConfig from './types/interfaces';
import { CLASS_NAME, ERROR, MODAL_MESSAGE } from './constants/constants';
import createErrorPopup from '../../components/erorpop/erorpop';

export default class RegistrationForm {
  static isFormValid = false;

  registrationForm: HTMLElement;

  constructor() {
    this.registrationForm = document.createElement('div');
    this.registrationForm.classList.add('registration__wrapper');
    RegistrationForm.renderForm(this.registrationForm);
  }

  static renderForm(registrationForm: HTMLElement) {
    const wrapper = createComponent('div', ['registration'], {});
    const title = createComponent('h2', ['registration__title'], {});
    title.textContent = 'Registration';
    const formContainer = createComponent('form', ['registration__form'], {});
    const generalInfoContainer = createComponent('div', ['general-info'], {});
    const addressContainer = createComponent('div', ['addresses'], {});
    const titleInfo = createComponent('p', ['general-info-title'], {});
    titleInfo.innerText = 'General Information';
    generalInfoContainer.prepend(titleInfo);
    const titleShipping = createComponent('p', ['shipping-title'], {});
    titleShipping.innerText = 'Shipping Address';
    const titleBilling = createComponent('p', ['billing-title'], {});
    titleBilling.innerText = 'Billing Address';

    const setShippingDefaultAddress = createComponent(
      'label',
      ['checkbox-label'],
      {
        for: 'isShippingAddressDefaultInput',
      },
    );
    const checkboxInputShipping = createComponent(
      'input',
      ['input-default-shipping'],
      {
        id: 'isShippingAddressDefaultInput',
        type: 'checkbox',
        name: 'isShippingAddressDefault',
      },
    );
    const labelTextShipping = document.createTextNode(
      'Set Shipping Address as default',
    );
    setShippingDefaultAddress.append(checkboxInputShipping, labelTextShipping);

    const setBillingDefaultAddress = createComponent(
      'label',
      ['checkbox-label'],
      {
        for: 'isBillingAddressDefaultInput',
      },
    );
    const checkboxInputBilling = createComponent(
      'input',
      ['input-default-billing'],
      {
        id: 'isBillingAddressDefaultInput',
        type: 'checkbox',
        name: 'isShippingAddressDefault',
      },
    );
    const labelTextBilling = document.createTextNode(
      'Set Billing Address as default',
    );
    setBillingDefaultAddress.append(checkboxInputBilling, labelTextBilling);

    const billToShippingAddress = createComponent('label', ['checkbox-label'], {
      for: 'billTo',
    });
    const checkboxBillToShippingAddress = createComponent(
      'input',
      ['input-billing'],
      {
        id: 'billTo',
        type: 'checkbox',
        name: 'billTo',
      },
    ) as HTMLInputElement;
    const labelTextBillTo = document.createTextNode(
      'Billing address matches the Shipping address',
    );
    billToShippingAddress.append(
      checkboxBillToShippingAddress,
      labelTextBillTo,
    );

    let shippingAddressContainer: HTMLElement | null = null;
    let billingAddressContainer: HTMLElement | null = null;

    const fieldConfigs: FieldConfig[] = RegistrationForm.createFieldConfigs();

    fieldConfigs.forEach((fieldConfig: FieldConfig) => {
      let inputField: HTMLInputElement | HTMLSelectElement | undefined;
      let selectField: HTMLSelectElement | undefined;

      if (fieldConfig.fieldType === 'input') {
        inputField = RegistrationForm.createInputField(
          fieldConfig,
        ) as HTMLInputElement;
      } else if (fieldConfig.fieldType === 'select') {
        selectField = RegistrationForm.createSelectField(
          fieldConfig,
        ) as HTMLSelectElement;
      }

      if (fieldConfig.id.includes('shipping')) {
        if (!shippingAddressContainer) {
          shippingAddressContainer = document.createElement('div');
          shippingAddressContainer.classList.add('shipping-address-container');
          shippingAddressContainer.prepend(titleShipping);
          shippingAddressContainer.append(
            setShippingDefaultAddress,
            billToShippingAddress,
          );
        }
        if (inputField) {
          shippingAddressContainer.append(inputField);
        } else if (selectField) {
          shippingAddressContainer.append(selectField);
        }
      } else if (fieldConfig.id.includes('billing')) {
        if (!billingAddressContainer) {
          billingAddressContainer = document.createElement('div');
          billingAddressContainer.classList.add('billing-address-container');
          billingAddressContainer.prepend(titleBilling);
          billingAddressContainer.append(
            billToShippingAddress,
            setBillingDefaultAddress,
          );
        }
        if (inputField) {
          billingAddressContainer.append(inputField);
        } else if (selectField) {
          billingAddressContainer.append(selectField);
        }
      } else if (inputField) {
        generalInfoContainer.append(inputField);
      } else if (selectField) {
        generalInfoContainer.append(selectField);
      }

      if (fieldConfig.inputType === 'password') {
        const passwordIcon = document.createElement('i');
        passwordIcon.classList.add('password-icon', 'fa', 'fa-eye-slash');
        inputField?.append(passwordIcon);

        let isPasswordVisible = false;

        const togglePasswordVisibility = () => {
          isPasswordVisible = !isPasswordVisible;
          const newInputType = isPasswordVisible ? 'text' : 'password';

          const inputElement = inputField?.querySelector('input');
          if (inputElement) {
            inputElement.type = newInputType;
          }

          passwordIcon.classList.toggle('fa-eye', isPasswordVisible);
          passwordIcon.classList.toggle('fa-eye-slash', !isPasswordVisible);
        };

        passwordIcon.addEventListener('click', togglePasswordVisibility);
      }
    });

    if (shippingAddressContainer) {
      addressContainer.append(shippingAddressContainer);
    }

    if (billingAddressContainer) {
      addressContainer.append(billingAddressContainer);
    }

    checkboxBillToShippingAddress.addEventListener('change', (event) => {
      event.preventDefault();

      const shippingFields = {
        street: document.getElementById(
          'street-shipping-address',
        ) as HTMLInputElement,
        city: document.getElementById(
          'city-shipping-address',
        ) as HTMLInputElement,
        country: document.getElementById(
          'country-shipping-address',
        ) as HTMLSelectElement,
        postalCode: document.getElementById(
          'postal-code-shipping-address',
        ) as HTMLInputElement,
      };

      const billingFields = {
        street: document.getElementById(
          'street-billing-address',
        ) as HTMLInputElement,
        city: document.getElementById(
          'city-billing-address',
        ) as HTMLInputElement,
        country: document.getElementById(
          'country-billing-address',
        ) as HTMLSelectElement,
        postalCode: document.getElementById(
          'postal-code-billing-address',
        ) as HTMLInputElement,
      };

      const allFieldsPresent = Object.values(shippingFields)
        .concat(Object.values(billingFields))
        .every((field) => field);

      if (checkboxBillToShippingAddress.checked && allFieldsPresent) {
        billingFields.street.value = shippingFields.street.value;
        billingFields.city.value = shippingFields.city.value;
        billingFields.country.selectedIndex =
          shippingFields.country.selectedIndex;
        billingFields.postalCode.value = shippingFields.postalCode.value;

        Object.values(billingFields).forEach((field) => {
          const currentField = field;
          currentField.disabled = true;
        });
      } else {
        Object.values(billingFields).forEach((field) => {
          const currentField = field;
          currentField.disabled = false;
        });
      }
    });

    const signUpButton = createComponent('button', ['btn', 'btn-submit'], {
      type: 'submit',
    }) as HTMLButtonElement;
    signUpButton.textContent = 'Sign up';

    signUpButton.addEventListener('click', (event) => {
      event.preventDefault();
      RegistrationForm.checkAllFieldsValidity();
      RegistrationForm.checkFormValidity();

      if (RegistrationForm.isFormValid) {
        window.history.pushState({}, '', '/');
        window.dispatchEvent(new PopStateEvent('popstate'));
        createErrorPopup(MODAL_MESSAGE.CORRECT);
      } else {
        createErrorPopup(MODAL_MESSAGE.ERROR);
      }
    });

    formContainer.append(generalInfoContainer, addressContainer, signUpButton);
    wrapper.append(title, formContainer);
    registrationForm.append(wrapper);
  }

  static createFieldConfigs(): FieldConfig[] {
    const fieldConfigs: FieldConfig[] = [
      {
        label: 'First name',
        fieldType: 'input',
        inputType: 'text',
        placeholder: 'Enter your first name',
        id: 'first-name-info',
        validationFunction: RegistrationForm.validateName,
      },
      {
        label: 'Last name',
        fieldType: 'input',
        inputType: 'text',
        placeholder: 'Enter your last name',
        id: 'last-name-info',
        validationFunction: RegistrationForm.validateName,
      },
      {
        label: 'Date of Birth',
        fieldType: 'input',
        inputType: 'date',
        placeholder: '',
        id: 'birth-date-info',
        validationFunction: RegistrationForm.validateDateOfBirth,
      },
      {
        label: 'E-mail',
        fieldType: 'input',
        inputType: 'text',
        placeholder: 'Enter your e-mail address',
        id: 'email-info',
        validationFunction: RegistrationForm.validateEmail,
      },
      {
        label: 'Password',
        fieldType: 'input',
        inputType: 'password',
        placeholder: 'Enter your password',
        id: 'password-info',
        validationFunction: RegistrationForm.validatePassword,
      },
      {
        label: 'Street',
        fieldType: 'input',
        inputType: 'text',
        placeholder: 'Enter your street',
        id: 'street-shipping-address',
        validationFunction: RegistrationForm.validateRequiredField,
      },
      {
        label: 'City',
        fieldType: 'input',
        inputType: 'text',
        placeholder: 'Enter your city',
        id: 'city-shipping-address',
        validationFunction: RegistrationForm.validateName,
      },
      {
        label: 'Country',
        fieldType: 'select',
        id: 'country-shipping-address',
        validationFunction: RegistrationForm.validateCountry,
        options: [{ value: 'United States', label: 'United States' }],
      },
      {
        label: 'Postal Code',
        fieldType: 'input',
        inputType: 'text',
        placeholder: 'Enter your postal code',
        id: 'postal-code-shipping-address',
        validationFunction: RegistrationForm.validateShippingPostalCode,
      },
      {
        label: 'Street',
        fieldType: 'input',
        inputType: 'text',
        placeholder: 'Enter your street',
        id: 'street-billing-address',
        validationFunction: RegistrationForm.validateRequiredField,
      },
      {
        label: 'City',
        fieldType: 'input',
        inputType: 'text',
        placeholder: 'Enter your city',
        id: 'city-billing-address',
        validationFunction: RegistrationForm.validateName,
      },
      {
        label: 'Country',
        fieldType: 'select',
        id: 'country-billing-address',
        validationFunction: RegistrationForm.validateCountry,
        options: [{ value: 'United States', label: 'United States' }],
      },
      {
        label: 'Postal Code',
        fieldType: 'input',
        inputType: 'text',
        placeholder: 'Enter your postal code',
        id: 'postal-code-billing-address',
        validationFunction: RegistrationForm.validateBillingPostalCode,
      },
    ];

    return fieldConfigs;
  }

  static checkFormValidity() {
    const formContainer = document.querySelector('.registration__form');
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
            RegistrationForm.isFormValid = false;
          }
        }
      });
    }
    if (this.isFormValid) {
      // todo //
      console.log('ok');
    }
  }

  static checkAllFieldsValidity() {
    const inputFields = document.querySelectorAll('input, select');

    inputFields.forEach((element) => {
      const field = element as HTMLInputElement | HTMLSelectElement;

      if (
        (field instanceof HTMLInputElement ||
          field instanceof HTMLSelectElement) &&
        field.value.trim() === ''
      ) {
        const errorMessage = ERROR.ERROR;
        RegistrationForm.showError(field, errorMessage);
      }

      field.addEventListener('input', () => {
        const inputField = field as HTMLInputElement | HTMLSelectElement;

        if (inputField.value.trim() === '') {
          const errorMessage = ERROR.ERROR;
          RegistrationForm.showError(inputField, errorMessage);
        } else {
          RegistrationForm.hideError(field);
          if (
            inputField.id === 'last-name-info' ||
            inputField.id === 'first-name-info' ||
            inputField.id === 'city-shipping-address' ||
            inputField.id === 'city-billing-address'
          ) {
            RegistrationForm.validateName(inputField as HTMLInputElement);
          }
          if (inputField.id === 'birth-date-info') {
            RegistrationForm.validateDateOfBirth(
              inputField as HTMLInputElement,
            );
          }
          if (inputField.id === 'email-info') {
            RegistrationForm.validateEmail(inputField as HTMLInputElement);
          }
          if (inputField.id === 'password-info') {
            RegistrationForm.validatePassword(inputField as HTMLInputElement);
          }
          if (
            inputField.id === 'street-shipping-address' ||
            inputField.id === 'street-billing-address'
          ) {
            RegistrationForm.validateRequiredField(
              inputField as HTMLInputElement,
            );
          }
          if (
            inputField.id === 'country-shipping-address' ||
            inputField.id === 'country-billing-address'
          ) {
            RegistrationForm.validateCountry(inputField as HTMLSelectElement);
          }
          if (inputField.id === 'postal-code-shipping-address') {
            RegistrationForm.validateShippingPostalCode(
              inputField as HTMLInputElement,
            );
          }
          if (inputField.id === 'postal-code-billing-address') {
            RegistrationForm.validateBillingPostalCode(
              inputField as HTMLInputElement,
            );
          }
        }
      });
    });
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

  static validateName(nameInput: HTMLInputElement | HTMLSelectElement) {
    const nameValue = nameInput.value.trim();
    const isValidName = /^[a-zA-Z]+$/.test(nameValue);

    nameInput.classList.toggle('error', !isValidName);
    nameInput.classList.toggle('correct', isValidName);

    if (!isValidName) {
      RegistrationForm.showError(nameInput, ERROR.NAME);
    } else {
      RegistrationForm.hideError(nameInput);
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
      RegistrationForm.showError(dateInput, ERROR.DATE_OF_BIRTH);
    } else {
      RegistrationForm.hideError(dateInput);
    }
  }

  static validateEmail(emailInput: HTMLInputElement) {
    const emailValue = emailInput.value.trim();
    const isValidEmail =
      !emailValue || !RegistrationForm.isValidEmailFormat(emailValue);

    emailInput.classList.toggle('error', isValidEmail);
    emailInput.classList.toggle('correct', !isValidEmail);

    if (isValidEmail) {
      RegistrationForm.showError(emailInput, ERROR.EMAIL);
    } else {
      RegistrationForm.hideError(emailInput);
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
      RegistrationForm.showError(passwordInput, ERROR.PASSWORD);
    } else {
      RegistrationForm.hideError(passwordInput);
    }
  }

  static validateCountry(field: HTMLSelectElement | HTMLInputElement) {
    const selectCountry = field as HTMLSelectElement;

    const updateValidationClasses = () => {
      const isValidSelection = selectCountry.value !== '';
      selectCountry.classList.toggle('error', !isValidSelection);
      selectCountry.classList.toggle('correct', isValidSelection);

      if (!isValidSelection) {
        RegistrationForm.showError(selectCountry, ERROR.COUNTRY);
      } else {
        RegistrationForm.hideError(selectCountry);
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
      const isUSACountrySelected = selectedCountry === 'United States';
      const isValidPostalCode = /^\d{5}(-\d{4})?$/.test(
        postalCodeInput.value.trim(),
      );

      if (!isUSACountrySelected) {
        postalCodeInput.classList.add('error');
        postalCodeInput.classList.remove('correct');
        RegistrationForm.showError(postalCodeInput, ERROR.COUNTRY);
      } else {
        postalCodeInput.classList.toggle('error', !isValidPostalCode);
        postalCodeInput.classList.toggle('correct', isValidPostalCode);

        if (!isValidPostalCode) {
          RegistrationForm.showError(postalCodeInput, ERROR.POSTAL_CODE);
        } else {
          RegistrationForm.hideError(postalCodeInput);
        }
      }
    };

    updateValidationClasses();

    countrySelect.addEventListener('change', () => {
      if (postalCodeInput.value.trim() !== '') {
        RegistrationForm.hideError(postalCodeInput);
        updateValidationClasses();
      }
    });

    postalCodeInput.addEventListener('input', () => {
      if (postalCodeInput.value.trim() !== '') {
        RegistrationForm.hideError(postalCodeInput);
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
      const isUSACountrySelected = selectedCountry === 'United States';
      const isValidPostalCode = /^\d{5}(-\d{4})?$/.test(
        postalCodeInput.value.trim(),
      );

      if (!isUSACountrySelected) {
        postalCodeInput.classList.add('error');
        postalCodeInput.classList.remove('correct');
        RegistrationForm.showError(postalCodeInput, ERROR.COUNTRY);
      } else {
        postalCodeInput.classList.toggle('error', !isValidPostalCode);
        postalCodeInput.classList.toggle('correct', isValidPostalCode);

        if (!isValidPostalCode) {
          RegistrationForm.showError(postalCodeInput, ERROR.POSTAL_CODE);
        } else {
          RegistrationForm.hideError(postalCodeInput);
        }
      }
    };

    updateValidationClasses();

    countrySelect.addEventListener('change', () => {
      if (postalCodeInput.value.trim() !== '') {
        RegistrationForm.hideError(postalCodeInput);
        updateValidationClasses();
      }
    });

    postalCodeInput.addEventListener('input', () => {
      if (postalCodeInput.value.trim() !== '') {
        RegistrationForm.hideError(postalCodeInput);
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
      RegistrationForm.showError(input, ERROR.EMPTY);
    } else {
      RegistrationForm.hideError(input);
    }
  }

  static createLabel(text: string, forId: string): HTMLElement {
    const label = createComponent('label', ['input-label'], {
      for: forId || '',
    });
    return label;
  }

  static createInputField(fieldConfig: FieldConfig): HTMLElement {
    const inputContainer = createComponent('div', ['form-input'], {});

    const label = RegistrationForm.createLabel(
      fieldConfig.label,
      fieldConfig.id || '',
    );
    label.innerText = fieldConfig.label;

    const input = createComponent('input', ['form-control'], {
      type: fieldConfig.inputType || 'text',
      placeholder: fieldConfig.placeholder || '',
      id: fieldConfig.id || '',
    }) as HTMLInputElement;

    inputContainer.append(label);
    inputContainer.append(input);

    input.addEventListener('input', () => {
      fieldConfig.validationFunction(input);
    });

    input.addEventListener('blur', () => {
      fieldConfig.validationFunction(input);
    });
    return inputContainer;
  }

  static createSelectField(fieldConfig: FieldConfig): HTMLElement {
    const containerSelect = createComponent('div', ['form-select'], {});

    const label = RegistrationForm.createLabel(
      fieldConfig.label,
      fieldConfig.id || '',
    );
    label.innerText = fieldConfig.label;

    const select = createComponent(
      'select',
      ['form-control', 'select-country'],
      {
        id: fieldConfig.id || '',
      },
    ) as HTMLSelectElement;

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.text = 'Select Country:';
    select.append(defaultOption);

    fieldConfig.options?.forEach((option) => {
      const optionElem = document.createElement('option');
      optionElem.value = option.value;
      optionElem.text = option.label;
      select.append(optionElem);
    });

    select.addEventListener('change', () => {
      fieldConfig.validationFunction(select);
    });

    containerSelect.append(label);
    containerSelect.append(select);

    return containerSelect;
  }

  getWrap(): HTMLElement {
    return this.registrationForm;
  }
}
