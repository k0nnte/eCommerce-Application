/* eslint-disable no-console */
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

const CLASS = {
  warper: ['wrapper_search'],
  input: ['input_search'],
  select: ['select'],
  btn: ['search_btn'],
  options: ['options'],
  wrasses: ['wrap_select'],
};

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

  constructor(head: HTMLElement, header: HTMLElement) {
    this.header = header;
    this.head = head;
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
          const response = sortPriceSmall(Number(price));
          response.then((data) => {
            addCard(data, this.head);
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
          const response = sortPriceHigh(Number(price));
          response.then((data) => {
            addCard(data, this.head);
          });
        }
      } else {
        const response = sortByName();
        response.then((data) => {
          addCard(data, this.head);
        });
      }
    });
    this.btnReset.addEventListener('click', () => {
      const response = getAllProduct();
      (this.header as HTMLInputElement).value = ``;
      (this.price as HTMLInputElement).value = ``;
      response.then((data) => {
        addCard(data, this.head);
      });
    });
  }

  getFilter() {
    return this.wrapper;
  }
}
