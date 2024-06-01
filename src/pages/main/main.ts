import Cookies from 'js-cookie';
import createComponent from '../../components/components';
import './main.scss';
import {
  addCard,
  getAllProduct,
  getProd,
  getvalueCardProduct,
} from '../../components/servercomp/servercomp';
import Filter from '../../components/filter/filter';
import Profile from '../profile/profile';
import vector from '../../../public/files/Vector.svg';

export default class Main {
  main: HTMLElement;

  nav: HTMLElement;

  homeLink: HTMLElement;

  loginLink: HTMLElement;

  regLink: HTMLElement;

  profileLink: HTMLElement;

  wrapper_Catalog: HTMLElement;

  wrap_main: HTMLElement;

  search: HTMLElement;

  searchName: HTMLElement;

  search_wrapper: HTMLElement;

  btnSech: HTMLElement;

  btmImg: HTMLElement;

  constructor() {
    this.wrap_main = createComponent('div', ['wrap_main'], {});
    this.main = createComponent('main', ['main'], {});
    this.nav = createComponent('nav', ['main-items'], {});
    this.homeLink = createComponent('a', ['main-links', 'home-link'], {});
    this.loginLink = createComponent('a', ['main-links', 'login-link'], {});
    this.regLink = createComponent('a', ['main-links', 'reg-link'], {});
    this.profileLink = createComponent('a', ['main-links', 'profile-link'], {});
    this.wrapper_Catalog = createComponent('div', ['wrapper_catalog'], {});
    this.search = new Filter(this.wrapper_Catalog).getFilter();
    this.searchName = createComponent('input', ['select_sech'], {});
    this.search_wrapper = createComponent('div', ['wrapper_searchs'], {});
    this.btnSech = createComponent('button', ['btn_sech'], {});
    this.btmImg = createComponent('img', [], {});

    this.render();
    this.renderCatalog();
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

    this.wrap_main.append(this.main);
    this.main.appendChild(this.nav);

    this.nav.append(this.homeLink, this.loginLink, this.regLink);
    this.wrap_main.append(this.search);
    this.nav.append(
      this.homeLink,
      this.loginLink,
      this.regLink,
      this.profileLink,
    );

    this.search_wrapper.append(this.searchName, this.btnSech);
    (this.btmImg as HTMLImageElement).src = vector;
    this.btnSech.append(this.btmImg);
    this.main.append(this.search_wrapper);
    this.addListnerBtn();
  }

  renderCatalog() {
    const response = getAllProduct();
    response.then((data) => {
      addCard(data, this.wrapper_Catalog);
    });
    this.wrap_main.append(this.wrapper_Catalog);
  }

  public getMain() {
    return this.wrap_main;
  }

  addListnerBtn() {
    this.btnSech.addEventListener('click', () => {
      const { value } = this.searchName as HTMLInputElement;
      const reques = value.toLowerCase().replace(/ /g, '-');
      const response = getProd(reques);
      response
        .then((data) => {
          // eslint-disable-next-line no-console
          console.log(data);

          getvalueCardProduct(data, this.wrapper_Catalog);
        })
        .catch((err) => {
          // eslint-disable-next-line no-console
          console.log(err);
        });
    });
  }
}
