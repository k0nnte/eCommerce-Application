import Router from '@/router/router';
import createComponent from '@/components/components';

export default class App {
  routing: Router;

  wrapper: HTMLElement;

  main: HTMLElement;

  login: HTMLElement;

  err: HTMLElement;

  register: HTMLElement;

  constructor() {
    this.main = createComponent('div', [], {});
    this.login = createComponent('div', [], {});
    this.register = createComponent('div', [], {});
    this.err = createComponent('div', [], {});
    this.wrapper = createComponent('div', [], {});
    this.routing = new Router(this.createRoutes(), this.wrapper);
  }

  createRoutes() {
    return {
      '/': this.main.innerHTML,
      '/login': this.login.innerHTML,
      '/err': this.err.innerHTML,
      '/register': this.register.innerHTML,
    };
  }

  view() {
    document.body.append(this.wrapper);
  }
}
