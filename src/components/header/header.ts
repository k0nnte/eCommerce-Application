import createComponent from '../components';
import './header.scss';

export default class Header {
  header: HTMLElement;

  constructor() {
    this.header = createComponent('header', ['header'], {});
    this.render();
  }

  render() {
    const nav = createComponent('nav', ['nav-items'], {});

    const homeLink = createComponent('a', ['home-link'], {});
    homeLink.textContent = 'Home';
    homeLink.setAttribute('href', '');
    homeLink.addEventListener('click', (event: MouseEvent) => {
      event.preventDefault();
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
    this.header.appendChild(homeLink);

    const links = ['Login', 'Register', 'Logout'];

    links.forEach((linkText) => {
      if (linkText !== 'Logout') {
        const link = createComponent('a', ['nav-links'], {});
        link.textContent = linkText;
        link.setAttribute('href', ``);
        link.addEventListener('click', (event: MouseEvent) => {
          event.preventDefault();
          window.history.pushState({}, '', `/${linkText.toLowerCase()}`);
          window.dispatchEvent(new PopStateEvent('popstate'));
        });

        nav.appendChild(link);
      }
    });

    this.header.appendChild(nav);
  }

  public getHeader() {
    return this.header;
  }
}
