import './app.scss';
import Router from '@/router/router';
import createComponent from '@/components/components';
import Header from '@/components/header/header';
import Main from '@/pages/main/main';
import ErrorPage from '@/pages/errors/error';
import Login from '@/pages/login/login';
import RegistrationForm from '@/pages/registration/registration';
import Profile from '@/pages/profile/profile';
import { customerOn } from '@/components/servercomp/servercomp';
import { router } from '@/router/routerType';

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

  profile: HTMLElement;

  center: HTMLElement;

  headermain: Header;

  // product: Product | undefined;

  constructor() {
    this.headermain = new Header();
    this.header = this.headermain.getHeader();
    this.main = new Main().getMain();
    this.center = createComponent('main', CLASS.center, {});
    this.login = new Login(this.headermain);
    this.register = new RegistrationForm(this.headermain).getWrap();
    this.profile = new Profile().getWrap();
    this.err = new ErrorPage().getWrap();
    this.wrapper = createComponent('div', CLASS.wrapper, {});
    this.routing = new Router(this.createRoutes(), this.center);
  }

  createRoutes(): router {
    return {
      '/': this.main,
      '/login': Login.createLoginForm(),
      '/err': this.err,
      '/register': this.register,
      '/profile': this.profile,
    };
  }

  view() {
    this.wrapper.append(this.header, this.center);
    document.body.append(this.wrapper);
    this.routing.rout();
    customerOn(this.headermain);
  }
}
