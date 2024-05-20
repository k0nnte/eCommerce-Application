import createComponent from '../components';
import './header.scss';

export default class Header {
  header: HTMLElement;

  homeLink: null | HTMLElement;

  constructor() {
    this.header = createComponent('header', ['header'], {});
    this.homeLink = null;
    this.render();
  }

  render() {
    const nav = createComponent('nav', ['nav-items'], {});

    this.homeLink = createComponent('a', ['home-link'], {});
    this.homeLink.textContent = 'Home';

    this.homeLink.setAttribute('href', '');
    this.homeLink.innerHTML +=
      '<img width="24" height="24" src="https://img.icons8.com/sf-regular/48/FFFFFF/home-page.png" alt="home-page"/>';
    this.homeLink.addEventListener('click', (event: MouseEvent) => {
      event.preventDefault();
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    this.header.appendChild(this.homeLink);

    this.header.appendChild(this.homeLink);

    const links = ['Login', 'Register', 'Logout'];

    links.forEach((linkText) => {
      if (linkText !== 'Logout') {
        const link = createComponent('a', ['nav-links'], {
          id: `${linkText}`,
        });
        link.textContent = linkText;
        link.setAttribute('href', ``);
        link.addEventListener('click', (event: MouseEvent) => {
          event.preventDefault();
          window.history.pushState({}, '', `/${linkText.toLowerCase()}`);
          window.dispatchEvent(new PopStateEvent('popstate'));
        });
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
      } else {
        const link = createComponent('a', ['nav-links'], {
          id: `${linkText}`,
        });
        link.textContent = linkText;
        link.setAttribute('href', ``);
        // eslint-disable-next-line no-console
        console.log(link);

        // link.addEventListener('click', )
        // TODO //
      }
    });

    this.header.appendChild(nav);
  }

  public getHeader() {
    return this.header;
  }
}
