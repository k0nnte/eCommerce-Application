import Router from '@/router/router';
import createComponent from '@/components/components';
import ErrorPage from '@/pages/errors/error';
import Login from '@/pages/Login/login';
import './app.scss';

const CLASS = {
  wrapper: ['main_wrap'],
  center: ['center'],
};

customElements.define('login-element', Login);

export default class App {
  routing: Router;

  wrapper: HTMLElement;

  main: HTMLElement;

  login: HTMLElement;

  err: HTMLElement;

  register: HTMLElement;

  center: HTMLElement;

  constructor() {
    this.main = createComponent('div', [], {});
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
    this.wrapper.append(this.center);
    document.body.append(this.wrapper);
    this.routing.rout();
  }
}
