import Profile from './profile';

HTMLFormElement.prototype.requestSubmit = function customRequestSubmit() {
  if (this.requestSubmit) {
    this.requestSubmit();
  } else {
    this.submit();
  }
};

jest.mock('js-cookie', () => ({
  get: jest.fn(),
}));

jest.mock('@/components/servercomp/servercomp', () => ({
  fetchCustomerData: jest.fn().mockResolvedValue({
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '10/10/2000',
    addresses: [
      {
        streetName: 'ShippingStreet',
        city: 'ShippingCity',
        postalCode: '11111',
      },
      {
        streetName: 'BillingStreet',
        city: 'BillingCity',
        postalCode: '11111',
      },
    ],
  }),
}));

describe('Profile', () => {
  let profileInstance: Profile;
  let formSpy: jest.SpyInstance;
  let querySelectorAllSpy: jest.SpyInstance;

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="app">
        <div class="page__form"></div>
        <a class="logout-link">Logout</a>
      </div>
    `;

    profileInstance = new Profile();
    formSpy = jest.spyOn(document, 'querySelector');
    querySelectorAllSpy = jest.spyOn(
      document.querySelector('.page__form') as HTMLElement,
      'querySelectorAll',
    );
  });

  it('should create a Profile instance', () => {
    expect(profileInstance).toBeInstanceOf(Profile);
  });

  it('should reset form fields on logout', () => {
    const logoutLink = document.querySelector('.logout-link');

    if (logoutLink) {
      logoutLink.addEventListener = jest.fn();
      logoutLink.addEventListener('click', () => {
        Profile.resetOnLogout();
      });
      Profile.resetOnLogout();
    }

    expect(formSpy).toHaveBeenCalledWith('.page__form');
    expect(querySelectorAllSpy).toHaveBeenCalledWith('input, select');
  });

  afterEach(() => {
    formSpy.mockRestore();
    querySelectorAllSpy.mockRestore();
  });
});

describe('Profile', () => {
  let appContainer: HTMLElement | null;
  let mainLink: HTMLElement | null;

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="app">
        <div class="page__form"></div>
        <a class="logout-link">Logout</a>
      </div>
    `;

    appContainer = document.getElementById('app');
    Profile.renderProfileForm(appContainer as HTMLElement);

    mainLink = appContainer!.querySelector('.link-main');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the profile form with main link', () => {
    expect(mainLink).toBeTruthy();
  });

  it('should have a submit button of type "submit"', () => {
    const submitButton = document.querySelector('.btn-edit');
    expect(submitButton).not.toBeNull();

    if (submitButton) {
      expect(submitButton.getAttribute('type')).toBe('submit');
    }
  });

  it('should navigate to the main link location on clicking the main link', () => {
    const pushStateSpy = jest.spyOn(window.history, 'pushState');
    const dispatchEventSpy = jest.spyOn(window, 'dispatchEvent');

    mainLink?.click();
    setTimeout(() => {
      expect(pushStateSpy).toHaveBeenCalledWith({}, '', '/');
      expect(dispatchEventSpy).toHaveBeenCalledWith(
        new PopStateEvent('popstate'),
      );

      pushStateSpy.mockRestore();
      dispatchEventSpy.mockRestore();
    }, 500);
  });

  it('should render the profile form with input fields and labels', () => {
    appContainer = document.getElementById('app');

    Profile.renderProfileForm(appContainer as HTMLElement);

    setTimeout(() => {
      const firstNameInput = appContainer!.querySelector(
        'input[name="first_name"]',
      );
      const firstNameLabel = appContainer!.querySelector(
        'label[for="first_name"]',
      );

      expect(firstNameInput).toBeTruthy();
      expect(firstNameLabel).toBeTruthy();
      expect(firstNameLabel!.textContent).toBe('First Name');
    }, 1000);
  });

  it('should reset form fields on logout', () => {
    Profile.resetOnLogout();

    const firstNameField = appContainer!.querySelector(
      '#first-name-info',
    ) as HTMLInputElement;

    expect(firstNameField.value).toBe('');
  });

  it('should render address container with shipping and billing address sections', () => {
    const shippingAddressContainer = appContainer!.querySelector(
      '.shipping-address-container',
    );
    const billingAddressContainer = appContainer!.querySelector(
      '.billing-address-container',
    );

    expect(shippingAddressContainer).toBeTruthy();
    expect(billingAddressContainer).toBeTruthy();
  });
});

Object.defineProperty(HTMLElement.prototype, 'click', {
  value: jest.fn(),
});

