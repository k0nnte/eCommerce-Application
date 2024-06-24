import createComponent from '@/components/components';
import {
  addProductCart,
  cartAll,
  getProd,
  isLog,
  removeItem,
} from '@/components/servercomp/servercomp';
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/scss';
import 'swiper/scss/navigation';
import 'swiper/scss/pagination';
import './product.scss';
import { LineItem } from '@commercetools/platform-sdk';
import createModal from '@/components/modal/modal';
import Header from '@/components/header/header';
import imgCart from '../../../public/files/cart.png';
import load from '../../../public/files/load.gif';

const text = 'Add to Cart';

const CLASS = {
  wrapper: ['page-prod'],
  container: ['info-prod'],
  image: ['img-prod'],
  title: ['title-prod'],
  priceBox: ['price-box'],
  discountPrice: ['price-prod', 'discount-price'],
  price: ['price-prod', 'start-price'],
  description: ['description-prod'],
  btnCart: ['btn-cart-product'],
  imgCart: ['img-cart'],
  gif: ['gif'],
};

export default class Product {
  pageProd: HTMLElement;

  infoContainer: HTMLElement;

  title: HTMLElement;

  priceBox: HTMLElement;

  discountPrice: HTMLElement;

  price: HTMLElement;

  description: HTMLElement;

  swiperContainer: HTMLElement;

  currentModal: HTMLElement | null = null;

  btnCart: HTMLElement;

  imgCart: HTMLElement;

  key: string;

  load: HTMLElement;

  cart: Promise<LineItem[]>;

  isCard: boolean;

  constructor(
    key: string,
    title: string = '',
    discountPrice: string = '',
    price: string = '',
    description: string = '',
  ) {
    this.pageProd = createComponent('div', CLASS.wrapper, {});
    this.infoContainer = createComponent('div', CLASS.container, {});
    this.title = createComponent('h2', CLASS.title, {});
    this.priceBox = createComponent('div', CLASS.priceBox, {});
    this.discountPrice = createComponent('div', CLASS.discountPrice, {});
    this.price = createComponent('div', CLASS.price, {});
    this.description = createComponent('p', CLASS.description, {});
    this.swiperContainer = createComponent('div', ['swiper-container'], {});
    this.btnCart = createComponent('button', CLASS.btnCart, {});
    this.imgCart = createComponent('img', CLASS.imgCart, {
      src: imgCart,
      alt: 'Cart',
    });
    this.isCard = false;
    this.load = createComponent('img', CLASS.gif, {
      src: load,
      alt: 'loading',
    });
    this.key = key;
    this.cart = cartAll();

    this.createProductPage(title, discountPrice, price, description);
    this.renderProduct(key);

    this.addListenerBtn();
  }

  createProductPage(
    title: string,
    discountPrice: string,
    price: string,
    description: string,
  ) {
    this.title.innerText = title;
    this.discountPrice.innerText = `$${discountPrice}`;
    this.price.innerText = `$${price}`;
    this.description.innerText = description;
    this.pageProd.append(this.swiperContainer, this.infoContainer);
    this.btnCart.innerText = text;
    this.btnCart.append(this.imgCart);
    this.infoContainer.append(
      this.title,
      this.priceBox,
      this.description,
      this.btnCart,
    );
    this.priceBox.append(this.discountPrice, this.price);

    this.cart.then((data) => {
      if (data.some((item) => item.productKey === this.key)) {
        this.btnCart.textContent = 'Remove from Cart';
        this.btnCart.append(this.imgCart);
        this.isCard = true;
      }
    });
    this.addListenerBtn();
  }

