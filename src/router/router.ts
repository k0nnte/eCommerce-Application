import Product from '@/pages/product/product';
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

    const routPath = this.routers[path];

    if (routPath) {
      this.wrapper.innerHTML = '';
      this.wrapper.append(routPath);
    } else {
      const road = path.split('/').join('');
      this.wrapper.innerHTML = '';
      this.wrapper.append(new Product(road).getPage());
    }
  }
}
