/* eslint-disable no-unused-vars */
// /* eslint-disable no-console */
import { ClientResponse } from '@commercetools/importapi-sdk/dist/declarations/src/generated/shared/utils/common-types';
import createComponent from '../components';
import createModal from '../modal/modal';
import {
  addCard,
  getAllCategories,
  getAllProduct,
  sortByName,
  sortPriceHigh,
  sortPriceSmall,
} from '../servercomp/servercomp';
import './filter.scss';
// eslint-disable-next-line import/order
import { ProductProjectionPagedSearchResponse } from '@commercetools/platform-sdk';

const CLASS = {
  warper: ['wrapper_search'],
  input: ['input_search'],
  select: ['select'],
  btn: ['search_btn'],
  options: ['options'],
  wrasses: ['wrap_select'],
};

type Callback = (
  value: number,
  index: number,
) => Promise<ClientResponse<ProductProjectionPagedSearchResponse>>;

type CallbackNoValue = (
  index: number,
) => Promise<ClientResponse<ProductProjectionPagedSearchResponse>>;

const optionst = ['price is less', 'price is higher', 'by name'];

export default class Filter {
  search: HTMLElement;

  wrapper: HTMLElement;

  categories: HTMLElement;

  price: HTMLElement;

  btn: HTMLElement;

  select: HTMLElement;

  selectWrap: HTMLElement;

  selectOption: string;

  head: HTMLElement;

  btnReset: HTMLElement;

  header: HTMLElement;

  index: number;

  constructor(head: HTMLElement, header: HTMLElement) {
    this.header = header;
    this.head = head;
    this.index = 0;
    this.wrapper = createComponent('div', CLASS.warper, {});
    this.search = createComponent('input', CLASS.input, {});
    this.categories = createComponent('select', CLASS.select, {});
    this.price = createComponent('input', CLASS.input, {
      type: 'number',
    });
    this.select = createComponent('select', CLASS.select, {});
    this.selectWrap = createComponent('div', CLASS.wrasses, {});
    this.btn = createComponent('button', CLASS.btn, {});
    this.btnReset = createComponent('button', CLASS.btn, {});
    this.selectOption = optionst[0]!;
    this.render();
    this.createSelect();
    this.categoryAdd();
    this.addSelectListener();
    this.addBtnListner();
  }

  createSelect() {
    for (let i = 0; i < optionst.length; i += 1) {
      const options = createComponent(
        'option',
        CLASS.options,
        {},
      ) as HTMLOptionElement;

      options.innerText = optionst[i]!;
      this.select.append(options);
    }
  }

  categoryAdd() {
    const response = getAllCategories();
    response
      .then((data) => {
        for (let i = 0; i < data.length; i += 1) {
          const options = createComponent(
            'option',
            CLASS.options,
            {},
          ) as HTMLOptionElement;

          options.innerText = data[i]!;
          this.categories.append(options);
        }
      })
      .catch((err) => {
        createModal(`error ${err}`);
      });
  }

  render() {
    this.btn.innerText = 'Search';
    this.btnReset.innerText = `Reset`;
    this.selectWrap.append(this.price);
    this.wrapper.append(this.select, this.selectWrap, this.btn, this.btnReset);
  }

  addSelectListener() {
    this.select.addEventListener('change', (event) => {
      this.selectOption = (event.target as HTMLSelectElement).value;
      this.selectWrap.innerHTML = ``;
      switch (this.selectOption) {
        case `price is less`:
          (this.price as HTMLInputElement).value = ``;
          this.selectWrap.append(this.price);
          break;
        case `price is higher`:
          (this.price as HTMLInputElement).value = ``;
          this.selectWrap.append(this.price);
          break;
        case `by name`:
          break;
        default:
          (this.price as HTMLInputElement).value = ``;
          this.selectWrap.append(this.price);
          break;
      }
    });
  }

  addBtnListner() {
    this.btn.addEventListener('click', () => {
      if (this.selectOption === 'price is less') {
        const price = (this.price as HTMLInputElement).value;
        if (!price.match(/[0-9]/) || price.trim() === '') {
          (this.price as HTMLInputElement).setCustomValidity(
            'Please enter letters 0-9',
          );
          (this.price as HTMLInputElement).reportValidity();
        } else {
          (this.price as HTMLInputElement).setCustomValidity('');
          const response = sortPriceSmall(Number(price), 0);
          response.then((data) => {
            addCard(data, this.head, true);
            this.addListnerScroll(sortPriceSmall, Number(price));
          });
        }
      } else if (this.selectOption === 'price is higher') {
        const price = (this.price as HTMLInputElement).value;
        if (!price.match(/[0-9]/) || price.trim() === '') {
          (this.price as HTMLInputElement).setCustomValidity(
            'Please enter letters 0-9',
          );
          (this.price as HTMLInputElement).reportValidity();
        } else {
          (this.price as HTMLInputElement).setCustomValidity('');
          const response = sortPriceHigh(Number(price), 0);
          response.then((data) => {
            addCard(data, this.head, true);
            this.addListnerScroll(sortPriceHigh, Number(price));
          });
        }
      } else {
        const response = sortByName(0);
        response.then((data) => {
          addCard(data, this.head, true);
          this.addListrerNoValue(sortByName);
        });
      }
    });
    this.btnReset.addEventListener('click', () => {
      const response = getAllProduct(0);
      (this.header as HTMLInputElement).value = ``;
      (this.price as HTMLInputElement).value = ``;
      response.then((data) => {
        addCard(data, this.head, true);
        this.addListnerScrollReset();
      });
    });
  }

  getFilter() {
    return this.wrapper;
  }

  addListnerScrollReset() {
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
            addCard(data, this.head, false);
          }
        });
      }
    };
  }

  addListnerScroll(callback: Callback, value: number) {
    window.onscroll = null;
    let index = 0;
    window.onscroll = () => {
      const { scrollHeight, clientHeight, scrollTop } =
        document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight) {
        index += 10;

        const response = callback(value, index);
        response.then((data) => {
          if (data.body.results.length === 0) {
            window.onscroll = null;
          } else {
            addCard(data, this.head, false);
          }
        });
      }
    };
  }

  addListrerNoValue(callback: CallbackNoValue) {
    window.onscroll = null;
    let index = 0;
    window.onscroll = () => {
      const { scrollHeight, clientHeight, scrollTop } =
        document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight) {
        index += 10;

        const response = callback(index);
        response.then((data) => {
          if (data.body.results.length === 0) {
            window.onscroll = null;
          } else {
            addCard(data, this.head, false);
          }
        });
      }
    };
  }
}
