import createComponent from '@/components/components';
import { getProd } from '@/components/servercomp/servercomp';
import './product.scss';

const CLASS = {
  wrapper: ['page-prod'],
  container: ['info-prod'],
  image: ['img-prod'],
  title: ['title-prod'],
  price: ['price-prod'],
  description: ['description-prod'],
};

export default class Product {
  pageProd: HTMLElement;

  infoContainer: HTMLElement;

  image: HTMLImageElement;

  title: HTMLElement;

  price: HTMLElement;

  description: HTMLElement;

  constructor(
    key: string,
    urlImg: string = '',
    title: string = '',
    price: string = '',
    description: string = '',
  ) {
    this.pageProd = createComponent('div', CLASS.wrapper, {});
    this.infoContainer = createComponent('div', CLASS.container, {});
    this.image = createComponent('img', CLASS.image, {
      src: urlImg,
      alt: 'Product image',
    }) as HTMLImageElement;
    this.title = createComponent('h2', CLASS.title, {});
    this.price = createComponent('div', CLASS.price, {});
    this.description = createComponent('p', CLASS.description, {});
    this.createProductPage(title, price, description);
    this.renderProduct(key);
  }

  createProductPage(title: string, price: string, description: string) {
    this.title.innerText = title;
    this.price.innerText = `$${price}`;
    this.description.innerText = description;
    this.pageProd.append(this.image, this.infoContainer);
    this.infoContainer.append(this.title, this.price, this.description);
  }

  async renderProduct(key: string) {
    const response = getProd(key);
    response.then((data) => {
      const product = data.masterData.current;
      const imgUrl = product.masterVariant.images![0].url;
      const title = product.name['en-US'];
      const price = product.masterVariant.prices![2].value.centAmount / 100;
      const { 'en-US': description } = product.description!;
      this.image.src = imgUrl;
      this.title.innerText = title;
      this.price.innerText = `$${price}`;
      this.description.innerText = description;
    });
  }

  getPage() {
    return this.pageProd;
  }

  getProd() {
    const centerElement = document.querySelector('.center');
    if (centerElement) {
      centerElement.appendChild(this.pageProd);
    }
  }
}