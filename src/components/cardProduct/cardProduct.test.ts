import Card from './cardProduct';

describe('Card class', () => {
  test('Card instance should be created correctly', () => {
    const card = new Card(
      'image.jpg',
      'Title',
      'Description',
      '$10',
      'productKey',
      '$8 (20% off)',
    );
    expect(card).toBeInstanceOf(Card);
  });

  test('getCard method should return the wrapper element', () => {
    const card = new Card(
      'image.jpg',
      'Title',
      'Description',
      '$10',
      'productKey',
      '$8 (20% off)',
    );
    const cardElement = card.getCard();
    expect(cardElement.classList.contains('wrapper_card')).toBe(true);
  });

  test('Clicking on addBtn should trigger the correct function calls', () => {
    const card = new Card(
      'image.jpg',
      'Title',
      'Description',
      '$10',
      'productKey',
      '$8 (20% off)',
    );
    const cardElement = card.getCard();
    document.body.appendChild(cardElement);

    const addBtn = cardElement.querySelector('.add-btn');
    if (addBtn) {
      addBtn.addEventListener('click', () => {});
      addBtn.dispatchEvent(new Event('click'));
    }
  });
});
