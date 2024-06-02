import createComponent from '../components';
import './cardProduct.scss';

const CLASS = {
  wrapper: ['wrapper_card'],
  image: ['img_card'],
  title: ['title_card'],
  description: ['description_card'],
  price: ['price'],
};

export default class Card {
  private image: HTMLElement;

  private wrapper_Card: HTMLElement;

  private title: HTMLElement;

  private description: HTMLElement;

  price: HTMLElement;

  discount: HTMLElement;

  constructor(
    urlImg: string,
    title: string,
    description: string,
    price: string,
    discount?: string,
  ) {
    this.wrapper_Card = createComponent('div', CLASS.wrapper, {});
    this.image = createComponent('img', CLASS.image, {
      src: urlImg,
      alt: 'catalogImg',
    }) as HTMLImageElement;
    this.title = createComponent('h2', CLASS.title, {});
    this.description = createComponent('p', CLASS.description, {});
    this.price = createComponent('p', CLASS.price, {});
    this.discount = createComponent('p', CLASS.price, {});
    this.render(title, description, price, discount);
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
  }

  getCard() {
    return this.wrapper_Card;
  }
}
