import Router from '@/router/router';
import createComponent from '@/components/components';
import ErrorPage from '@/pages/errors/error';
import './app.scss';

const CLASS = {
  wrapper: ['main_wrap'],
  center: ['center'],
};

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
    this.login = createComponent('div', [], {});
    this.register = createComponent('div', [], {});
    this.err = new ErrorPage().getWrap();
    this.wrapper = createComponent('div', CLASS.wrapper, {});
    this.routing = new Router(this.createRoutes(), this.center);
  }

  createRoutes() {
    return {
      '/': this.center,
      '/login': this.login,
      '/err': this.err,
      '/register': this.register,
    };
  }

  view() {
    this.wrapper.append(this.main);
    document.body.append(this.wrapper);
  }
}
