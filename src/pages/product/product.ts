import createComponent from '@/components/components';
import { getProd } from '@/components/servercomp/servercomp';
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/scss';
import 'swiper/scss/navigation';
import 'swiper/scss/pagination';
import './product.scss';

const CLASS = {
  wrapper: ['page-prod'],
  container: ['info-prod'],
  image: ['img-prod'],
  title: ['title-prod'],
  priceBox: ['price-box'],
  discountPrice: ['price-prod', 'discount-price'],
  price: ['price-prod', 'start-price'],
  description: ['description-prod'],
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

    this.createProductPage(title, discountPrice, price, description);
    this.renderProduct(key);
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
    this.infoContainer.append(this.title, this.priceBox, this.description);
    this.priceBox.append(this.discountPrice, this.price);
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

    images.forEach((image) => {
      const slide = createComponent('div', ['swiper-slide'], {});
      const img = createComponent('img', CLASS.image, {
        src: image.url,
        alt: 'Product image',
      }) as HTMLImageElement;
      slide.appendChild(img);
      swiperWrapper.appendChild(slide);
    });

    this.swiperContainer.appendChild(swiperWrapper);

    if (images.length > 1) {
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
        on: {
          init: () => {
            this.addClickHandlersToImages();
          },
        },
      });
      swiper.init();
    } else {
      // eslint-disable-next-line no-new
      new Swiper(this.swiperContainer, {
        loop: false,
        spaceBetween: 30,
        centeredSlides: true,
        slidesPerView: 1,
      });
    }
  }

  addClickHandlersToImages() {
    this.swiperContainer.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target && target.closest('.swiper-slide')) {
        const slide = target.closest('.swiper-slide');
        if (slide) {
          const img = slide.querySelector('img');
          if (img) {
            const imageUrl = (img as HTMLImageElement).src;
            if (imageUrl) {
              this.openModal(imageUrl);
            }
          }
        }
      }
    });
  }

  openModal(imageUrl: string) {
    const modal = createComponent('div', ['product-modal'], {});
    const modalContent = createComponent('div', ['modal-content'], {});
    const closeButton = createComponent('span', ['close-button'], {});
    closeButton.innerHTML = '&times;';
    closeButton.onclick = () => this.closeModal();

    const modalImage = createComponent('img', ['modal-image'], {
      src: imageUrl,
      alt: 'Enlarged Product Image',
    }) as HTMLImageElement;

    modalContent.appendChild(closeButton);
    modalContent.appendChild(modalImage);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    this.currentModal = modal;
    modal.style.display = 'block';
    modal.onclick = (event) => {
      if (event.target === modal) {
        this.closeModal();
      }
    };
  }

  closeModal() {
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
}
