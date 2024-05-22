import Login from './login';

describe('createLoginForm', () => {
  let formElement: HTMLFormElement;
  let emailInput: HTMLInputElement;
  let passwordInput: HTMLInputElement;
  let signInButton: HTMLButtonElement;

  beforeEach(() => {
    formElement = Login.createLoginForm();
    document.body.appendChild(formElement);
    emailInput = formElement.querySelector('#email') as HTMLInputElement;
    passwordInput = formElement.querySelector('#password') as HTMLInputElement;
    signInButton = formElement.querySelector('#sign-in') as HTMLButtonElement;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should create a form element with the correct class', () => {
    expect(formElement.querySelector('form')).toBeDefined();
    expect(formElement.classList.contains('login-form')).toBe(true);
  });

  it('should contain all the necessary form elements', () => {
    const formTitleElement = formElement.querySelector('.form-title');
    if (formTitleElement === null)
      throw new Error('Form title element not found');
    expect(formTitleElement.textContent).toBe('Login');

    const formSubtitleElement = formElement.querySelector('.form-subtitle');
    if (formSubtitleElement === null)
      throw new Error('Form subtitle element not found');
    expect(formSubtitleElement.textContent).toBe(
      'Please login using account detail bellow.',
    );

    expect(emailInput).toBeDefined();
    expect(passwordInput).toBeDefined();
    expect(signInButton).toBeDefined();
    expect(formElement.querySelector('.create-account-link')).toBeDefined();
  });

  it('should validate form inputs before submitting', () => {
    emailInput.value = 'invalidemail';
    passwordInput.value = 'short';
    signInButton.click();
    expect(emailInput.classList.contains('input-error')).toBe(true);
    expect(passwordInput.classList.contains('input-error')).toBe(true);
  });
});

describe('createInput', () => {
  it('should create an input element with correct attributes for email', () => {
    const type = 'email';
    const id = 'email';
    const inputContainer = Login.createInput(type, id);
    const input = inputContainer.querySelector('input')!;

    expect(input.tagName).toBe('INPUT');
    expect(input.type).toBe(type);
    expect(input.id).toBe(id);
    expect(input.name).toBe(id);
    expect(input.placeholder).toBe('Email Address');
  });

  it('should create an input element with correct attributes for password', () => {
    const type = 'password';
    const id = 'password';
    const inputContainer = Login.createInput(type, id);
    const input = inputContainer.querySelector('input')!;

    expect(input.tagName).toBe('INPUT');
    expect(input.type).toBe(type);
    expect(input.id).toBe(id);
    expect(input.name).toBe(id);
    expect(input.placeholder).toBe('Password');
  });

  it('should toggle the password visibility when the toggle button is clicked', () => {
    const passwordContainer = Login.createInput('password', 'password');
    document.body.appendChild(passwordContainer);

    const passwordInput = passwordContainer.querySelector('input');
    const toggleButton = passwordContainer.querySelector('button');

    if (!passwordInput || !toggleButton) {
      throw new Error('Could not find input elements or toggle buttons');
    }

    expect(toggleButton.classList.contains('password-toggle'));

    expect(passwordInput.type).toBe('password');

    toggleButton.click();

    expect(passwordInput.type).toBe('text');

    toggleButton.click();

    expect(passwordInput.type).toBe('password');
  });
});

describe('togglePasswordVisibility', () => {
  let inputElement: HTMLInputElement;
  let toggleButtonElement: HTMLButtonElement;

  beforeEach(() => {
    inputElement = document.createElement('input');
    inputElement.type = 'password';

    toggleButtonElement = document.createElement('button');
    toggleButtonElement.classList.add('fa-eye-slash');
  });

  it('should toggle input type and button class', () => {
    Login.togglePasswordVisibility(inputElement, toggleButtonElement);

    expect(inputElement.type).toBe('text');
    expect(inputElement.autocomplete).toBe('off');
    expect(toggleButtonElement.classList.contains('fa-eye')).toBe(true);

    Login.togglePasswordVisibility(inputElement, toggleButtonElement);

    expect(inputElement.type).toBe('password');
    expect(toggleButtonElement.classList.contains('fa-eye-slash')).toBe(true);
  });
});

describe('createButton', () => {
  it('should create a button element with the correct text and id', () => {
    const text = 'Sign in';
    const id = 'sign-in';
    const button = Login.createButton(text, id) as HTMLButtonElement;

    expect(button.tagName).toBe('BUTTON');
    expect(button.textContent).toBe(text);
    expect(button.id).toBe(id);
    expect(button.classList.contains('button')).toBe(true);
  });
});

