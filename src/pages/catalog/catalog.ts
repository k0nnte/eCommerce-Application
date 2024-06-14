/* eslint-disable no-console */
import createComponent from '@/components/components';
import Filter from '@/components/filter/filter';
import createModal from '@/components/modal/modal';
import {
  addCard,
  getAllProduct,
  getgetProdByName,
} from '@/components/servercomp/servercomp';
import vector from '../../../public/files/Vector.png';
import './catalog.scss';

export default class Catalog {
  wrap_main: HTMLElement;

  wrapper_Catalog: HTMLElement;

  searchName: HTMLElement;

  search_wrapper: HTMLElement;

  btnSech: HTMLElement;

  btmImg: HTMLElement;

  search: HTMLElement;

  wrapper_filter: HTMLElement;

  constructor() {
    this.wrap_main = createComponent('div', ['catalog'], {});
    this.wrapper_filter = createComponent('div', ['filter'], {});
    this.wrapper_Catalog = createComponent('div', ['wrapper_catalog'], {});
    this.searchName = createComponent('input', ['select_search'], {});
    this.search_wrapper = createComponent('div', ['wrapper_searchs'], {});
    this.btnSech = createComponent('button', ['btn_search'], {});
    this.btmImg = createComponent('img', [], {});
    this.search = new Filter(this.wrapper_Catalog, this.searchName).getFilter();
    this.renderSeatch();
    this.renderCatalog();
    this.addListnerScroll();
  }

  renderSeatch() {
    this.wrapper_filter.append(this.search_wrapper);
    this.search_wrapper.append(this.searchName, this.btnSech);
    (this.btmImg as HTMLImageElement).src = vector;
    this.btnSech.append(this.btmImg);
    this.wrap_main.append(this.wrapper_filter);
    this.addListenerBtn();
    this.wrap_main.append(this.search);
  }

  renderCatalog() {
    const response = getAllProduct(0);
    response.then((data) => {
      addCard(data, this.wrapper_Catalog, true);
    });
    this.wrap_main.append(this.wrapper_Catalog);
  }

  getCatalog() {
    return this.wrap_main;
  }

  addListenerBtn() {
    this.btnSech.addEventListener('click', () => {
      const { value } = this.searchName as HTMLInputElement;
      if (value.trim() === ``) return;
      const response = getgetProdByName(value);
      response
        .then((data) => {
          addCard(data, this.wrapper_Catalog, true);
        })
        .catch((err) => {
          createModal(err.body.message);
        });
    });
  }

  addListnerScroll() {
    window.onscroll = null;
    let index = 0;
    window.onscroll = () => {
      const { scrollHeight, clientHeight, scrollTop } =
        document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight) {
        index += 10;
        const response = getAllProduct(index);
        response.then((data) => {
          if (data.results.length === 0) {
            window.onscroll = null;
          } else {
            addCard(data, this.wrapper_Catalog, false);
          }
        });
      }
    };
  }
}
