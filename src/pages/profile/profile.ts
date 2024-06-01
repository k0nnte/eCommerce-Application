// /* eslint-disable no-console */
// /* eslint-disable no-unused-vars */
import Cookies from 'js-cookie';
import './profile.scss';
import createComponent from '@/components/components';
import { fetchCustomerData } from '@/components/servercomp/servercomp';
import createErrorPopup from '@/components/erorpop/erorpop';
import { FieldConfig } from '../registration/types/interfaces';

export default class Profile {
  private profile: HTMLElement;

  constructor() {
    this.profile = document.createElement('div');
    this.profile.classList.add('profile__wrapper');
    Profile.renderProfileForm(this.profile);
  }

  static renderProfileForm(profile: HTMLElement) {
    const wrapper = createComponent('div', ['profile'], {});
    const title = createComponent('h2', ['page__title'], {});
    title.textContent = 'User Profile';

    const formContainer = createComponent('form', ['page__form'], {});
    const generalInfoContainer = createComponent(
      'div',
      ['general-info', 'profile-page'],
      {},
    );
    const titleInfo = createComponent('p', ['general-info-title'], {});
    titleInfo.innerText = 'General Information';
    generalInfoContainer.prepend(titleInfo);

    const addressContainer = createComponent('div', ['addresses'], {});
    const titleShipping = createComponent('p', ['shipping-title'], {});
    titleShipping.innerText = 'Shipping Address';
    const titleBilling = createComponent('p', ['billing-title'], {});
    titleBilling.innerText = 'Billing Address';
    const shippingAddressContainer = createComponent(
      'div',
      ['shipping-address-container', 'profile-page'],
      {},
    );
    const billingAddressContainer = createComponent(
      'div',
      ['billing-address-container', 'profile-page'],
      {},
    );
    shippingAddressContainer.append(titleShipping);
    billingAddressContainer.append(titleBilling);
    addressContainer.append(shippingAddressContainer, billingAddressContainer);

    const fieldConfigs: FieldConfig[] = Profile.createFieldConfigs();

    fieldConfigs.forEach((fieldConfig: FieldConfig) => {
      let inputField: HTMLInputElement | HTMLSelectElement | undefined;

      if (fieldConfig.fieldType === 'input') {
        inputField = Profile.createInputField(fieldConfig) as HTMLInputElement;
      } else if (fieldConfig.fieldType === 'select') {
        inputField = Profile.createSelectField(
          fieldConfig,
        ) as HTMLSelectElement;
      }

      if (inputField) {
        if (fieldConfig.id.includes('shipping')) {
          shippingAddressContainer.append(inputField);
        } else if (fieldConfig.id.includes('billing')) {
          billingAddressContainer.append(inputField);
        } else {
          generalInfoContainer.append(inputField);
        }
      }
    });

    const submitButton = createComponent('button', ['btn', 'btn-submit'], {
      type: 'submit',
    });
    submitButton.textContent = 'Back To Home';

    submitButton.addEventListener('click', (event) => {
      event.preventDefault();

      window.history.pushState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    const mainLink = createComponent('a', ['link-main'], { href: '/' });
    mainLink.textContent = 'Back To Home';

    if (mainLink) {
      mainLink.addEventListener('click', (event) => {
        event.preventDefault();
        window.history.pushState({}, '', '/');
        window.dispatchEvent(new PopStateEvent('popstate'));
      });
    }

    const logoutLink = document.querySelector('.logout-link');
    logoutLink?.addEventListener('click', () => {
      Profile.resetOnLogout();
    });

    formContainer.append(generalInfoContainer, addressContainer, submitButton);
    wrapper.append(title, formContainer, mainLink);
    profile.append(wrapper);

    Profile.populateProfileForm();
  }

  static populateProfileForm() {
    const customerLog = Cookies.get('log');

    if (customerLog) {
      const customerId = atob(customerLog);
      fetchCustomerData(customerId)
        .then((fetchedCustomerData) => {
          if (fetchedCustomerData) {
            const { firstName, lastName, dateOfBirth, addresses } =
              fetchedCustomerData;

            addresses.forEach((address, index) => {
              const addressType = index === 0 ? 'shipping' : 'billing';
              const streetFieldId = `street-${addressType}-address`;
              const cityFieldId = `city-${addressType}-address`;
              const postalCodeFieldId = `postal-code-${addressType}-address`;

              const streetField = document.getElementById(streetFieldId);
              streetField?.setAttribute('value', address.streetName || '');

              const cityField = document.getElementById(cityFieldId);
              cityField?.setAttribute('value', address.city || '');

              const postalCodeField =
                document.getElementById(postalCodeFieldId);
              postalCodeField?.setAttribute('value', address.postalCode || '');
            });

            if (firstName && lastName && dateOfBirth) {
              const firstNameField = document.getElementById('first-name-info');
              firstNameField?.setAttribute('value', firstName);

              const lastNameField = document.getElementById('last-name-info');
              lastNameField?.setAttribute('value', lastName);

              const dateOfBirthField =
                document.getElementById('birth-date-info');
              dateOfBirthField?.setAttribute('value', dateOfBirth);
            }

            const inputFields = document.querySelectorAll('input');
            inputFields.forEach((inputField) => {
              const currentInputField = inputField as HTMLInputElement;
              currentInputField.disabled = true;
            });

            const selectFields = document.querySelectorAll('select');
            selectFields.forEach((selectField) => {
              const currentSelectField = selectField as HTMLSelectElement;
              currentSelectField.disabled = true;
            });
          }
        })
        .catch((error) => {
          createErrorPopup(error.body.message);
        });
    }
  }

  static createFieldConfigs(): FieldConfig[] {
    const fieldConfigs: FieldConfig[] = [
      {
        label: 'First name',
        fieldType: 'input',
        inputType: 'text',
        placeholder: '',
        id: 'first-name-info',
        validationFunction: Profile.dummyValidationFunction,
      },
      {
        label: 'Last name',
        fieldType: 'input',
        inputType: 'text',
        placeholder: '',
        id: 'last-name-info',
        validationFunction: Profile.dummyValidationFunction,
      },
      {
        label: 'Date of Birth',
        fieldType: 'input',
        inputType: 'date',
        placeholder: '',
        id: 'birth-date-info',
        validationFunction: Profile.dummyValidationFunction,
      },
      {
        label: 'Street',
        fieldType: 'input',
        inputType: 'text',
        placeholder: '',
        id: 'street-shipping-address',
        validationFunction: Profile.dummyValidationFunction,
      },
      {
        label: 'City',
        fieldType: 'input',
        inputType: 'text',
        placeholder: '',
        id: 'city-shipping-address',
        validationFunction: Profile.dummyValidationFunction,
      },
      {
        label: 'Country',
        fieldType: 'select',
        id: 'country-shipping-address',
        validationFunction: Profile.dummyValidationFunction,
        options: [{ value: 'US', label: 'US' }],
      },
      {
        label: 'Postal Code',
        fieldType: 'input',
        inputType: 'text',
        placeholder: '',
        id: 'postal-code-shipping-address',
        validationFunction: Profile.dummyValidationFunction,
      },
      {
        label: 'Street',
        fieldType: 'input',
        inputType: 'text',
        placeholder: '',
        id: 'street-billing-address',
        validationFunction: Profile.dummyValidationFunction,
      },
      {
        label: 'City',
        fieldType: 'input',
        inputType: 'text',
        placeholder: '',
        id: 'city-billing-address',
        validationFunction: Profile.dummyValidationFunction,
      },
      {
        label: 'Country',
        fieldType: 'select',
        id: 'country-billing-address',
        validationFunction: Profile.dummyValidationFunction,
        options: [{ value: 'US', label: 'US' }],
      },
      {
        label: 'Postal Code',
        fieldType: 'input',
        inputType: 'text',
        placeholder: '',
        id: 'postal-code-billing-address',
        validationFunction: Profile.dummyValidationFunction,
      },
    ];

    return fieldConfigs;
  }

  // eslint-disable-next-line no-unused-vars
  static dummyValidationFunction(_field: HTMLInputElement | HTMLSelectElement) {
    // This function intentionally does nothing for development purposes
  }

  static createLabel(text: string, forId: string): HTMLElement {
    const label = createComponent('label', ['input-label', 'profile-page'], {
      for: forId || '',
    });
    return label;
  }

  static createInputField(fieldConfig: FieldConfig): HTMLElement {
    const inputContainer = createComponent('div', ['form-input'], {});

    const label = Profile.createLabel(fieldConfig.label, fieldConfig.id || '');
    label.innerText = fieldConfig.label;

    const input = createComponent('input', ['form-control'], {
      type: fieldConfig.inputType || 'text',
      placeholder: fieldConfig.placeholder || '',
      id: fieldConfig.id || '',
    }) as HTMLInputElement;

    inputContainer.append(label);
    inputContainer.append(input);

    return inputContainer;
  }

  static createSelectField(fieldConfig: FieldConfig): HTMLElement {
    const containerSelect = createComponent('div', ['form-select'], {});

    const label = Profile.createLabel(fieldConfig.label, fieldConfig.id || '');
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
    defaultOption.text = 'US';
    select.append(defaultOption);

    containerSelect.append(label);
    containerSelect.append(select);

    return containerSelect;
  }

  static resetOnLogout() {
    const formElement = document.querySelector('.page__form');
    formElement?.querySelectorAll('input, select').forEach((field) => {
      const inputField = field as HTMLInputElement | HTMLSelectElement;
      inputField.value = '';
    });
  }

  getWrap(): HTMLElement {
    return this.profile;
  }
}
