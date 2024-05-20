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
    homeLink.innerHTML +=
      '<img width="24" height="24" src="https://img.icons8.com/sf-regular/48/FFFFFF/home-page.png" alt="home-page"/>';
    homeLink.setAttribute('href', '/');
    this.header.appendChild(homeLink);

    this.header.appendChild(homeLink);

    const links = ['Login', 'Register', 'Logout'];

    links.forEach((linkText) => {
      if (linkText !== 'Logout') {
        const cleanLinkText = linkText.replace(/\W/g, '');
        const link = createComponent('a', ['nav-links'], {});
        link.textContent = linkText;
        link.setAttribute('href', `/${cleanLinkText.toLowerCase()}`);

        if (linkText === 'Login') {
          link.innerHTML +=
            '<img width="22" height="22" src="https://img.icons8.com/sf-black/64/FFFFFF/enter-2.png" alt="enter-2"/>';
        }

        if (linkText === 'Register') {
          link.innerHTML +=
            '<img width="22" height="22" src="https://img.icons8.com/sf-black/64/FFFFFF/add-user-male.png" alt="add-user-male"/>';
        }

        if (linkText === 'Logout') {
          link.innerHTML +=
            '<img width="22" height="22" src="https://img.icons8.com/sf-black/64/FFFFFF/exit.png" alt="exit"/>';
        }

        nav.appendChild(link);
      }
    });

    this.header.appendChild(nav);
  }

  public getHeader() {
    return this.header;
  }
}
