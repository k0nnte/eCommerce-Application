import createComponent from '../components';
import './cardProduct.scss';

const CLASS = {
  wrapper: ['wrapper_card'],
  image: ['img_card'],
  zag: ['zagolov_card'],
  description: ['description_card'],
  price: ['price'],
};

export default class Card {
  private image: HTMLElement;

  private wrapper_Card: HTMLElement;

  private zag: HTMLElement;

  private description: HTMLElement;

  price: HTMLElement;

  discount: HTMLElement;

  constructor(
    urlImg: string,
    zag: string,
    description: string,
    price: string,
    discount?: string,
  ) {
    this.wrapper_Card = createComponent('div', CLASS.wrapper, {});
    this.image = createComponent('img', CLASS.image, {
      src: urlImg,
      alt: 'catalogImg',
    }) as HTMLImageElement;
    this.zag = createComponent('h2', CLASS.zag, {});
    this.description = createComponent('p', CLASS.description, {});
    this.price = createComponent('p', CLASS.price, {});
    this.discount = createComponent('p', CLASS.price, {});
    this.render(zag, description, price, discount);
  }

  private render(
    zag: string,
    description: string,
    price: string,
    discount?: string,
  ) {
    this.zag.innerText = zag;
    this.description.innerText = description;
    this.price.innerText = price;
    this.wrapper_Card.append(
      this.image,
      this.zag,
      this.description,
      this.price,
    );
    if (discount !== 'undefined undefined') {
      this.price.classList.add('discount');
      this.discount.innerText = discount as string;
      this.wrapper_Card.append(this.discount);
    }
  }

  getCard() {
    return this.wrapper_Card;
  }
}