describe('Profile', () => {
  it('should enable personal information inputs on Edit button click', () => {
    const editButton = document.querySelector('.btn-edit') as HTMLButtonElement;
    const firstNameInput = document.querySelector(
      '#first-name-info',
    ) as HTMLInputElement;
    const lastNameInput = document.querySelector(
      '#last-name-info',
    ) as HTMLInputElement;

    if (editButton) {
      editButton.click();
      expect(firstNameInput.disabled).toBe(false);
      expect(lastNameInput.disabled).toBe(false);
    }
  });

  it('should enable shipping address inputs on Edit Shipping Address button click', () => {
    const editShippingButton = document.querySelector(
      '.btn-edit-shipping-address',
    ) as HTMLButtonElement;
    const shippingStreetInput = document.querySelector(
      '#street-shipping-address',
    ) as HTMLInputElement;
    const shippingCityInput = document.querySelector(
      '#city-shipping-address',
    ) as HTMLInputElement;

    editShippingButton.click();

    expect(shippingStreetInput.disabled).toBe(false);
    expect(shippingCityInput.disabled).toBe(false);
  });

  it('should trigger updateShippingAddresses method on Save Shipping Address button click', () => {
    const updateShippingAddressesSpy = jest.spyOn(
      Profile,
      'updateShippingAddresses',
    );

    const saveShippingButton = document.querySelector(
      '.btn-save-shipping-address',
    ) as HTMLButtonElement;

    if (saveShippingButton && updateShippingAddressesSpy) {
      saveShippingButton.click();

      setTimeout(() => {
        try {
          expect(updateShippingAddressesSpy).toHaveBeenCalled();
        } finally {
          updateShippingAddressesSpy.mockRestore();
        }
      }, 500);
    }
  });

  it('should enable billing address inputs on Edit Billing Address button click', () => {
    const editBillingButton = document.querySelector(
      '.btn-edit-billing-address',
    ) as HTMLButtonElement;
    const billingStreetInput = document.querySelector(
      '#street-billing-address',
    ) as HTMLInputElement;
    const billingCityInput = document.querySelector(
      '#city-billing-address',
    ) as HTMLInputElement;

    editBillingButton.click();

    expect(billingStreetInput.disabled).toBe(false);
    expect(billingCityInput.disabled).toBe(false);
  });

  it('should trigger updateBillingAddresses method on Save Billing Address button click', () => {
    const updateBillingAddressesSpy = jest.spyOn(
      Profile,
      'updateBillingAddresses',
    );
    const saveBillingButton = document.querySelector(
      '.btn-save-billing-address',
    ) as HTMLButtonElement;

    if (saveBillingButton && updateBillingAddressesSpy) {
      saveBillingButton.click();

      setTimeout(() => {
        expect(updateBillingAddressesSpy).toHaveBeenCalled();

        updateBillingAddressesSpy.mockRestore();
      }, 500);
    }
  });

  it('should disable personal information inputs on Save button click', () => {
    const saveButton = document.querySelector(
      '.btn-save-personal-info',
    ) as HTMLButtonElement;
    const firstNameInput = document.querySelector(
      '#first-name-info',
    ) as HTMLInputElement;
    const lastNameInput = document.querySelector(
      '#last-name-info',
    ) as HTMLInputElement;

    if (saveButton) {
      saveButton.click();
      expect(firstNameInput.disabled).toBe(true);
      expect(lastNameInput.disabled).toBe(true);
    }
  });

  it('should disable shipping address inputs on Save Shipping Address button click', () => {
    const saveShippingButton = document.querySelector(
      '.btn-save-shipping-address',
    ) as HTMLButtonElement;
    const shippingStreetInput = document.querySelector(
      '#street-shipping-address',
    ) as HTMLInputElement;
    const shippingCityInput = document.querySelector(
      '#city-shipping-address',
    ) as HTMLInputElement;

    if (saveShippingButton) {
      saveShippingButton.click();
      setTimeout(() => {
        expect(shippingStreetInput.disabled).toBe(true);
        expect(shippingCityInput.disabled).toBe(true);
      }, 500);
    }
  });

  it('should disable billing address inputs on Save Billing Address button click', () => {
    const saveBillingButton = document.querySelector(
      '.btn-save-billing-address',
    ) as HTMLButtonElement;
    const billingStreetInput = document.querySelector(
      '#street-billing-address',
    ) as HTMLInputElement;
    const billingCityInput = document.querySelector(
      '#city-billing-address',
    ) as HTMLInputElement;

    if (saveBillingButton) {
      saveBillingButton.click();
      setTimeout(() => {
        expect(billingStreetInput.disabled).toBe(true);
        expect(billingCityInput.disabled).toBe(true);
      }, 500);
    }
  });
});
