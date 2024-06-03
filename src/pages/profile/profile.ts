// /* eslint-disable no-console */
// /* eslint-disable no-unused-vars */
import Cookies from 'js-cookie';
import './profile.scss';
import createComponent from '@/components/components';
import { fetchCustomerData } from '@/components/servercomp/servercomp';
import showModal from '@/components/modal/modal';
import { apiRoot } from '@/sdk/builder';
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
    const formContainer = createComponent('form', ['profile__form'], {});
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

    const editButton = createComponent('button', ['btn', 'btn-edit'], {
      type: 'submit',
    });
    editButton.textContent = 'Edit';
    const saveButton = createComponent(
      'button',
      ['btn', 'btn-save', 'btn-hidden'],
      {
        type: 'submit',
      },
    );
    saveButton.textContent = 'Save';
    generalInfoContainer.append(editButton, saveButton);

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

    formContainer.append(generalInfoContainer, addressContainer);
    wrapper.append(title, formContainer, mainLink);
    profile.append(wrapper);

    Profile.populateProfileForm();
  }

  static async updateCustomerNameAndEmail(
    customerId: string,
    newFirstName: string,
    newLastName: string,
    newEmail: string,
    newDateOfBirth: string,
  ) {
    try {
      const customerData = await fetchCustomerData(customerId);

      const response = await apiRoot
        .customers()
        .withId({ ID: customerId })
        .post({
          body: {
            version: customerData.version,
            actions: [
              {
                action: 'setFirstName',
                firstName: newFirstName,
              },
              {
                action: 'setLastName',
                lastName: newLastName,
              },
              {
                action: 'setDateOfBirth',
                dateOfBirth: newDateOfBirth,
              },
              {
                action: 'changeEmail',
                email: newEmail,
              },
            ],
          },
        })
        .execute();
      showModal('Congratulations! Your changes are saved!');
      return response.body;
    } catch (error) {
      if (error instanceof Error) {
        showModal(`${error.message} Please, enter another email address`);
      } else {
        showModal('An error occurred while updating customer information.');
      }
      return null;
    }
  }

  static enableInputs() {
    const editButton = document.querySelector('.btn-edit');
    const saveButton = document.querySelector('.btn-save');

    if (editButton) {
      editButton.addEventListener('click', (event) => {
        event.preventDefault();

        const firstNameField = document.getElementById(
          'first-name-info',
        ) as HTMLInputElement;
        const lastNameField = document.getElementById(
          'last-name-info',
        ) as HTMLInputElement;
        const birthDateField = document.getElementById(
          'birth-date-info',
        ) as HTMLInputElement;
        const email = document.getElementById('email-info') as HTMLInputElement;

        firstNameField.disabled = false;
        lastNameField.disabled = false;
        birthDateField.disabled = false;
        email.disabled = false;

        editButton.classList.add('btn-hidden');
        saveButton?.classList.remove('btn-hidden');
      });
    }
  }

  static saveInputs(customerId: string) {
    const editButton = document.querySelector('.btn-edit');
    const saveButton = document.querySelector('.btn-save');

    if (saveButton) {
      saveButton.addEventListener('click', async (event) => {
        event.preventDefault();

        const firstNameField = document.getElementById(
          'first-name-info',
        ) as HTMLInputElement;
        const lastNameField = document.getElementById(
          'last-name-info',
        ) as HTMLInputElement;
        const birthDateField = document.getElementById(
          'birth-date-info',
        ) as HTMLInputElement;
        const emailField = document.getElementById(
          'email-info',
        ) as HTMLInputElement;

        const newFirstName = firstNameField.value;
        const newLastName = lastNameField.value;
        const newEmail = emailField.value;
        const newDateOfBirth = birthDateField.value;

        try {
          await Profile.updateCustomerNameAndEmail(
            customerId,
            newFirstName,
            newLastName,
            newEmail,
            newDateOfBirth,
          );

          firstNameField.disabled = true;
          lastNameField.disabled = true;
          birthDateField.disabled = true;
          emailField.disabled = true;

          editButton?.classList.remove('btn-hidden');
          saveButton.classList.add('btn-hidden');
        } catch (error) {
          if (error instanceof Error) {
            showModal(error.message);
          }
        }
      });
    }
  }

  static populateProfileForm() {
    const customerLog = Cookies.get('log');

    if (customerLog) {
      const customerId = atob(customerLog);
      fetchCustomerData(customerId)
        .then((fetchedCustomerData) => {
          if (fetchedCustomerData) {
            const { firstName, lastName, dateOfBirth, email, addresses } =
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

            if (firstName && lastName && dateOfBirth && email) {
              const firstNameField = document.getElementById(
                'first-name-info',
              ) as HTMLInputElement;
              firstNameField?.setAttribute('value', firstName);

              const lastNameField = document.getElementById(
                'last-name-info',
              ) as HTMLInputElement;
              lastNameField?.setAttribute('value', lastName);

              const dateOfBirthField = document.getElementById(
                'birth-date-info',
              ) as HTMLInputElement;
              dateOfBirthField?.setAttribute('value', dateOfBirth);

              const emailField = document.getElementById(
                'email-info',
              ) as HTMLInputElement;
              emailField?.setAttribute('value', email);
            }

            const inputFields = document.querySelectorAll(
              '.profile__wrapper input, .profile__wrapper select',
            );
            inputFields.forEach((inputField) => {
              const currentField = inputField as
                | HTMLInputElement
                | HTMLSelectElement;
              currentField.disabled = true;
            });
          }
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
        label: 'E-mail',
        fieldType: 'input',
        inputType: 'text',
        placeholder: '',
        id: 'email-info',
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

document.addEventListener('DOMContentLoaded', () => {
  const customerLog = Cookies.get('log');
  if (customerLog) {
    const customerId = atob(customerLog);
    Profile.enableInputs();
    Profile.saveInputs(customerId);
  }
});
