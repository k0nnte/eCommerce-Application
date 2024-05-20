import Router from '@/router/router';
import createComponent from '@/components/components';
import Header from '@/components/header/header';
import ErrorPage from '@/pages/errors/error';
import Login from '@/pages/Login/login';
import RegistrationForm from '@/pages/registration/registration';
import './app.scss';

const CLASS = {
  wrapper: ['main_wrap'],
  header: ['header'],
  center: ['center'],
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

  headermain: Header;

  constructor() {
    this.headermain = new Header();
    this.header = this.headermain.getHeader();
    this.main = createComponent('div', [], {});
    this.center = createComponent('main', CLASS.center, {});
    this.login = new Login(this.headermain);
    this.register = new RegistrationForm().getWrap();
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
