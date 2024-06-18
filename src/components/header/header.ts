/* eslint-disable no-console */
import Cookies from 'js-cookie';
import Profile from '@/pages/profile/profile';
import Cart from '@/pages/cart/cart';
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

  cartLink: HTMLElement | null = null;

  cartItemCount: HTMLElement | null = null;

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
    this.updateHeaderCartCount();
    this.render();
  }

  async updateCartItemCount() {
    const logResult = await isLog();
    if (logResult) {
      if ('value' in logResult && 'anon' in logResult && 'token' in logResult) {
        const { value, anon, token } = logResult;
        const cartData = await getCart(value, anon, token);
        if (
          cartData &&
          'lineItems' in cartData.body &&
          this.cartItemCount instanceof HTMLElement
        ) {
          const totalQuantity = cartData.body.lineItems.reduce(
            (total, item) => total + item.quantity,
            0,
          );
          const count = document.querySelector('.cart-item-count');
          if (count) {
            count.textContent = totalQuantity.toString();
          }
        }
      }
    }
  }

  updateHeaderCartCount() {
    document.addEventListener('cart-updated', async () => {
      await this.updateCartItemCount();
    });
  }

  async triggerCartUpdate() {
    const logResult = await isLog();
    if (
      logResult &&
      'value' in logResult &&
      'anon' in logResult &&
      'token' in logResult
    ) {
      const { value, anon, token } = logResult;
      const cartData = await getCart(value, anon, token);
      if (cartData) {
        this.cartItemCount = document.createElement('span');
        this.cartItemCount.textContent =
          cartData.body.lineItems.length.toString();
        this.cartLink = document.createElement('a');
        this.cartLink.setAttribute('href', '/cart');
        this.cartLink.textContent = 'Cart';
      }
    }

    const cartUpdatedEvent = new CustomEvent('cart-updated');
    document.dispatchEvent(cartUpdatedEvent);
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
      const header = new Header();
      header.triggerCartUpdate();
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

    this.cartLink = createComponent(
      'a',
      ['nav-link', 'cart-link'],
      {},
    ) as HTMLElement;
    this.cartLink.innerHTML +=
      '<img width="22" height="22" src="https://img.icons8.com/sf-regular/96/FFFFFF/shopping-cart.png" alt="shopping-cart"/>';
    this.cartLink.setAttribute('href', '');
    this.cartLink.addEventListener('click', (event: MouseEvent) => {
      const centerElement = document.querySelector('.centercard');
      centerElement?.classList.remove('centercard');
      event.preventDefault();
      window.history.pushState({}, '', '/cart');
      window.dispatchEvent(new PopStateEvent('popstate'));
      const cartContainer = document.querySelector('.cart-container');
      if (cartContainer) {
        cartContainer.innerHTML = '';
      }
      Cart.fetchAndDisplayCartItems();
    });
    this.cartItemCount = createComponent(
      'span',
      ['cart-item-count'],
      {},
    ) as HTMLElement;
    if (this.cartItemCount) {
      this.cartLink.appendChild(this.cartItemCount);
      this.updateCartItemCount();
    }

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
