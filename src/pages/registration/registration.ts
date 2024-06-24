import './registration.scss';
import 'font-awesome/css/font-awesome.min.css';
import {
  createCustomer,
  customerOn,
  getToken,
} from '@/components/servercomp/servercomp';
import Cookies from 'js-cookie';
import { BaseAddress } from '@commercetools/platform-sdk';
import Header from '@/components/header/header';
import { CustomerSignUp } from '@/components/servercomp/servercorp.interface';
import createComponent from '../../components/components';
import { FieldConfig } from './types/interfaces';
import { CLASS_NAME, MODAL_MESSAGE } from './constants/constants';
import showModal from '../../components/modal/modal';
import ValidationUtils from '../../utils/validation/validationUtils';

const days = 10;

export default class RegistrationForm {
  static isFormValid = false;

  registrationForm: HTMLElement;

  header: Header;

  static SHeader: Header;

  constructor(header: Header) {
    this.registrationForm = document.createElement('div');
    this.registrationForm.classList.add('registration__wrapper');
    RegistrationForm.renderRegistrationForm(this.registrationForm);
    this.header = header;
    RegistrationForm.SHeader = this.header;
  }

  static renderRegistrationForm(registrationForm: HTMLElement) {
    const wrapper = createComponent('div', ['registration'], {});
    const title = createComponent('h2', ['page__title'], {});
    title.textContent = 'Registration';
    const formContainer = createComponent('form', ['registration__form'], {});
    const personalInfoContainer = createComponent('div', ['personal-info'], {});
    const addressContainer = createComponent('div', ['addresses'], {});
    const titleInfo = createComponent('p', ['personal-info-title'], {});
    titleInfo.innerText = 'Personal Information';
    personalInfoContainer.prepend(titleInfo);
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
        personalInfoContainer.append(inputField);
      } else if (selectField) {
        personalInfoContainer.append(selectField);
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
      const target = event.target as HTMLInputElement;

      if (target) {
        const isChecked = target.checked;

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

        const syncFields = () => {
          if (isChecked) {
            billingFields.street.value = shippingFields.street.value;
            billingFields.city.value = shippingFields.city.value;
            billingFields.country.selectedIndex =
              shippingFields.country.selectedIndex;
            billingFields.postalCode.value = shippingFields.postalCode.value;
          }
        };

        const inputEventCallback = (
          field: HTMLInputElement | HTMLSelectElement,
        ) => {
          field.addEventListener('input', () => {
            if (isChecked) {
              syncFields();
            }
          });
        };

        const disableBillingFields = (disable: boolean) => {
          Object.values(billingFields).forEach((field) => {
            const billingField = field as HTMLInputElement;
            billingField.disabled = disable;
          });
        };

        Object.values(shippingFields).forEach((field) => {
          inputEventCallback(field as HTMLInputElement | HTMLSelectElement);
        });

        syncFields();

        disableBillingFields(isChecked);
      }
    });

    const signUpButton = createComponent('button', ['btn', 'btn-submit'], {
      type: 'submit',
    }) as HTMLButtonElement;
    signUpButton.textContent = 'Sign up';

    signUpButton.addEventListener('click', (event) => {
      event.preventDefault();
      ValidationUtils.checkAllFieldsValidity();
      RegistrationForm.checkFormValidity();

      if (RegistrationForm.isFormValid) {
        window.history.pushState({}, '', '/');
        window.dispatchEvent(new PopStateEvent('popstate'));
      } else {
        showModal(MODAL_MESSAGE.ERROR);
      }
    });

    const loginLink = createComponent('a', ['link-login'], {
      href: '/login',
    });
    loginLink.textContent = 'Already have an account? Login here';

    if (loginLink) {
      loginLink.addEventListener('click', (event) => {
        event.preventDefault();
        window.history.pushState({}, '', '/login');
        window.dispatchEvent(new PopStateEvent('popstate'));
      });
    }

    formContainer.append(personalInfoContainer, addressContainer, signUpButton);
    wrapper.append(title, formContainer, loginLink);
    registrationForm.append(wrapper);
  }

  static async processCustomerRegistration() {
    const firstName = document.getElementById(
      'first-name-info',
    ) as HTMLInputElement;
    const lastName = document.getElementById(
      'last-name-info',
    ) as HTMLInputElement;
    const email = document.getElementById('email-info') as HTMLInputElement;
    const password = document.getElementById(
      'password-info',
    ) as HTMLInputElement;
    const dateOfBirth = document.getElementById(
      'birth-date-info',
    ) as HTMLInputElement;
    const shippingAddressData = RegistrationForm.getShippingAddressData();
    const billingAddressData = RegistrationForm.getBillingAddressData();

    const addressRequest: BaseAddress[] = [];

    const body: CustomerSignUp = {
      email: email.value,
      password: password.value,
      firstName: firstName.value,
      lastName: lastName.value,
      dateOfBirth: dateOfBirth.value,
      addresses: addressRequest,
      shippingAddresses: [0],
      billingAddresses: [0],
      defaultShippingAddress: 0,
      defaultBillingAddress: 0,
    };

    addressRequest.push(shippingAddressData);
    addressRequest.push(billingAddressData);

    if (RegistrationForm.isFormValid) {
      const response = createCustomer(body);
      response
        .then((signInResult) => {
          const customerId = signInResult.customer.id;
          Cookies.set('log', btoa(customerId), { expires: days });
          getToken(body.email, body.password).then((tokenData) => {
            Cookies.set('token', btoa(tokenData.access_token), {
              expires: days,
            });
            customerOn(this.SHeader);
            showModal(MODAL_MESSAGE.REGISTERED);
            const event = new CustomEvent('restartCatalog');
            RegistrationForm.SHeader.triggerCartUpdate();
            document.dispatchEvent(event);
          });
          return customerId;
        })
        .catch((error) => {
          showModal(error.body.message);
        });
    }
  }

  static createFieldConfigs(): FieldConfig[] {
    const fieldConfigs: FieldConfig[] = [
      {
        label: 'First name',
        fieldType: 'input',
        inputType: 'text',
        placeholder: 'Enter your first name',
        id: 'first-name-info',
        validationFunction: ValidationUtils.validateName,
      },
      {
        label: 'Last name',
        fieldType: 'input',
        inputType: 'text',
        placeholder: 'Enter your last name',
        id: 'last-name-info',
        validationFunction: ValidationUtils.validateName,
      },
      {
        label: 'Date of Birth',
        fieldType: 'input',
        inputType: 'date',
        placeholder: '',
        id: 'birth-date-info',
        validationFunction: ValidationUtils.validateDateOfBirth,
      },
      {
        label: 'E-mail',
        fieldType: 'input',
        inputType: 'text',
        placeholder: 'Enter your e-mail address',
        id: 'email-info',
        validationFunction: ValidationUtils.validateEmail,
      },
      {
        label: 'Password',
        fieldType: 'input',
        inputType: 'password',
        placeholder: 'Enter your password',
        id: 'password-info',
        validationFunction: ValidationUtils.validatePassword,
      },
      {
        label: 'Street',
        fieldType: 'input',
        inputType: 'text',
        placeholder: 'Enter your street',
        id: 'street-shipping-address',
        validationFunction: ValidationUtils.validateRequiredField,
      },
      {
        label: 'City',
        fieldType: 'input',
        inputType: 'text',
        placeholder: 'Enter your city',
        id: 'city-shipping-address',
        validationFunction: ValidationUtils.validateName,
      },
      {
        label: 'Country',
        fieldType: 'select',
        id: 'country-shipping-address',
        validationFunction: ValidationUtils.validateCountry,
        options: [{ value: 'US', label: 'US' }],
      },
      {
        label: 'Postal Code',
        fieldType: 'input',
        inputType: 'text',
        placeholder: 'Enter your postal code',
        id: 'postal-code-shipping-address',
        validationFunction: ValidationUtils.validateShippingPostalCode,
      },
      {
        label: 'Street',
        fieldType: 'input',
        inputType: 'text',
        placeholder: 'Enter your street',
        id: 'street-billing-address',
        validationFunction: ValidationUtils.validateRequiredField,
      },
      {
        label: 'City',
        fieldType: 'input',
        inputType: 'text',
        placeholder: 'Enter your city',
        id: 'city-billing-address',
        validationFunction: ValidationUtils.validateName,
      },
      {
        label: 'Country',
        fieldType: 'select',
        id: 'country-billing-address',
        validationFunction: ValidationUtils.validateCountry,
        options: [{ value: 'US', label: 'US' }],
      },
      {
        label: 'Postal Code',
        fieldType: 'input',
        inputType: 'text',
        placeholder: 'Enter your postal code',
        id: 'postal-code-billing-address',
        validationFunction: ValidationUtils.validateBillingPostalCode,
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
      RegistrationForm.processCustomerRegistration();
    }
  }

  static clearErrorsAndInputs() {
    const formElement = document.querySelector('.registration__form');

    formElement
      ?.querySelectorAll(`.${CLASS_NAME.ERROR_MESSAGE}`)
      .forEach((error) => {
        error.remove();
      });

    formElement?.querySelectorAll('input, select').forEach((field) => {
      const inputField = field as HTMLInputElement | HTMLSelectElement;

      if (inputField.type !== 'submit') {
        if (inputField.type === 'checkbox') {
          (inputField as HTMLInputElement).checked = false;
        } else {
          inputField.value = '';
        }
      }

      if ('disabled' in inputField && inputField.disabled) {
        inputField.disabled = false;
      }

      inputField.classList.remove('error', 'correct');
    });
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

  static getShippingAddressData() {
    const shippingFields = {
      streetName: (
        document.getElementById('street-shipping-address') as HTMLInputElement
      ).value,
      city: (
        document.getElementById('city-shipping-address') as HTMLInputElement
      ).value,
      country: (
        document.getElementById('country-shipping-address') as HTMLSelectElement
      ).value,
      postalCode: (
        document.getElementById(
          'postal-code-shipping-address',
        ) as HTMLInputElement
      ).value,
    };

    return shippingFields;
  }

  static getBillingAddressData() {
    const billingFields = {
      streetName: (
        document.getElementById('street-billing-address') as HTMLInputElement
      ).value,
      city: (
        document.getElementById('city-billing-address') as HTMLInputElement
      ).value,
      country: (
        document.getElementById('country-billing-address') as HTMLSelectElement
      ).value,
      postalCode: (
        document.getElementById(
          'postal-code-billing-address',
        ) as HTMLInputElement
      ).value,
    };

    return billingFields;
  }

  getWrap(): HTMLElement {
    return this.registrationForm;
  }
}

window.addEventListener('popstate', () => {
  RegistrationForm.clearErrorsAndInputs();
});
