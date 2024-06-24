/* eslint-disable no-unused-vars */
import 'font-awesome/css/font-awesome.min.css';
import './cart.scss';
import createComponent from '@/components/components';
import { LineItem, CartUpdateAction } from '@commercetools/platform-sdk';
import { getCart, isLog } from '@/components/servercomp/servercomp';
import { apiRoot } from '@/sdk/builder';
import showModal from '../../components/modal/modal';
import emptyCartImg from '../../../public/files/empty-cart.png';
import binImg from '../../../public/files/bin.png';

type ConcurrentModificationError = {
  body: {
    errors: {
      code: string;
    }[];
  };
  message?: string;
};

export default class Cart {
  wrap_main: HTMLElement;

  wrapper_cart: HTMLElement;

  constructor() {
    this.wrap_main = createComponent('div', ['cart'], {});
    this.wrapper_cart = createComponent('div', ['wrapper_cart'], {});

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
    this.addCartSection('totalCost', '');
    this.addClearCartButton('Clear Cart');
    this.addToCatalogButton('To Catalog');
    Cart.fetchAndDisplayCartItems();
  }

  static renderCartItem(container: HTMLElement, item: LineItem) {
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
    const quantityElement = createComponent('input', ['item-quantity'], {
      type: 'number',
      min: '1',
      value: item.quantity.toString(),
    }) as HTMLInputElement;
    quantityElement.addEventListener('change', async (event) => {
      const newQuantity = parseInt(
        (event.target as HTMLInputElement).value,
        10,
      );
      if (newQuantity > 0) {
        await Cart.updateCartItemQuantity(item.id, newQuantity, item);
      }
    });

    const btnDelete = createComponent('button', ['delete-icon'], {});
    btnDelete.addEventListener('click', async () => {
      const success = await Cart.removeCartItem(item.id);
      if (success) {
        while (container.firstChild) {
          container.removeChild(container.firstChild);
        }
        Cart.fetchAndDisplayCartItems();

        const event = new CustomEvent('buttonClickedDell', {
          detail: { key: item.name['en-US'] },
        });
        document.dispatchEvent(event);
      }
    });

    const deleteIcon = document.createElement('img');
    deleteIcon.src = binImg;
    deleteIcon.alt = 'Delete Item';
    deleteIcon.classList.add('delete-icon-image');

    btnDelete.append(deleteIcon);

    const imageContainer = createComponent('div', ['image-container'], {});
    const imageElement = createComponent('img', ['item-image'], {
      alt: 'Product Image',
    }) as HTMLImageElement;
    if (item.variant.images && item.variant.images.length > 0) {
      imageElement.src = item.variant.images[0].url;
    }
    imageContainer.append(imageElement);
    imageContainer.append(btnDelete);

    quantityContainer.append(quantityLabel, quantityElement);

    const priceElement = createComponent('p', ['item-price'], {});
    priceElement.dataset.itemId = item.id;

    Cart.updatePriceElement(priceElement, item);
    Cart.updateTotalCost();

    productInfo.append(
      imageContainer,
      productName,
      quantityContainer,
      priceElement,
    );

    cartItem.append(productInfo);
    container.append(cartItem);
  }

  static async fetchCartData() {
    try {
      const logResult = await isLog();
      if (!logResult || !logResult.value) {
        throw new Error('User not logged in');
      }

      const { value, anon, token } = logResult;
      const cartData = await getCart(value, anon, token);
      return cartData;
    } catch (error) {
      return null;
    }
  }

  static async updateTotalCost() {
    const cartData = await Cart.fetchCartData();
    if (!cartData) {
      return;
    }

    const cartItems = cartData.body.lineItems;
    let totalCost = 0;

    cartItems.forEach((item) => {
      if (item.price.discounted && item.price.discounted.value) {
        totalCost +=
          (item.price.discounted.value.centAmount / 100) * item.quantity;
      } else {
        totalCost += (item.price.value.centAmount / 100) * item.quantity;
      }
    });

    const totalCostElement = document.querySelector(
      '.total-cost',
    ) as HTMLElement;
    if (totalCostElement) {
      totalCostElement.textContent = `Total Cost: ${totalCost.toFixed(2)} USD`;
    }
  }

