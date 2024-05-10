import createComponent from '../../components/components';

export default class Login {
  static createInputWithLabel(
    labelText: string,
    type: string,
    id: string,
  ): HTMLElement {
    const label = createComponent('label', ['input-label'], { for: id });
    label.textContent = labelText;

    const input = createComponent('input', ['input-field'], {
      type,
      id,
      name: id,
    }) as HTMLInputElement;
    input.placeholder = labelText;

    const inputContainer = createComponent('div', ['input-container'], {});
    inputContainer.appendChild(label);
    inputContainer.appendChild(input);

    return inputContainer;
  }

  static createButton(text: string, id: string): HTMLButtonElement {
    const button = createComponent('button', ['button'], {
      id,
    }) as HTMLButtonElement;
    button.textContent = text;
    return button;
  }

  static validateInput(input: HTMLInputElement): boolean {
    if (!input.value) {
      input.classList.add('input-error');
      const error = document.createElement('span');
      error.textContent = 'This field is required';
      error.classList.add('error-message');
      input.parentElement?.insertBefore(error, input.nextSibling);
      return false;
    }
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

    const emailInput = Login.createInputWithLabel(
      'Email Address',
      'email',
      'email',
    );
    const passwordInput = Login.createInputWithLabel(
      'Password',
      'password',
      'password',
    );

    const signInButton = Login.createButton('Sign In', 'sign-in');

    form.appendChild(title);
    form.appendChild(subtitle);
    form.appendChild(emailInput);
    form.appendChild(passwordInput);
    form.appendChild(signInButton);

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
    const header = createComponent('header', ['header'], {});
    const main = Login.createMainElement();
    const loginForm = Login.createLoginForm();
    const footer = createComponent('footer', ['footer'], {});

    main.appendChild(loginForm);

    const body = document.querySelector('body')!;
    body.insertBefore(header, body.firstChild);
    body.appendChild(footer);
    body.insertBefore(main, footer);
  };
}

document.addEventListener('DOMContentLoaded', Login.initLoginPage);
