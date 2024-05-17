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
    homeLink.setAttribute('href', '/');
    this.header.appendChild(homeLink);

    const links = ['Login', 'Register', 'Logout'];

    links.forEach((linkText) => {
      if (linkText !== 'Logout') {
        const link = createComponent('a', ['nav-links'], {});
        link.textContent = linkText;
        link.setAttribute('href', `/${linkText.toLowerCase()}`);

        nav.appendChild(link);
      }
    });

    this.header.appendChild(nav);
  }

  public getHeader() {
    return this.header;
  }
}

const header = new Header();
const mainWrap = document.querySelector('.main_wrap');
if (mainWrap) {
  mainWrap.appendChild(header.getHeader());
}
