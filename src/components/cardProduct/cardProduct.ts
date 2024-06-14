/* eslint-disable no-console */
import createComponent from '../components';
import './cardProduct.scss';
import { addProductBasket, isLog } from '../servercomp/servercomp';
import load from '../../../public/files/load.gif';

const text = 'Add to basket';

const CLASS = {
  wrapper: ['wrapper_card'],
  image: ['img_card'],
  title: ['title_card'],
  description: ['description_card'],
  price: ['price'],
  btn: ['addBtn'],
  gif: ['gif'],
};

export default class Card {
  private image: HTMLElement;

  private wrapper_Card: HTMLElement;

  private title: HTMLElement;

  private description: HTMLElement;

  price: HTMLElement;

  discount: HTMLElement;

  key: string;

  addBtn: HTMLElement;

  load: HTMLElement;

  constructor(
    urlImg: string,
    title: string,
    description: string,
    price: string,
    key: string,
    discount?: string,
  ) {
    this.key = key;
    this.wrapper_Card = createComponent('div', CLASS.wrapper, {});
    this.image = createComponent('img', CLASS.image, {
      src: urlImg,
      alt: 'catalogImg',
    }) as HTMLImageElement;
    this.load = createComponent('img', CLASS.gif, {
      scr: load,
      alt: 'loading',
    });
    this.title = createComponent('h2', CLASS.title, {});
    this.description = createComponent('p', CLASS.description, {});
    this.price = createComponent('p', CLASS.price, {});
    this.discount = createComponent('p', CLASS.price, {});
    this.addBtn = createComponent('button', CLASS.btn, {});

    this.render(title, description, price, discount);
    this.addListner();
  }

  private render(
    title: string,
    description: string,
    price: string,
    discount?: string,
  ) {
    this.title.innerText = title;
    this.description.innerText = description;
    this.price.innerText = price;

    this.wrapper_Card.append(
      this.image,
      this.title,
      this.description,
      this.price,
    );
    if (discount !== 'undefined undefined') {
      this.price.classList.add('discount');
      this.discount.innerText = discount as string;
      this.wrapper_Card.append(this.discount);
    }
    this.addBtn.innerText = text;
    this.wrapper_Card.append(this.addBtn);
  }

  getCard() {
    return this.wrapper_Card;
  }

  addListner() {
    this.wrapper_Card.addEventListener('click', (event) => {
      if (event.target === this.addBtn) {
        const id = isLog();
        this.addBtn.innerText = '';
        this.addBtn.append(this.load);
        id.then((data) => {
          addProductBasket(data.value, this.key, data.anon, data.token).then(
            () => {
              this.addBtn.innerText = text;
            },
          );
        });
      } else {
        window.history.pushState({}, '', `/${this.key}`);
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
    });
  }
}