describe('validateEmail', () => {
  it('should return an error for empty email', () => {
    const result = Login.validateEmail('');
    expect(result).toEqual({
      isValid: false,
      message: 'Email address is required',
    });
  });

  it('should return an error for email with spaces', () => {
    const result = Login.validateEmail(' user@example.com ');
    expect(result).toEqual({
      isValid: false,
      message: 'Email address must not contain spaces',
    });
  });

  it('should return an error for email without "@" symbol', () => {
    const result = Login.validateEmail('userexample.com');
    expect(result).toEqual({
      isValid: false,
      message: 'Email address must contain the "@" symbol',
    });
  });

  it('should return an error for email without domain name', () => {
    const result = Login.validateEmail('user@');
    expect(result).toEqual({
      isValid: false,
      message: 'Email address must contain a domain name',
    });
  });

  it('should return an error for incorrectly formatted email', () => {
    const result = Login.validateEmail('user@domain.');
    expect(result).toEqual({
      isValid: false,
      message: 'Email address must be correctly formatted',
    });
  });

  it('should validate a correct email', () => {
    const result = Login.validateEmail('user@example.com');
    expect(result).toEqual({
      isValid: true,
      message: '',
    });
  });
});

describe('validatePassword', () => {
  it('should return an error for empty password', () => {
    const result = Login.validatePassword('');
    expect(result).toEqual({
      isValid: false,
      message: 'Password is required',
    });
  });

  it('should return an error if password does not meet complexity requirements', () => {
    const result = Login.validatePassword('abcde');
    expect(result).toEqual({
      isValid: false,
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, and one digit',
    });
  });

  it('should return an error if password is less than 8 characters', () => {
    const result = Login.validatePassword('Abc123');
    expect(result).toEqual({
      isValid: false,
      message: 'Password must be at least 8 characters long',
    });
  });

  it('should return an error if password contains spaces', () => {
    const result = Login.validatePassword(' Abc 12345 ');
    expect(result).toEqual({
      isValid: false,
      message: 'Password should not contain spaces',
    });
  });

  it('should validate a correct password', () => {
    const result = Login.validatePassword('Abc12345');
    expect(result).toEqual({
      isValid: true,
      message: '',
    });
  });
});

describe('validateInput', () => {
  let inputElement: HTMLInputElement;
  let parentElement: HTMLElement;

  beforeEach(() => {
    parentElement = document.createElement('form');
    inputElement = document.createElement('input');
    parentElement.appendChild(inputElement);
    document.body.appendChild(parentElement);
  });

  afterEach(() => {
    document.body.removeChild(parentElement);
  });

  it('should trim the spaces', () => {
    inputElement.type = 'email' || 'password' || 'text';
    inputElement.value = ' textWithTrim123 ';
    inputElement.addEventListener('input', () => {
      const result = inputElement.value === inputElement.value.trim();
      expect(result).toBe(true);
    });
  });

  it('should invalidate an incorrect email', () => {
    inputElement.type = 'email';
    inputElement.value = 'invalidemail';
    const result = Login.validateInput(inputElement);
    expect(result).toBe(false);
    Login.validateInput(inputElement);
    expect(inputElement.classList.contains('input-invalid')).toBe(true);
    expect(inputElement.classList.contains('input-error')).toBe(true);
    expect(parentElement.querySelector('.error-message')!.textContent).toBe(
      'Email address must contain the "@" symbol',
    );
  });

  it('should validate a correct email', () => {
    inputElement.type = 'email';
    inputElement.value = 'valid@example.com';
    const result = Login.validateInput(inputElement);
    expect(result).toBe(true);
    expect(inputElement.classList.contains('input-valid')).toBe(true);
  });

  it('should invalidate an incorrect password', () => {
    inputElement.type = 'password';
    inputElement.value = 'asdf1234';
    const result = Login.validateInput(inputElement);
    expect(result).toBe(false);
    Login.validateInput(inputElement);
    expect(inputElement.classList.contains('input-invalid')).toBe(true);
    expect(inputElement.classList.contains('input-error')).toBe(true);
    expect(parentElement.querySelector('.error-message')!.textContent).toBe(
      'Password must contain at least one uppercase letter, one lowercase letter, and one digit',
    );
  });

  it('should validate a correct password', () => {
    inputElement.type = 'password';
    inputElement.value = 'ValidPass123!';
    const result = Login.validateInput(inputElement);
    expect(result).toBe(true);
    expect(inputElement.classList.contains('input-valid')).toBe(true);
  });

  it('should return false for input types other than email or password', () => {
    const inputElement = document.createElement('input');
    inputElement.type = 'number';

    const isValid = Login.validateInput(inputElement);

    expect(isValid).toBe(false);
  });
});

describe('initLoginPage', () => {
  beforeEach(() => {
    const centerElement = document.createElement('div');
    centerElement.classList.add('center');
    document.body.appendChild(centerElement);

    Login.initLoginPage();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should append loginForm to the center', () => {
    expect(document.querySelector('.center')).not.toBeNull();
    expect(document.querySelector('.login-form')).not.toBeNull();
  });

  it('should create a login form with noValidate set to true', () => {
    const loginForm = document.querySelector('.login-form') as HTMLFormElement;
    expect(loginForm).toBeDefined();
    expect(loginForm.noValidate).toBe(true);
  });
});
