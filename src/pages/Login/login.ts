import './login.scss';
import 'font-awesome/css/font-awesome.min.css';
import createComponent from '../../components/components';

interface ValidationResult {
  isValid: boolean;
  message: string;
}

export default class Login {
  static togglePasswordVisibility(
    inputElement: HTMLInputElement,
    toggleButtonElement: HTMLButtonElement,
  ) {
    const input = inputElement;
    const inputType = inputElement.type === 'password' ? 'text' : 'password';
    input.type = inputType;
    const toggleClass = inputType === 'text' ? 'fa-eye' : 'fa-eye-slash';
    toggleButtonElement.classList.replace('fa-eye', 'fa-eye-slash');
    toggleButtonElement.classList.replace('fa-eye-slash', toggleClass);

    Login.validateInput(inputElement);
  }

  static createInput(type: string, id: string): HTMLElement {
    const placeholder =
      id === 'email'
        ? 'Email Address'
        : id.charAt(0).toUpperCase() + id.slice(1);
    const input = createComponent('input', ['input-field'], {
      type,
      id,
      name: id,
      placeholder,
    }) as HTMLInputElement;

    const inputContainer = createComponent('div', ['input-container'], {});
    inputContainer.appendChild(input);

    input.addEventListener('input', function validateInputField() {
      Login.validateInput(this);
    });
    if (type === 'password') {
      const toggleButton = createComponent(
        'button',
        ['password-toggle', 'fa', 'fa-eye-slash'],
        {},
      ) as HTMLButtonElement;

      toggleButton.type = 'button';
      toggleButton.addEventListener('click', () => {
        Login.togglePasswordVisibility(input, toggleButton);
      });
      inputContainer.appendChild(toggleButton);
    }
    return inputContainer;
  }

  static createButton(text: string, id: string): HTMLButtonElement {
    const button = createComponent('button', ['button'], {
      id,
    }) as HTMLButtonElement;
    button.textContent = text;
    return button;
  }

  static validateEmail(email: string): ValidationResult {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return { isValid: false, message: 'Email address is required.' };
    }

    if (!emailRegex.test(email)) {
      return {
        isValid: false,
        message: 'Email address must be correctly formatted.',
      };
    }

    if (email !== email.trim()) {
      return {
        isValid: false,
        message:
          'Email address must not contain spaces at the beginning or end',
      };
    }

    if (!email.includes('@')) {
      return {
        isValid: false,
        message: 'Email address must contain the "@" symbol',
      };
    }

    const domainPart = email.split('@')[1];
    if (!domainPart || !domainPart.includes('.')) {
      return {
        isValid: false,
        message: 'Email address must contain a domain name',
      };
    }
    return { isValid: true, message: '' };
  }

  static validatePassword(password: string): ValidationResult {
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
    if (!password) return { isValid: false, message: 'Password is required' };
    if (password.length < 8)
      return {
        isValid: false,
        message: 'Password must be at least 8 characters long',
      };
    if (!passwordRegex.test(password))
      return {
        isValid: false,
        message:
          'Password must contain at least one uppercase letter, one lowercase letter, and one digit',
      };
    if (password !== password.trim())
      return {
        isValid: false,
        message: 'Password should not contain spaces at the beginning or end',
      };
    return { isValid: true, message: '' };
  }

  static validateInput(input: HTMLInputElement): boolean {
    const parent = input.parentElement;
    if (parent) {
      const existingError = parent.querySelector('.error-message');
      if (existingError) {
        parent.removeChild(existingError);
      }
    }
    input.classList.remove('input-error', 'input-invalid', 'input-valid');
    input.classList.add('input-invalid');

    let validationResult: ValidationResult;
    if (input.type === 'email') {
      validationResult = Login.validateEmail(input.value);
    } else if (input.type === 'password') {
      validationResult = Login.validatePassword(input.value);
    } else {
      input.classList.add('input-invalid');
      return false;
    }

    if (!validationResult.isValid) {
      input.classList.add('input-error', 'input-invalid');
      const error = document.createElement('span');
      error.textContent = validationResult.message;
      error.classList.add('error-message');

      if (parent) {
        parent.insertBefore(error, input.nextSibling);
      } else {
        input.after(error);
      }
      return false;
    }

    input.classList.remove('input-invalid');
    input.classList.add('input-valid');
    return true;
  }

  static createMainElement(): HTMLElement {
    const main = createComponent('main', ['main'], {});
    return main;
  }

  static createLoginForm(): HTMLFormElement {
    const form = createComponent('form', ['login-form'], {}) as HTMLFormElement;

    const title = createComponent('h1', ['form-title'], {});
    title.textContent = 'Login';

    const subtitle = createComponent('p', ['form-subtitle'], {});
    subtitle.textContent = 'Please login using account detail bellow.';

    const emailInput = Login.createInput('email', 'email');
    const passwordInput = Login.createInput('password', 'password');

    const signInButton = Login.createButton('Sign In', 'sign-in');

    const accountText = createComponent('p', ['account-text'], {});
    accountText.innerHTML = `Don’t have an Account? <a href="/register" class="create-account-link">Create account</a>`;

    form.appendChild(title);
    form.appendChild(subtitle);
    form.appendChild(emailInput);
    form.appendChild(passwordInput);
    form.appendChild(signInButton);
    form.appendChild(accountText);

    form.onsubmit = (e) => {
      e.preventDefault();
      const inputs = form.querySelectorAll('.input-field');
      let isValid = true;
      inputs.forEach((input) => {
        isValid = Login.validateInput(input as HTMLInputElement) && isValid;
      });
      if (isValid) {
        // Логика отправки данных формы
      }
    };

    return form;
  }

  static initLoginPage = (): void => {
    const body = document.querySelector('body')!;
    const header = createComponent('header', ['header'], {});
    const main = Login.createMainElement();
    const loginForm = Login.createLoginForm();
    const footer = createComponent('footer', ['footer'], {});

    body.appendChild(header);
    body.appendChild(main);
    main.appendChild(loginForm);
    body.appendChild(footer);
  };
}

document.addEventListener('DOMContentLoaded', Login.initLoginPage);
