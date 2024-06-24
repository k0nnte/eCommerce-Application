import Cookies from 'js-cookie';
import createComponent from '../../components/components';
import img from '../../../public/files/main-image.png';
import './main.scss';
import Profile from '../profile/profile';
import Cart from '../cart/cart';

export default class Main {
  main: HTMLElement;

  wrap_main: HTMLElement;

  nav: HTMLElement;

  homeLink: HTMLElement;

  loginLink: HTMLElement;

  regLink: HTMLElement;

  profileLink: HTMLElement;

  catalogLink: HTMLElement;

  cartLink: HTMLElement;

  aboutLink: HTMLElement;

  constructor() {
    this.wrap_main = createComponent('div', ['wrap_main'], {});
    this.main = createComponent('main', ['main'], {});
    this.nav = createComponent('nav', ['main-items'], {});
    this.homeLink = createComponent('a', ['main-links', 'home-link'], {});
    this.loginLink = createComponent('a', ['main-links', 'login-link'], {});
    this.regLink = createComponent('a', ['main-links', 'reg-link'], {});
    this.profileLink = createComponent('a', ['main-links', 'profile-link'], {});
    this.catalogLink = createComponent('a', ['main-links', 'catalog-link'], {});
    this.cartLink = createComponent('a', ['main-links', 'cart-link'], {});
    this.aboutLink = createComponent('a', ['main-links', 'about-link'], {});

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

    this.cartLink.textContent = `Cart`;
    this.cartLink.setAttribute(`href`, '');
    this.cartLink.addEventListener('click', (event: MouseEvent) => {
      event.preventDefault();
      window.history.pushState({}, '', '/cart');
      window.dispatchEvent(new PopStateEvent('popstate'));
      const cartContainer = document.querySelector('.cart-container');
      if (cartContainer) {
        cartContainer.innerHTML = '';
      }
      Cart.fetchAndDisplayCartItems();
    });

    this.aboutLink.textContent = `About Us`;
    this.aboutLink.setAttribute(`href`, '');
    this.aboutLink.addEventListener('click', (event: MouseEvent) => {
      event.preventDefault();
      window.history.pushState({}, '', '/about');
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
      this.cartLink,
      this.aboutLink,
    );
  }

  public getMain() {
    return this.wrap_main;
  }
}
