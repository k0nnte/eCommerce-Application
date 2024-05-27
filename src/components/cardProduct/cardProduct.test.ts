import Card from './cardProduct';
import createComponent from '../components';

jest.mock('../components');

describe('Card', () => {
  const mockCreateComponent = createComponent as jest.MockedFunction<
    typeof createComponent
  >;

  beforeEach(() => {
    mockCreateComponent.mockReset();
  });

  it('should create a Card component with the correct structure and content', () => {
    const urlImg = 'http://example.com/image.jpg';
    const zag = 'Example';
    const description = 'Example';
    const price = 'Example';

    mockCreateComponent.mockImplementation((tag, classList, attributes) => {
      const element = document.createElement(tag);
      element.classList.add(...classList);
      if (attributes) {
        Object.keys(attributes).forEach((key) => {
          element.setAttribute(key, attributes[key]);
        });
      }
      return element;
    });

    const card = new Card(urlImg, zag, description, price);
    const cardElement = card.getCard();

    expect(cardElement.classList.contains('wrapper_card')).toBe(true);

    const imgElement = cardElement.querySelector('img');
    expect(imgElement).not.toBeNull();
    expect(imgElement!.classList.contains('img_card')).toBe(true);
    expect(imgElement!.getAttribute('src')).toBe(urlImg);
    expect(imgElement!.getAttribute('alt')).toBe('catalogImg');

    const titleElement = cardElement.querySelector('h2');
    expect(titleElement).not.toBeNull();
    expect(titleElement!.classList.contains('zagolov_card')).toBe(true);
    expect(titleElement!.innerText).toBe(zag);

    const descriptionElement = cardElement.querySelector('p');
    expect(descriptionElement).not.toBeNull();
    expect(descriptionElement!.classList.contains('description_card')).toBe(
      true,
    );
    expect(descriptionElement!.innerText).toBe(description);
  });
});
