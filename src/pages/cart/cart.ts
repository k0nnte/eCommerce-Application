/* eslint-disable no-console */
import './cart.scss';
import createComponent from '@/components/components';
import { LineItem } from '@commercetools/platform-sdk';
import { getCartId } from '@/components/servercomp/servercomp';
import { apiRoot } from '@/sdk/builder';
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

    Cart.fetchAndDisplayCartItems();
    this.renderCart();
  }

  static renderCartItem(container: Element, item: LineItem) {
    const cartItem = createComponent('li', ['cart-item'], {});

    const imageElement = document.createElement('img');
    imageElement.alt = 'Product Image';
    imageElement.classList.add('item-image');

    const productName = document.createElement('p');
    productName.textContent = item.name['en-US'];

    const productInfo = document.createElement('div');
    productInfo.classList.add('product-info');

    const quantityElement = document.createElement('p');
    quantityElement.textContent = `Quantity: ${item.quantity}`;
    quantityElement.classList.add('item-quantity');

    const priceElement = document.createElement('p');
    priceElement.classList.add('item-price');

    if (item.price.discounted && item.price.discounted.value) {
      const regularPrice = item.price.value.centAmount / 100;
      const discountedPrice = item.price.discounted.value.centAmount / 100;
      const totalCost = (discountedPrice * item.quantity).toFixed(2); // Calculate total cost for all quantities

      priceElement.innerHTML = `Price: <del style="color: rgb(251, 46, 134);">${regularPrice} ${item.price.value.currencyCode}</del> ${discountedPrice} ${item.price.value.currencyCode} (Total: ${totalCost} ${item.price.value.currencyCode})`;
    } else {
      const totalCost = (
        (item.price.value.centAmount * item.quantity) /
        100
      ).toFixed(2); // Calculate total cost for all quantities
      priceElement.textContent = `Price: ${item.price.value.centAmount / 100} ${item.price.value.currencyCode} (Total: ${totalCost} ${item.price.value.currencyCode})`;
    }

    if (item.variant.images && item.variant.images.length > 0) {
      imageElement.src = item.variant.images[0].url;
    }

    productInfo.append(
      imageElement,
      productName,
      quantityElement,
      priceElement,
    );

    cartItem.append(productInfo);

    container.append(cartItem);
  }

  static async fetchAndDisplayCartItems() {
    const cartId = await getCartId();

    if (!cartId) {
      return;
    }

    const cartResponse = await apiRoot
      .carts()
      .withId({ ID: cartId })
      .get()
      .execute();

    const cartItemsContainer = document.querySelector('.cart-container');

    if (!cartItemsContainer) {
      return;
    }

    const cartItems = cartResponse.body.lineItems;

    if (cartItems.length === 0) {
      cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
      return;
    }

    cartItems.forEach((item) => Cart.renderCartItem(cartItemsContainer, item));
  }

  renderCart() {
    this.wrap_main.append(this.wrapper_cart);
    this.addCartTitle('Shopping Cart');
    this.addEmptyCartContent(
      'Your shopping cart is currently empty',
      'Continue shopping and add items to your cart',
    );
    this.addCartContent('Items in your cart:');
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

  addCartContent(text: string) {
    const emptyCartContainer = createComponent('div', ['cart-container'], {});
    const textElement = createComponent('span', ['empty-cart-text'], {});
    textElement.textContent = text;

    emptyCartContainer.append(textElement);
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
