import Router from '@/router/router';
import createComponent from '@/components/components';
import Header from '@/components/header/header';
import Main from '@/pages/main/main';
import ErrorPage from '@/pages/errors/error';
import Login from '@/pages/login/login';
import './app.scss';

const CLASS = {
  wrapper: ['main_wrap'],
  header: ['header'],
  center: ['center'],
  main: ['main'],
};

customElements.define('login-element', Login);

export default class App {
  routing: Router;

  wrapper: HTMLElement;

  header: HTMLElement;

  main: HTMLElement;

  login: HTMLElement;

  err: HTMLElement;

  register: HTMLElement;

  center: HTMLElement;

  constructor() {
    this.header = new Header().getHeader();
    this.main = new Main().getMain();
    this.center = createComponent('div', CLASS.center, {});
    this.login = new Login();
    this.register = createComponent('div', [], {});
    this.err = new ErrorPage().getWrap();
    this.wrapper = createComponent('div', CLASS.wrapper, {});
    this.routing = new Router(this.createRoutes(), this.center);
  }

  createRoutes() {
    return {
      '/': this.main,
      '/login': Login.createLoginForm(),
      '/err': this.err,
      '/register': this.register,
    };
  }

  view() {
    this.wrapper.append(this.header, this.center);
    document.body.append(this.wrapper);
    this.routing.rout();
  }
}
