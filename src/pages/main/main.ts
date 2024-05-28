/* eslint-disable no-console */
import Cookies from 'js-cookie';
import createComponent from '../../components/components';
import './main.scss';
import Card from '../../components/cardProduct/cardProduct';
import { getAllProduct } from '../../components/servercomp/servercomp';
import Filter from '../../components/filter/filter';

export default class Main {
  main: HTMLElement;

  nav: HTMLElement;

  homeLink: HTMLElement;

  loginLink: HTMLElement;

  regLink: HTMLElement;

  wrapper_Catalog: HTMLElement;

  wrap_main: HTMLElement;

  search: HTMLElement;

  constructor() {
    this.wrap_main = createComponent('div', ['wrap_main'], {});
    this.main = createComponent('main', ['main'], {});
    this.nav = createComponent('nav', ['main-items'], {});
    this.homeLink = createComponent('a', ['main-links', 'home-link'], {});
    this.loginLink = createComponent('a', ['main-links', 'login-link'], {});
    this.regLink = createComponent('a', ['main-links', 'reg-link'], {});
    this.wrapper_Catalog = createComponent('div', ['wrapper_catalog'], {});
    this.search = new Filter().getFilter();
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
    this.wrap_main.append(this.main);
    this.main.appendChild(this.nav);
    this.nav.append(this.homeLink, this.loginLink, this.regLink);

    this.wrap_main.append(this.search);
  }

  renderCatalog() {
    const response = getAllProduct();
    response.then((data) => {
      for (let i = 0; i < data.results.length; i += 1) {
        const result = data.results[i].masterData.current;
        const imgUrl = result.masterVariant.images![0].url;
        const name = result.name['en-US'];
        const bref = result.masterVariant.attributes![0].value['en-US'];
        const price = `${result.masterVariant.prices![2].value.centAmount} ${result.masterVariant.prices![2].value.currencyCode}`;
        const discount = `${result.masterVariant.prices![2].discounted?.value.centAmount} ${result.masterVariant.prices![2].discounted?.value.currencyCode}`;

        this.wrapper_Catalog.append(
          new Card(imgUrl, name, bref, price, discount).getCard(),
        );
      }
    });
    this.wrap_main.append(this.wrapper_Catalog);
  }

  public getMain() {
    return this.wrap_main;
  }
}
