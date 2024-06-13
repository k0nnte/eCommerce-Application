// /* eslint-disable no-console */
import './cart.scss';
import createComponent from '@/components/components';
import emptyCartImg from '../../../public/files/empty-cart.png';

export default class Cart {
  wrap_main: HTMLElement;

  wrapper_cart: HTMLElement;

  image: HTMLElement;

  constructor() {
    this.wrap_main = createComponent('div', ['cart'], {});
    this.wrapper_cart = createComponent('div', ['wrapper_cart'], {});
    this.image = createComponent('img', ['empty-cart-img'], {
      src: emptyCartImg,
      alt: 'Empty cart image',
    });
    this.renderCart();
  }

  renderCart() {
    this.wrap_main.append(this.wrapper_cart);
    this.addCartTitle('Shopping Cart');
    this.addEmptyCartContent(
      'Your shopping cart is currently empty',
      'Continue shopping and add items to your cart',
    );
    this.addToCatalogButton('To Catalog');
  }

  addCartTitle(text: string) {
    const textElement = createComponent('span', ['cart-title'], {});
    textElement.textContent = text;
    this.wrapper_cart.append(textElement);
  }

  addEmptyCartContent(text: string, link: string) {
    const emptyCartContainer = createComponent(
      'div',
      ['empty-cart-container'],
      {},
    );
    const textElement = createComponent('span', ['empty-cart-text'], {});
    textElement.textContent = text;

    const linkElement = createComponent('a', ['empty-cart-link'], {});
    linkElement.textContent = link;
    this.wrapper_cart.append(linkElement);

    if (linkElement) {
      linkElement.addEventListener('click', (event) => {
        event.preventDefault();
        window.history.pushState({}, '', '/catalog');
        window.dispatchEvent(new PopStateEvent('popstate'));
      });
    }

    emptyCartContainer.append(textElement, linkElement, this.image);
    this.wrapper_cart.append(emptyCartContainer);
  }

  addToCatalogButton(buttonText: string) {
    const buttonElement = createComponent('button', ['btn-catalog'], {});
    buttonElement.textContent = buttonText;
    this.wrapper_cart.append(buttonElement);

    if (buttonElement) {
      buttonElement.addEventListener('click', (event) => {
        event.preventDefault();
        window.history.pushState({}, '', '/catalog');
        window.dispatchEvent(new PopStateEvent('popstate'));
      });
    }
  }

  getWrap() {
    return this.wrap_main;
  }
}
