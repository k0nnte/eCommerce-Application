export default class Router {
  routers: any;

  constructor(routers: any) {
    this.routers = routers;
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
      console.log(routPath);
    } else {
      console.log(this.routers['/err']);
    }
  }
}
