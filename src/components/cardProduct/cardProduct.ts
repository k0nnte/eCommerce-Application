import createComponent from '../components';
import './cardProduct.scss';

const CLASS = {
  wrapper: ['wrapper_card'],
  image: ['img_card'],
  zag: ['zagolov_card'],
  description: ['description_card'],
};

export default class Card {
  private image: HTMLElement;

  private wrapper_Card: HTMLElement;

  private zag: HTMLElement;

  private description: HTMLElement;

  constructor(urlImg: string, zag: string, description: string) {
    this.wrapper_Card = createComponent('div', CLASS.wrapper, {});
    this.image = createComponent('img', CLASS.image, {
      src: urlImg,
      alt: 'catalogImg',
    }) as HTMLImageElement;
    this.zag = createComponent('h2', CLASS.zag, {});
    this.description = createComponent('p', CLASS.description, {});
    this.render(zag, description);
  }

  private render(zag: string, description: string) {
    this.zag.innerText = zag;
    this.description.innerText = description;
    this.wrapper_Card.append(this.image, this.zag, this.description);
  }

  getCard() {
    return this.wrapper_Card;
  }
}