  static updatePriceElement(priceElement: HTMLElement, item: LineItem) {
    let priceContent = '';
    if (item.price.discounted && item.price.discounted.value) {
      const regularPrice = item.price.value.centAmount / 100;
      const discountedPrice = item.price.discounted.value.centAmount / 100;
      const totalCost = (discountedPrice * item.quantity).toFixed(2);

      priceContent = `Price: <del style="color: rgb(251, 46, 134);">${regularPrice} ${item.price.value.currencyCode}</del> ${discountedPrice} ${item.price.value.currencyCode} (Total: ${totalCost} ${item.price.value.currencyCode})`;
    } else {
      const totalCost = (
        (item.price.value.centAmount * item.quantity) /
        100
      ).toFixed(2);
      priceContent = `Price: ${item.price.value.centAmount / 100} ${item.price.value.currencyCode} (Total: ${totalCost} ${item.price.value.currencyCode})`;
    }
    const localPriceElement = priceElement;
    localPriceElement.innerHTML = priceContent;
  }

  static async fetchAndDisplayCartItems() {
    const logResult = await isLog();
    if (!logResult) {
      return;
    }

    const { value, anon, token } = logResult;

    const cartData = await getCart(value, anon, token);
    if (!cartData) {
      return;
    }

    const cartItemsContainer = document.querySelector(
      '.cart-container',
    ) as HTMLElement;
    if (!cartItemsContainer) {
      return;
    }

    cartItemsContainer.innerHTML = '';

    const cartItems = cartData.body.lineItems;
    if (cartItems.length === 0) {
      cartItemsContainer.innerHTML = '<p>Your cart is currently empty</p>';
      const imgElement = createComponent('img', ['empty-cart-img'], {
        src: emptyCartImg,
        alt: 'Empty cart image',
      });
      cartItemsContainer.append(imgElement);
      return;
    }

    cartItems.forEach((item) => Cart.renderCartItem(cartItemsContainer, item));
  }

