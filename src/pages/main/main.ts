import Cookies from 'js-cookie';
import createComponent from '../../components/components';
import img from '../../../public/files/main-image.png';
import './main.scss';

import Profile from '../profile/profile';

export default class Main {
  main: HTMLElement;

  nav: HTMLElement;

  homeLink: HTMLElement;

  loginLink: HTMLElement;

  regLink: HTMLElement;

  profileLink: HTMLElement;

  wrap_main: HTMLElement;

  catalogLink: HTMLElement;

  constructor() {
    this.wrap_main = createComponent('div', ['wrap_main'], {});
    this.main = createComponent('main', ['main'], {});
    this.nav = createComponent('nav', ['main-items'], {});
    this.homeLink = createComponent('a', ['main-links', 'home-link'], {});
    this.loginLink = createComponent('a', ['main-links', 'login-link'], {});
    this.regLink = createComponent('a', ['main-links', 'reg-link'], {});
    this.catalogLink = createComponent('a', ['main-links'], {});
    this.profileLink = createComponent('a', ['main-links', 'profile-link'], {});

    this.render();
  }

  render() {
    this.homeLink.textContent = 'Home';
    this.homeLink.setAttribute('href', '');
    this.homeLink.addEventListener('click', (event: MouseEvent) => {
      const centerElement = document.querySelector('.centercard');
      centerElement?.classList.remove('centercard');
      event.preventDefault();
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    this.loginLink.textContent = 'Login';
    this.loginLink.setAttribute('href', '');
    this.loginLink.addEventListener('click', (event: MouseEvent) => {
      event.preventDefault();
      const islog = Cookies.get('log');
      if (!islog) {
        window.history.pushState({}, '', '/login');
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
    });

    this.regLink.textContent = 'Register';
    this.regLink.setAttribute('href', '');
    this.regLink.addEventListener('click', (event: MouseEvent) => {
      event.preventDefault();
      const islog = Cookies.get('log');
      if (!islog) {
        window.history.pushState({}, '', '/register');
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
    });

    this.profileLink.textContent = 'Profile';
    this.profileLink.setAttribute('href', '');
    this.profileLink.addEventListener('click', (event: MouseEvent) => {
      event.preventDefault();
      const islog = Cookies.get('log');
      if (islog) {
        Profile.populateProfileForm();
        window.history.pushState({}, '', '/profile');
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
      if (!islog) {
        window.history.pushState({}, '', '/login');
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
    });

    this.catalogLink.textContent = `Catalog`;
    this.catalogLink.setAttribute(`href`, '');
    this.catalogLink.addEventListener('click', (event: MouseEvent) => {
      event.preventDefault();
      window.history.pushState({}, '', '/catalog');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    const imageContainer = createComponent('div', ['image-container'], {});
    const image = createComponent('img', ['main-image'], {});
    image.setAttribute('src', img);
    image.setAttribute(
      'alt',
      'Minimalistically designed living room in light colors',
    );

    imageContainer.append(image);

    this.wrap_main.append(this.main);
    this.main.append(this.nav, imageContainer);

    this.nav.append(
      this.homeLink,
      this.loginLink,
      this.regLink,
      this.profileLink,
      this.catalogLink,
    );
  }

  public getMain() {
    return this.wrap_main;
  }
}
