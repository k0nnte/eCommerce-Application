import Cart from './cart';

describe('Cart component', () => {
  let cart: Cart;

  beforeEach(() => {
    cart = new Cart();
    document.body.appendChild(cart.getWrap());
  });

  afterEach(() => {
    if (cart && cart.getWrap()) {
      document.body.removeChild(cart.getWrap());
    }
  });

  it('should render the cart title correctly', () => {
    expect(document.querySelector('.cart-title')?.textContent).toBe(
      'Shopping Cart',
    );
  });

  it('should add empty cart content with a link', () => {
    expect(document.querySelector('.empty-cart-text')).not.toBeNull();
    expect(document.querySelector('.empty-cart-link')).not.toBeNull();
  });

  it('should navigate to catalog when link is clicked', () => {
    const emptyCartLinkElement = document.querySelector(
      '.empty-cart-link',
    ) as HTMLElement;
    emptyCartLinkElement.click();
    expect(window.location.pathname).toBe('/catalog');
  });
});
