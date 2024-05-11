import Router from '@/router/router';
import createComponent from '@/components/components';

export default class App {
  routing: Router;

  wrapper: HTMLElement;

  main: string;

  login: string;

  err: string;

  register: string;

  constructor() {
    this.main = 'main';
    this.login = 'login';
    this.register = 'register';
    this.err = 'err';
    this.wrapper = createComponent('div', [], {});
    this.routing = new Router(this.createRoutes(), this.wrapper);
  }

  createRoutes() {
    return {
      '/': this.main,
      '/login': this.login,
      '/err': this.err,
      '/register': this.register,
    };
  }

  view() {
    document.body.append(this.wrapper);
  }
}
