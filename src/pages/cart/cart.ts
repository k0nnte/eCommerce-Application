/* eslint-disable no-console */
import 'font-awesome/css/font-awesome.min.css';
import './cart.scss';
import createComponent from '@/components/components';
import { LineItem } from '@commercetools/platform-sdk';
import { getCartId } from '@/components/servercomp/servercomp';
import { apiRoot } from '@/sdk/builder';
import emptyCartImg from '../../../public/files/empty-cart.png';
import binImg from '../../../public/files/bin.png';

export default class Cart {
  wrap_main: HTMLElement;

  wrapper_cart: HTMLElement;

  constructor() {
    this.wrap_main = createComponent('div', ['cart'], {});
    this.wrapper_cart = createComponent('div', ['wrapper_cart'], {});

    Cart.fetchAndDisplayCartItems();
    this.renderCart();
  }

  renderCart() {
    this.wrap_main.append(this.wrapper_cart);
    this.addCartSection('title', 'Shopping Cart');
    this.addCartSection(
      'emptyContent',
      'Continue shopping and add items to your cart',
    );
    this.addCartSection('content', '');
    this.addToCatalogButton('To Catalog');
  }

  static renderCartItem(container: Element, item: LineItem) {
    const cartItem = createComponent('li', ['cart-item'], {});
    const productName = createComponent('p', ['item-name'], {});
    productName.textContent = item.name['en-US'];
    const productInfo = createComponent('div', ['product-info'], {});
    const quantityContainer = createComponent(
      'div',
      ['quantity-container'],
      {},
    );
    const quantityLabel = createComponent('span', ['quantity-label'], {});
    quantityLabel.textContent = 'Qty: ';

    const quantityElement = document.createElement('input');
    quantityElement.type = 'number';
    quantityElement.min = '1';
    quantityElement.value = item.quantity.toString();
    quantityElement.classList.add('item-quantity');

    const btnDelete = createComponent('button', ['delete-icon'], {});
    btnDelete.addEventListener('click', async () => {});

    const deleteIcon = document.createElement('img');
    deleteIcon.src = binImg;
    deleteIcon.alt = 'Delete Item';
    deleteIcon.classList.add('delete-icon-image');

    btnDelete.appendChild(deleteIcon);

    const imageContainer = createComponent('div', ['image-container'], {});
    const imageElement = createComponent('img', ['item-image'], {
      alt: 'Product Image',
    }) as HTMLImageElement;
    if (item.variant.images && item.variant.images.length > 0) {
      imageElement.src = item.variant.images[0].url;
    }
    imageContainer.appendChild(imageElement);
    imageContainer.appendChild(btnDelete);

    quantityContainer.append(quantityLabel, quantityElement);

    const priceElement = createComponent('p', ['item-price'], {});

    if (item.price.discounted && item.price.discounted.value) {
      const regularPrice = item.price.value.centAmount / 100;
      const discountedPrice = item.price.discounted.value.centAmount / 100;
      const totalCost = (discountedPrice * item.quantity).toFixed(2);

      priceElement.innerHTML = `Price: <del style="color: rgb(251, 46, 134);">${regularPrice} ${item.price.value.currencyCode}</del> ${discountedPrice} ${item.price.value.currencyCode} (Total: ${totalCost} ${item.price.value.currencyCode})`;
    } else {
      const totalCost = (
        (item.price.value.centAmount * item.quantity) /
        100
      ).toFixed(2);
      priceElement.textContent = `Price: ${item.price.value.centAmount / 100} ${item.price.value.currencyCode} (Total: ${totalCost} ${item.price.value.currencyCode})`;
    }

    if (item.variant.images && item.variant.images.length > 0) {
      imageElement.src = item.variant.images[0].url;
    }

    productInfo.append(
      imageContainer,
      productName,
      quantityContainer,
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
      cartItemsContainer.innerHTML = '<p>Your cart is currently empty</p>';
      const imgElement = createComponent('img', ['empty-cart-img'], {
        src: emptyCartImg,
        alt: 'Empty cart image',
      });
      cartItemsContainer.appendChild(imgElement);
      return;
    }
    cartItems.forEach((item) => Cart.renderCartItem(cartItemsContainer, item));
  }

  addCartSection(type: 'title' | 'emptyContent' | 'content', text: string) {
    switch (type) {
      case 'title': {
        const titleElement = createComponent('span', ['cart-title'], {});
        titleElement.textContent = text;
        this.wrapper_cart.append(titleElement);
        break;
      }
      case 'emptyContent': {
        const emptyCartContainer = createComponent(
          'div',
          ['empty-cart-container'],
          {},
        );
        const linkElement = createComponent('a', ['empty-cart-link'], {});
        linkElement.textContent = text;
        this.wrapper_cart.append(linkElement);
        linkElement.addEventListener('click', (event) => {
          event.preventDefault();
          window.history.pushState({}, '', '/catalog');
          window.dispatchEvent(new PopStateEvent('popstate'));
        });
        emptyCartContainer.append(linkElement);
        this.wrapper_cart.append(emptyCartContainer);
        break;
      }
      case 'content': {
        const cartContainer = createComponent('div', ['cart-container'], {});
        const textElement = createComponent('span', ['empty-cart-text'], {});
        textElement.textContent = text;
        cartContainer.append(textElement);
        this.wrapper_cart.append(cartContainer);
        break;
      }
      default:
        throw new Error('Invalid section type');
    }
  }

  addToCatalogButton(buttonText: string) {
    const buttonElement = createComponent('button', ['btn-catalog'], {});
    buttonElement.textContent = buttonText;
    this.wrapper_cart.append(buttonElement);

    buttonElement.addEventListener('click', (event) => {
      event.preventDefault();
      window.history.pushState({}, '', '/catalog');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
  }

  getWrap() {
    return this.wrap_main;
  }
}
