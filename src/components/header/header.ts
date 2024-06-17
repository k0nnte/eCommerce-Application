import Cookies from 'js-cookie';
import Profile from '@/pages/profile/profile';
import createComponent from '../components';
import { customerOn, getCart, isLog } from '../servercomp/servercomp';
import './header.scss';

export default class Header {
  header: HTMLElement;

  nav: HTMLElement;

  homeLink: null | HTMLElement;

  aboutLink: null | HTMLElement;

  loginLink: null | HTMLElement;

  regLink: null | HTMLElement;

  catalogLink: null | HTMLElement;

  logoutLink: null | HTMLElement;

  profileLink: null | HTMLElement;

  cartLink: null | HTMLElement;

  cartItemCount: null | HTMLElement;

  constructor() {
    this.header = createComponent('header', ['header'], {});
    this.nav = createComponent('nav', ['nav-items'], {});
    this.homeLink = null;
    this.loginLink = null;
    this.regLink = null;
    this.catalogLink = null;
    this.profileLink = null;
    this.logoutLink = null;
    this.aboutLink = null;
    this.cartLink = null;
    this.cartItemCount = null;
    this.render();
  }

  async updateCartItemCount() {
    const logResult = await isLog();
    if (logResult) {
      if ('value' in logResult && 'anon' in logResult && 'token' in logResult) {
        const { value, anon, token } = logResult;
        const cartData = await getCart(value, anon, token);
        if (cartData && this.cartItemCount) {
          const itemCount = cartData.body.lineItems.length;
          this.cartItemCount.textContent = itemCount.toString();
        }
      }
    }
  }

  render() {
    this.homeLink = createComponent('a', ['nav-link', 'home-link'], {});
    this.homeLink.textContent = 'Home';
    this.homeLink.setAttribute('href', '');
    this.homeLink.innerHTML +=
      '<img width="24" height="24" src="https://img.icons8.com/sf-regular/48/FFFFFF/home-page.png" alt="home-page"/>';
    this.homeLink.addEventListener('click', (event: MouseEvent) => {
      const centerElement = document.querySelector('.centercard');
      centerElement?.classList.remove('centercard');
      event.preventDefault();
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    this.catalogLink = createComponent('a', ['nav-link', 'catalog-link'], {});
    this.catalogLink.textContent = 'Catalog';
    this.catalogLink.setAttribute('href', '');
    this.catalogLink.innerHTML +=
      '<img width="24" height="24" src="https://img.icons8.com/sf-regular/96/FFFFFF/spiral-bound-booklet.png" alt="spiral-bound-booklet"/>';
    this.catalogLink.addEventListener('click', (event: MouseEvent) => {
      const centerElement = document.querySelector('.centercard');
      centerElement?.classList.remove('centercard');
      event.preventDefault();
      window.history.pushState({}, '', '/catalog');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    this.loginLink = createComponent('a', ['nav-link', 'login-link'], {});
    this.loginLink.textContent = 'Login';
    this.loginLink.setAttribute('href', '');
    this.loginLink.innerHTML +=
      '<img width="22" height="22" src="https://img.icons8.com/sf-black/64/FFFFFF/enter-2.png" alt="enter-2"/>';
    this.loginLink.addEventListener('click', (event: MouseEvent) => {
      event.preventDefault();
      window.history.pushState({}, '', '/login');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    this.regLink = createComponent('a', ['nav-link', 'reg-link'], {});
    this.regLink.textContent = 'Register';
    this.regLink.setAttribute('href', '');
    this.regLink.innerHTML +=
      '<img width="22" height="22" src="https://img.icons8.com/sf-black/64/FFFFFF/add-user-male.png" alt="add-user-male"/>';
    this.regLink.addEventListener('click', (event: MouseEvent) => {
      const centerElement = document.querySelector('.centercard');
      centerElement?.classList.remove('centercard');
      event.preventDefault();
      window.history.pushState({}, '', '/register');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    this.logoutLink = createComponent('a', ['nav-link', 'logout-link'], {});
    this.logoutLink.textContent = 'Logout';
    this.logoutLink.setAttribute('href', '');
    this.logoutLink.innerHTML +=
      '<img width="22" height="22" src="https://img.icons8.com/sf-black/64/FFFFFF/exit.png" alt="exit"/>';
    this.logoutLink.addEventListener('click', (event: MouseEvent) => {
      const centerElement = document.querySelector('.centercard');
      centerElement?.classList.remove('centercard');
      event.preventDefault();
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
      Cookies.remove('log');
      Cookies.remove('token');
      customerOn(this);
      const events = new CustomEvent('restartCatalog');
      document.dispatchEvent(events);
    });

    this.profileLink = createComponent('a', ['nav-link', 'profile-link'], {});
    this.profileLink.textContent = 'Profile';
    this.profileLink.setAttribute('href', '/');
    this.profileLink.innerHTML +=
      '<img width="22" height="22" src="https://img.icons8.com/sf-black/64/FFFFFF/user-male.png" alt="user-profile"/>';
    this.profileLink.addEventListener('click', (event: MouseEvent) => {
      event.preventDefault();
      window.history.pushState({}, '', '/profile');
      window.dispatchEvent(new PopStateEvent('popstate'));
      Profile.populateProfileForm();
    });

    this.aboutLink = createComponent('a', ['nav-link', 'about-link'], {});
    this.aboutLink.textContent = 'AboutUs';
    this.aboutLink.innerHTML +=
      '<img width="22" height="22" src="https://img.icons8.com/sf-regular/96/FFFFFF/potted-plant.png" alt="about-page"/>';
    this.aboutLink.setAttribute('href', '');
    this.aboutLink.addEventListener('click', (event: MouseEvent) => {
      const centerElement = document.querySelector('.centercard');
      centerElement?.classList.remove('centercard');
      event.preventDefault();
      window.history.pushState({}, '', '/about');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    this.cartLink = createComponent('a', ['nav-link', 'cart-link'], {});
    this.cartLink.innerHTML +=
      '<img width="22" height="22" src="https://img.icons8.com/sf-regular/96/FFFFFF/shopping-cart.png" alt="shopping-cart"/>';
    this.cartLink.setAttribute('href', '');
    this.cartLink.addEventListener('click', (event: MouseEvent) => {
      const centerElement = document.querySelector('.centercard');
      centerElement?.classList.remove('centercard');
      event.preventDefault();
      window.history.pushState({}, '', '/cart');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
    this.cartItemCount = createComponent('span', ['cart-item-count'], {});
    this.cartLink.append(this.cartItemCount);
    this.updateCartItemCount();

    this.header.append(this.homeLink, this.nav);
    this.nav.append(
      this.catalogLink,
      this.profileLink,
      this.loginLink,
      this.regLink,
      this.aboutLink,
      this.cartLink,
    );
  }

  public getHeader() {
    return this.header;
  }
}
