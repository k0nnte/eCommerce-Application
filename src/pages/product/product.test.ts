import { getProd } from '@/components/servercomp/servercomp';
import Product from './product';
import '@testing-library/jest-dom';

jest.mock('@/components/components', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation((element, classes, object) => {
    const elem = document.createElement(element);
    classes.forEach((className: string) => {
      elem.classList.add(className);
    });
    Object.entries(object).forEach(([key, value]) => {
      if (typeof key === 'string' && typeof value === 'string') {
        elem.setAttribute(key, value);
      }
    });
    return elem;
  }),
}));

jest.mock('@/components/servercomp/servercomp', () => ({
  getProd: jest.fn().mockResolvedValue({
    masterData: {
      current: {
        masterVariant: {
          images: [{ url: 'test-url' }],
          prices: [{}, {}, { value: { centAmount: 1000 } }],
        },
        name: { 'en-US': 'Test Title' },
        description: { 'en-US': 'Test Description' },
      },
    },
  }),
}));

describe('Product', () => {
  let product: Product;

  beforeEach(() => {
    product = new Product(
      'test-key',
      'test-url',
      'Test Title',
      '$10',
      'Test Description',
    );
  });

  it('should create product page with provided details', () => {
    expect(product.pageProd.tagName).toBe('DIV');
    expect(product.pageProd.classList.contains('page-prod')).toBe(true);

    expect(product.infoContainer.tagName).toBe('DIV');
    expect(product.infoContainer.classList.contains('info-prod')).toBe(true);

    expect(product.title.tagName).toBe('H2');
    expect(product.title.classList.contains('title-prod')).toBe(true);

    expect(product.price.tagName).toBe('DIV');
    expect(product.price.classList.contains('price-prod')).toBe(true);

    expect(product.description.tagName).toBe('P');
    expect(product.description.classList.contains('description-prod')).toBe(
      true,
    );
  });

  it('should render product with data from server', async () => {
    await product.renderProduct('test-key');

    expect(product.title.innerText).toEqual('Test Title');
    expect(product.price.innerText).toEqual('$10');
    expect(product.description.innerText).toEqual('Test Description');

    expect(getProd).toHaveBeenCalledWith('test-key');
  });

  it('getPage should return the pageProd element', () => {
    const pageElement = product.getPage();

    expect(pageElement).toBe(product.pageProd);
  });

  it('should add the product element to an element with class .center', () => {
    const centerElement = document.createElement('div');
    centerElement.classList.add('center');
    document.body.appendChild(centerElement);

    product.getProd();

    expect(centerElement).toContainElement(product.pageProd);
  });
});
