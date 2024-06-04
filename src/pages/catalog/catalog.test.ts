import {
  getAllProduct,
  getgetProdByName,
  addCard,
} from '@/components/servercomp/servercomp';
import createComponent from '@/components/components';
import Filter from '@/components/filter/filter';
import createModal from '@/components/modal/modal';
import Catalog from './catalog';

jest.mock('@/components/components');
jest.mock('@/components/filter/filter');
jest.mock('@/components/servercomp/servercomp');
jest.mock('../../../public/files/Vector.png');
jest.mock('@/components/modal/modal');

describe('Catalog', () => {
  let catalog: Catalog;

  beforeEach(() => {
    jest.clearAllMocks();

    (createComponent as jest.Mock).mockImplementation((tag, classes, attrs) => {
      const element = document.createElement(tag);
      element.className = classes.join(' ');
      Object.keys(attrs).forEach((key) => {
        element.setAttribute(key, attrs[key]);
      });
      return element;
    });

    (Filter as jest.Mock).mockImplementation(() => ({
      getFilter: jest.fn().mockReturnValue(document.createElement('div')),
    }));

    (getAllProduct as jest.Mock).mockResolvedValue([]);

    catalog = new Catalog();
  });

  it('should initialize with correct elements', () => {
    expect(catalog.wrap_main).toBeDefined();
    expect(catalog.wrapper_filter).toBeDefined();
    expect(catalog.wrapper_Catalog).toBeDefined();
    expect(catalog.searchName).toBeDefined();
    expect(catalog.search_wrapper).toBeDefined();
    expect(catalog.btnSech).toBeDefined();
    expect(catalog.btmImg).toBeDefined();
    expect(catalog.search).toBeDefined();
  });

  it('should render search correctly', () => {
    catalog.renderSeatch();

    expect(
      catalog.wrapper_filter.contains(catalog.search_wrapper),
    ).toBeTruthy();
    expect(catalog.search_wrapper.contains(catalog.searchName)).toBeTruthy();
    expect(catalog.search_wrapper.contains(catalog.btnSech)).toBeTruthy();
    expect(catalog.btnSech.contains(catalog.btmImg)).toBeTruthy();
  });

  it('should call getAllProduct and addCard on renderCatalog', async () => {
    const mockData = [{ id: 1, name: 'Product 1' }];
    (getAllProduct as jest.Mock).mockResolvedValue(mockData); // Ensure mock returns a resolved promise
    const addCardMock = jest.fn();
    (addCard as jest.Mock).mockImplementation(addCardMock);

    await catalog.renderCatalog();

    expect(getAllProduct).toHaveBeenCalled();
    expect(addCardMock).toHaveBeenCalledWith(mockData, catalog.wrapper_Catalog);
  });

  it('should handle search button click correctly', async () => {
    const mockData = [{ id: 1, name: 'Product 1' }];
    const value = 'Product';
    (getgetProdByName as jest.Mock).mockResolvedValue(mockData);
    (catalog.searchName as HTMLInputElement).value = value;
    const addCardMock = jest.fn();
    (addCard as jest.Mock).mockImplementation(addCardMock);

    catalog.addListenerBtn();
    catalog.btnSech.click();

    expect(getgetProdByName).toHaveBeenCalledWith(value);
    await expect(getgetProdByName(value)).resolves.toEqual(mockData);
    expect(addCardMock).toHaveBeenCalledWith(mockData, catalog.wrapper_Catalog);
  });

  it('should handle search button click error correctly', async () => {
    const Error = { body: { message: 'Error message' } };
    const value = 'Nonexistent Product';
    (getgetProdByName as jest.Mock).mockRejectedValue(Error);
    (catalog.searchName as HTMLInputElement).value = value;
    const createModalMock = jest.fn();
    (createModal as jest.Mock).mockImplementation(createModalMock);

    catalog.addListenerBtn();
    catalog.btnSech.click();

    expect(getgetProdByName).toHaveBeenCalledWith(value);
    await expect(getgetProdByName(value)).rejects.toEqual(Error);
    expect(createModalMock).toHaveBeenCalledWith(Error.body.message);
  });
});