  async renderProduct(key: string) {
    try {
      const response = await getProd(key);
      const product = response.masterData.current;
      const { images = [] } = product.masterVariant;
      const title = product.name['en-US'];
      let discountPrice: number | undefined;
      if (product.masterVariant.prices && product.masterVariant.prices[2]) {
        const discountedValue =
          product.masterVariant.prices[2].discounted?.value.centAmount;
        if (typeof discountedValue === 'number') {
          discountPrice = discountedValue / 100;
        }
      }

      const price = product.masterVariant.prices![2].value.centAmount / 100;
      const { 'en-US': description } = product.description!;
      this.title.innerText = title;
      this.discountPrice.innerText = discountPrice ? `$${discountPrice}` : '';
      this.price.innerText = `$${price}`;
      this.description.innerText = description;
      this.createImageSlider(images);
    } catch (err) {
      window.history.pushState({}, '', '/err');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  }

  createImageSlider(images: Array<{ url: string }>) {
    this.swiperContainer.innerHTML = '';

    const swiperWrapper = createComponent('div', ['swiper-wrapper'], {});

    images.forEach((image, index) => {
      const slide = createComponent('div', ['swiper-slide'], {});
      const imgElement = createComponent('img', CLASS.image, {
        src: image.url,
        alt: 'Product image',
      }) as HTMLImageElement;
      slide.appendChild(imgElement);
      swiperWrapper.appendChild(slide);

      this.swiperContainer.appendChild(swiperWrapper);

      imgElement.addEventListener('click', () =>
        this.openModal(
          images.map((img) => img.url),
          index,
        ),
      );
    });

    this.swiperContainer.appendChild(swiperWrapper);

    if (images.length === 1) {
      this.addClickHandlerToSingleImage(images[0].url);
    } else {
      const nextButton = createComponent('div', ['swiper-button-next'], {});
      const prevButton = createComponent('div', ['swiper-button-prev'], {});
      const pagination = createComponent('div', ['swiper-pagination'], {});
      this.swiperContainer.appendChild(nextButton);
      this.swiperContainer.appendChild(prevButton);
      this.swiperContainer.appendChild(pagination);

      const swiper = new Swiper(this.swiperContainer, {
        modules: [Navigation, Pagination],
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        loop: true,
        spaceBetween: 30,
        centeredSlides: true,
        slidesPerView: 1,
        watchOverflow: true,
      });
      swiper.init();
    }
  }

  addClickHandlerToSingleImage(imageUrl: string) {
    const singleImage = this.swiperContainer.querySelector('.swiper-slide');
    if (singleImage) {
      singleImage.classList.add('swiper-slide-active');
      singleImage.addEventListener('click', () =>
        this.openModal([imageUrl], 0),
      );
    }
  }

  /* MODAL */

  openModal(imageUrls: string[], activeIndex: number) {
    if (this.currentModal) {
      return;
    }

    document.body.style.overflow = 'hidden';
    const modal = createComponent('div', ['product-modal'], {});
    const modalContent = createComponent('div', ['modal-content'], {});
    const closeButton = createComponent('span', ['close-button'], {});
    closeButton.innerHTML = '&times;';
    closeButton.onclick = () => this.closeModal();

    const modalSwiperContainer = createComponent(
      'div',
      ['modal-swiper-container', 'swiper-container'],
      {},
    );
    const modalSwiperWrapper = createComponent('div', ['swiper-wrapper'], {});

    if (imageUrls.length > 1) {
      imageUrls.forEach((url) => {
        const slide = createComponent(
          'div',
          ['swiper-slide', 'swiper-slide-modal'],
          {},
        );
        const modalImgElement = createComponent('img', ['modal-image'], {
          src: url,
          alt: 'Enlarged Product Image',
        }) as HTMLImageElement;
        slide.appendChild(modalImgElement);
        modalSwiperWrapper.appendChild(slide);
      });

      modalSwiperContainer.appendChild(modalSwiperWrapper);
      modalContent.append(modalSwiperContainer);
    }

    modalContent.appendChild(closeButton);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    this.currentModal = modal;
    modal.style.display = 'flex';
    modal.onclick = (event) => {
      if (event.target === modal) {
        this.closeModal();
      }
    };

    if (imageUrls.length > 1) {
      const modalNextButton = createComponent(
        'div',
        ['swiper-button-next'],
        {},
      );
      const modalPrevButton = createComponent(
        'div',
        ['swiper-button-prev'],
        {},
      );
      const modalPagination = createComponent('div', ['swiper-pagination'], {});
      modalSwiperContainer.appendChild(modalNextButton);
      modalSwiperContainer.appendChild(modalPrevButton);
      modalSwiperContainer.appendChild(modalPagination);

      const modalSwiper = new Swiper(modalSwiperContainer, {
        modules: [Navigation, Pagination],
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        loop: true,
        spaceBetween: 30,
        centeredSlides: true,
        slidesPerView: 1,
        watchOverflow: true,
        initialSlide: activeIndex,
      });
      modalSwiper.init();
    } else {
      const modalImgElement = createComponent('img', ['modal-image'], {
        src: imageUrls[0],
        alt: 'Enlarged Product Image',
      }) as HTMLImageElement;
      modalContent.appendChild(modalImgElement);
    }
  }

  closeModal() {
    document.body.style.overflow = '';
    if (this.currentModal) {
      this.currentModal.style.display = 'none';
      this.currentModal.remove();
      this.currentModal = null;
    }
  }

  getPage() {
    const centerElement = document.querySelector('.center');
    centerElement?.classList.add('centercard');

    return this.pageProd;
  }

  getProd() {
    const centerElement = document.querySelector('.center');
    if (centerElement) {
      centerElement.appendChild(this.pageProd);
    }
  }

  addListenerBtn() {
    this.btnCart.addEventListener('click', () => {
      const id = isLog();
      this.btnCart.innerText = '';
      this.btnCart.append(this.load);

      id.then((data) => {
        if (!this.isCard) {
          addProductCart(data.value, this.key, data.anon, data.token)
            .then(() => {
              this.btnCart.removeChild(this.load);
              this.isCard = true;
              this.btnCart.innerText = 'Remove from Cart';
              this.btnCart.append(this.imgCart);

              const event = new CustomEvent('buttonClicked', {
                detail: { key: this.title.textContent },
              });

              document.dispatchEvent(event);

              const header = new Header();
              header.triggerCartUpdate();
            })
            .catch((err) => {
              createModal(err.name);
            });
        } else {
          removeItem(data.value, this.key, data.anon, data.token)
            .then(() => {
              this.btnCart.removeChild(this.load);
              this.isCard = false;
              this.btnCart.innerText = text;
              this.btnCart.append(this.imgCart);

              const event = new CustomEvent('buttonClickedDell', {
                detail: { key: this.title.textContent },
              });
              document.dispatchEvent(event);

              createModal('The product is removed from cart');
              const header = new Header();
              header.triggerCartUpdate();
            })
            .catch((err) => {
              createModal(err.name);
            });
        }
      });
    });
  }
}
