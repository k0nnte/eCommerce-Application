/* eslint-disable no-console */
import createComponent from '../components';
import './cardProduct.scss';
import { addProductCart, cartAll, isLog } from '../servercomp/servercomp';
import imgCart from '../../../public/files/cart.png';
import load from '../../../public/files/load.gif';
// eslint-disable-next-line import/order
import { LineItem } from '@commercetools/platform-sdk';

const text = 'Add to Cart';

const CLASS = {
  wrapper: ['wrapper_card'],
  image: ['img_card'],
  title: ['title_card'],
  description: ['description_card'],
  price: ['price'],
  btn: ['add-btn'],
  imgCart: ['img-cart'],
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

  imgCart: HTMLElement;

  load: HTMLElement;

  cart: Promise<LineItem[]>;

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
    this.imgCart = createComponent('img', CLASS.imgCart, {
      src: imgCart,
      alt: 'Cart',
    });
    this.cart = cartAll();
    this.render(title, description, price, discount);
    this.addListener();
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
    this.addBtn.append(this.imgCart);
    this.wrapper_Card.append(this.addBtn);
    this.addBtn.classList.add('btnOff');
    (this.addBtn as HTMLButtonElement).disabled = true;
    this.cart.then((data) => {
      if (!data.some((item) => item.productKey === this.key)) {
        this.addBtn.classList.remove('btnOff');
        (this.addBtn as HTMLButtonElement).disabled = false;
      }
    });
  }

  getCard() {
    return this.wrapper_Card;
  }

  addListener() {
    this.wrapper_Card.addEventListener('click', (event) => {
      if (event.target === this.addBtn) {
        const id = isLog();
        id.then((data) => {
          addProductCart(data.value, this.key, data.anon, data.token)
            .then(() => {
              this.addBtn.classList.add('btnOff');
              (this.addBtn as HTMLButtonElement).disabled = true;
            })
            .catch((err) => {
              console.log(err);
            });
        });
      } else {
        window.history.pushState({}, '', `/${this.key}`);
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
    });
  }
}
