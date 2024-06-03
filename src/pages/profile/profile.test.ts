import Profile from './profile';

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

    expect(pushStateSpy).toHaveBeenCalledWith({}, '', '/');
    expect(dispatchEventSpy).toHaveBeenCalledWith(
      new PopStateEvent('popstate'),
    );

    pushStateSpy.mockRestore();
    dispatchEventSpy.mockRestore();
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
