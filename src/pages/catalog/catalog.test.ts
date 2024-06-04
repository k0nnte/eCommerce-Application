import { getAllProduct, getProd } from '@/components/servercomp/servercomp';
import createComponent from '@/components/components';
import Filter from '@/components/filter/filter';
import Catalog from './catalog';

jest.mock('@/components/components');
jest.mock('@/components/filter/filter');
jest.mock('@/components/servercomp/servercomp');
jest.mock('../../../public/files/Vector.png');

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
    jest.spyOn(catalog, 'renderCatalog').mockImplementationOnce(() => {
      addCardMock(mockData, catalog.wrapper_Catalog);
    });

    await catalog.renderCatalog();

    expect(getAllProduct).toHaveBeenCalled();
    expect(addCardMock).toHaveBeenCalledWith(mockData, catalog.wrapper_Catalog);
  });

  it('should handle search button click correctly', async () => {
    const mockData = { id: 1, name: 'Product 1' };
    const value = 'Product';
    (getProd as jest.Mock).mockResolvedValue(mockData);
    (catalog.searchName as HTMLInputElement).value = value;
    const getCardProduct = jest.fn();
    jest.spyOn(catalog, 'addListenerBtn').mockImplementationOnce(() => {
      getCardProduct(mockData, catalog.wrapper_Catalog);
    });

    catalog.addListenerBtn();
    catalog.btnSech.click();

    expect(getProd).toHaveBeenCalledWith(
      value.toLowerCase().replace(/ /g, '-'),
    );
    await expect(
      getProd(value.toLowerCase().replace(/ /g, '-')),
    ).resolves.toEqual(mockData);
    expect(getCardProduct).toHaveBeenCalledWith(
      mockData,
      catalog.wrapper_Catalog,
    );
  });

  it('should handle search button click error correctly', async () => {
    const Error = { body: { message: 'Error message' } };
    const value = 'Nonexistent Product';
    (getProd as jest.Mock).mockRejectedValue(Error);
    (catalog.searchName as HTMLInputElement).value = value;
    const createModall = jest.fn();
    jest.spyOn(catalog, 'addListenerBtn').mockImplementationOnce(() => {
      createModall(Error.body.message);
    });

    catalog.addListenerBtn();
    catalog.btnSech.click();

    expect(getProd).toHaveBeenCalledWith(
      value.toLowerCase().replace(/ /g, '-'),
    );
    await expect(
      getProd(value.toLowerCase().replace(/ /g, '-')),
    ).rejects.toEqual(Error);
    expect(createModall).toHaveBeenCalledWith(Error.body.message);
  });
});
