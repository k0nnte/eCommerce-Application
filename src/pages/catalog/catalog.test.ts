import { getAllProduct } from '@/components/servercomp/servercomp';
import createComponent from '@/components/components';
import Filter from '@/components/filter/filter';
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
});