  static async removeCartItem(itemId: string): Promise<boolean> {
    try {
      const logResult = await isLog();
      if (!logResult || !logResult.value) {
        throw new Error('User not logged in');
      }

      const { value, anon, token } = logResult;
      const cartData = await getCart(value, anon, token);
      if (!cartData || !cartData.body || !cartData.body.id) {
        throw new Error('Cart data not found');
      }

      const cartId = cartData.body.id;
      const cartVersion = cartData.body.version;

      const updateActions: CartUpdateAction[] = [
        {
          action: 'removeLineItem',
          lineItemId: itemId,
        },
      ];

      await apiRoot
        .carts()
        .withId({ ID: cartId })
        .post({
          body: {
            version: cartVersion,
            actions: updateActions,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .execute();

      const cartUpdatedEvent = new CustomEvent('cart-updated');
      document.dispatchEvent(cartUpdatedEvent);

      await Cart.updateTotalCost();

      return true;
    } catch (error) {
      return false;
    }
  }

  static async removeAllCartItems(): Promise<boolean> {
    try {
      const logResult = await isLog();
      if (!logResult || !logResult.value) {
        throw new Error('User not logged in');
      }

      const { value, anon, token } = logResult;
      const cartData = await getCart(value, anon, token);
      if (!cartData || !cartData.body || !cartData.body.id) {
        throw new Error('Cart data not found');
      }

      const cartId = cartData.body.id;
      const cartVersion = cartData.body.version;

      const names = cartData.body.lineItems.map((item) => item.name['en-US']);

      for (let i = 0; i < names.length; i += 1) {
        const event = new CustomEvent('buttonClickedDell', {
          detail: { key: names[i] },
        });
        document.dispatchEvent(event);
      }

      const updateActions: CartUpdateAction[] = cartData.body.lineItems.map(
        (item: LineItem) => ({
          action: 'removeLineItem',
          lineItemId: item.id,
        }),
      );

      const updateCartItems = async (version: number): Promise<boolean> => {
        try {
          const response = await apiRoot
            .carts()
            .withId({ ID: cartId })
            .post({
              body: {
                version,
                actions: updateActions,
              },
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .execute();

          const cartUpdatedEvent = new CustomEvent('cart-updated');
          document.dispatchEvent(cartUpdatedEvent);

          await Cart.updateTotalCost();

          return true;
        } catch (error) {
          const err = error as ConcurrentModificationError;
          if (
            err.body &&
            err.body.errors &&
            err.body.errors[0].code === 'ConcurrentModification'
          ) {
            const latestCartResponse = await apiRoot
              .carts()
              .withId({ ID: cartId })
              .get()
              .execute();

            return updateCartItems(latestCartResponse.body.version);
          }
          throw error;
        }
      };

      return await updateCartItems(cartVersion);
    } catch (error) {
      return false;
    }
  }

  static async updateCartItemQuantity(
    itemId: string,
    newQuantity: number,
    item: LineItem,
  ) {
    try {
      const logResult = await isLog();
      if (!logResult || !logResult.value) {
        throw new Error('User not logged in');
      }

      const { value, anon, token } = logResult;
      const cartData = await getCart(value, anon, token);
      if (!cartData || !cartData.body || !cartData.body.id) {
        throw new Error('Cart data not found');
      }

      const cartId = cartData.body.id;

      const updateCartQuantity = async (cartVersion: number) => {
        try {
          await apiRoot
            .carts()
            .withId({ ID: cartId })
            .post({
              body: {
                version: cartVersion,
                actions: [
                  {
                    action: 'changeLineItemQuantity',
                    lineItemId: itemId,
                    quantity: newQuantity,
                  },
                ],
              },
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .execute();

          const cartUpdatedEvent = new CustomEvent('cart-updated');
          document.dispatchEvent(cartUpdatedEvent);

          const priceElement = document.querySelector(
            `[data-item-id="${itemId}"]`,
          ) as HTMLElement;
          if (priceElement) {
            const updatedItem = { ...item, quantity: newQuantity };
            Cart.updatePriceElement(priceElement, updatedItem);
          }
        } catch (error) {
          const err = error as ConcurrentModificationError;
          if (
            err.body &&
            err.body.errors &&
            err.body.errors[0].code === 'ConcurrentModification'
          ) {
            const latestCartResponse = await apiRoot
              .carts()
              .withId({ ID: cartId })
              .get()
              .execute();

            await updateCartQuantity(latestCartResponse.body.version);
          } else {
            let errorMessage = 'An unexpected error occurred';
            if (err.message) {
              errorMessage = err.message;
            }
            showModal(errorMessage);
          }
        }
      };

      await updateCartQuantity(cartData.body.version);

      await Cart.updateTotalCost();
    } catch (error) {
      const err = error as { message?: string };
      let errorMessage = 'An unexpected error occurred';
      if (err.message) {
        errorMessage = err.message;
      }
      showModal(errorMessage);
    }
  }

  addCartSection(
    type: 'title' | 'emptyContent' | 'content' | 'totalCost',
    text: string,
  ) {
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
      case 'totalCost': {
        const totalCostElement = createComponent('div', ['total-cost'], {});
        this.wrapper_cart.append(totalCostElement);
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

  addClearCartButton(buttonText: string) {
    const buttonElement = createComponent('button', ['btn-clear-cart'], {});
    buttonElement.textContent = buttonText;
    this.wrapper_cart.append(buttonElement);

    buttonElement.addEventListener('click', async (event) => {
      event.preventDefault();
      const success = await Cart.removeAllCartItems();
      if (success) {
        const cartItemsContainer = document.querySelector(
          '.cart-container',
        ) as HTMLElement;
        cartItemsContainer.innerHTML = '';
        Cart.fetchAndDisplayCartItems();
      } else {
        showModal('Failed to clear the cart. Please try again.');
      }
    });
  }

  getWrap() {
    return this.wrap_main;
  }
}
