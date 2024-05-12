import { router } from './routerType';

export default class Router {
  routers: router;

  wrapper: HTMLElement;

  constructor(routers: router, wrapper: HTMLElement) {
    this.routers = routers;
    this.wrapper = wrapper;
    this.init();
  }

  init() {
    window.addEventListener('DOMContentLoaded', this.rout.bind(this));
    window.addEventListener('popstate', this.rout.bind(this));
  }

  rout() {
    const path = window.location.pathname;
    // eslint-disable-next-line no-console
    console.log(path);

    const routPath = this.routers[path];

    if (routPath) {
      this.wrapper.innerHTML = '';
      this.wrapper.append(routPath);
    } else {
      this.wrapper.innerHTML = '';
      this.wrapper.append(this.routers['/err']);
    }
  }
}
