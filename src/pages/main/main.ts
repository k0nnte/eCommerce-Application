import createComponent from '../../components/components';
import './main.scss';

export default class Main {
  main: HTMLElement;

  nav: HTMLElement;

  homeLink: HTMLElement;

  loginLink: HTMLElement;

  regLink: HTMLElement;

  constructor() {
    this.main = createComponent('main', ['main'], {});
    this.nav = createComponent('nav', ['main-items'], {});
    this.homeLink = createComponent('a', ['main-links', 'main-home'], {});
    this.loginLink = createComponent('a', ['main-links', 'main-login'], {});
    this.regLink = createComponent('a', ['main-links', 'main-reg'], {});
    this.render();
  }

  render() {
    this.homeLink.textContent = 'Home 🏠';
    this.homeLink.setAttribute('href', '');
    this.homeLink.addEventListener('click', (event: MouseEvent) => {
      event.preventDefault();
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    this.loginLink.textContent = 'Login';
    this.loginLink.setAttribute('href', '');
    this.loginLink.addEventListener('click', (event: MouseEvent) => {
      event.preventDefault();
      window.history.pushState({}, '', '/login');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    this.regLink.textContent = 'Register';
    this.regLink.setAttribute('href', '');
    this.regLink.addEventListener('click', (event: MouseEvent) => {
      event.preventDefault();
      window.history.pushState({}, '', '/register');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    this.main.appendChild(this.nav);
    this.nav.append(this.homeLink, this.loginLink, this.regLink);
  }

  public getMain() {
    return this.main;
  }
}
