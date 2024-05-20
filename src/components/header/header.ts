import createComponent from '../components';
import './header.scss';

export default class Header {
  header: HTMLElement;

  nav: HTMLElement;

  homeLink: null | HTMLElement;

  loginLink: null | HTMLElement;

  regLink: null | HTMLElement;

  logoutLink: null | HTMLElement;

  constructor() {
    this.header = createComponent('header', ['header'], {});
    this.nav = createComponent('nav', ['nav-items'], {});
    this.homeLink = null;
    this.loginLink = null;
    this.regLink = null;
    this.logoutLink = null;
    this.render();
  }

  render() {
    this.homeLink = createComponent('a', ['nav-link', 'home-link'], {});
    this.homeLink.textContent = 'Home';
    this.homeLink.setAttribute('href', '');
    this.homeLink.innerHTML +=
      '<img width="24" height="24" src="https://img.icons8.com/sf-regular/48/FFFFFF/home-page.png" alt="home-page"/>';
    this.homeLink.addEventListener('click', (event: MouseEvent) => {
      event.preventDefault();
      window.history.pushState({}, '', '/');
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
      event.preventDefault();
      window.history.pushState({}, '', '/register');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    this.logoutLink = createComponent('a', ['nav-link', 'login-link'], {});
    this.logoutLink.textContent = 'Logout';
    this.logoutLink.setAttribute('href', '');
    this.logoutLink.innerHTML +=
      '<img width="22" height="22" src="https://img.icons8.com/sf-black/64/FFFFFF/exit.png" alt="exit"/>';
    this.logoutLink.addEventListener('click', (event: MouseEvent) => {
      event.preventDefault();
      window.history.pushState({}, '', '/logout');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    this.header.append(this.homeLink, this.nav);
    this.nav.append(this.loginLink, this.regLink);

    // links.forEach((linkText) => {
    //   if (linkText !== 'Logout') {
    //     const link = createComponent('a', ['nav-links'], {
    //       id: `${linkText}`,
    //     });
    //     link.textContent = linkText;
    //     link.setAttribute('href', ``);
    //     link.addEventListener('click', (event: MouseEvent) => {
    //       event.preventDefault();
    //       window.history.pushState({}, '', `/${linkText.toLowerCase()}`);
    //       window.dispatchEvent(new PopStateEvent('popstate'));
    //     });

    //     nav.appendChild(link);
    //   } else {
    //     const link = createComponent('a', ['nav-links'], {
    //       id: `${linkText}`,
    //     });
    //     link.textContent = linkText;
    //     link.setAttribute('href', ``);
    //     // eslint-disable-next-line no-console
    //     console.log(link);

    //     // link.addEventListener('click', )
    //     // TODO //
    //   }
    // });
  }

  public getHeader() {
    return this.header;
  }
}
