/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
import { apiRoot } from '@/sdk/builder';
import Cookies from 'js-cookie';
import { Env } from '@/sdk/envar';
import showModal from '@/components/modal/modal';

import {
  ClientResponse,
  CustomerSignInResult,
  Product,
  ProductPagedQueryResponse,
  ProductProjectionPagedSearchResponse,
} from '@commercetools/platform-sdk';
import {
  AddressInfo,
  CustomerSignUp,
  ErrorResponse,
  LoginResponse,
  SuccessResponse,
} from './servercorp.interface';
import Header from '../header/header';
import Card from '../cardProduct/cardProduct';

const limit = 500;

async function loginCustomer(
  email: string,
  password: string,
): Promise<LoginResponse> {
  try {
    const response = await apiRoot
      .login()
      .post({
        body: {
          email,
          password,
        },
      })
      .execute();

    return {
      istrue: true,
      response: response.body as unknown as SuccessResponse,
    };
  } catch (e: unknown) {
    const error = e as { body: ErrorResponse };
    return {
      istrue: false,
      error: error.body,
    };
  }
}

async function sortByName() {
  return apiRoot
    .productProjections()
    .search()
    .get({
      queryArgs: {
        sort: 'name.en-US asc',
      },
    })
    .execute();
}

function customerOn(header: Header) {
  const encryption = Cookies.get('log');

  if (!encryption) {
    const { pathname } = window.location;
    if (pathname === '/profile') {
      window.history.pushState({}, '', './');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  }

  if (encryption) {
    if (header.nav.contains(header.loginLink!)) {
      header.nav.removeChild(header.loginLink!);
    }
    if (header.nav.contains(header.regLink!)) {
      header.nav.removeChild(header.regLink!);
    }
    if (!header.nav.contains(header.profileLink!)) {
      header.nav.append(header.profileLink!);
    }
    if (!header.nav.contains(header.logoutLink!)) {
      header.nav.append(header.logoutLink!);
    }

    const { pathname } = window.location;
    if (pathname === '/login' || pathname === '/register') {
      window.history.pushState({}, '', './');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  } else {
    if (!header.nav.contains(header.loginLink!)) {
      header.nav.append(header.loginLink!);
    }
    if (!header.nav.contains(header.regLink!)) {
      header.nav.append(header.regLink!);
    }
    if (header.nav.contains(header.logoutLink!)) {
      header.nav.removeChild(header.logoutLink!);
    }
    if (header.nav.contains(header.profileLink!)) {
      header.nav.removeChild(header.profileLink!);
    }
  }
}

async function createCustomer(
  customer: CustomerSignUp,
): Promise<CustomerSignInResult> {
  const response = await apiRoot.customers().post({ body: customer }).execute();
  return response.body;
}

async function getToken(email: string, password: string) {
  const auth = btoa(`${Env.CTP_CLIENT_ID}:${Env.CTP_CLIENT_SECRET}`);

  const response = await fetch(
    `${Env.CTP_AUTH_URL}/oauth/${Env.CTP_PROJECT_KEY}/customers/token`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=password&username=${email}&password=${password}&scope=${Env.CTP_SCOPES}`,
    },
  );
  const data = await response.json();

  return data;
}

async function getAllCategories() {
  const response = await apiRoot
    .categories()
    .get({
      queryArgs: {
        where: 'parent is not defined',
      },
    })
    .execute();
  const rez = response.body.results.map((item) => item.key);
  return rez;
}

async function fetchCustomerData(customerId: string) {
  const response = await apiRoot
    .customers()
    .withId({ ID: customerId })
    .get()
    .execute();
  return response.body;
}

// async function getCartByCustomerID(){}

async function fetchShippingAddressId(
  customerId: string,
): Promise<AddressInfo> {
  const response = await apiRoot
    .customers()
    .withId({ ID: customerId })
    .get()
    .execute();
  const currentVersion = response.body.version;
  if (response.body.addresses && response.body.addresses.length > 0) {
    const addressId = response.body.addresses[0].id;
    return { addressId, currentVersion };
  }
  return { addressId: undefined, currentVersion };
}

async function fetchBillingAddressId(customerId: string): Promise<AddressInfo> {
  const response = await apiRoot
    .customers()
    .withId({ ID: customerId })
    .get()
    .execute();
  const currentVersion = response.body.version;
  if (response.body.addresses && response.body.addresses.length > 0) {
    const addressId = response.body.addresses[1].id;
    return { addressId, currentVersion };
  }
  return { addressId: undefined, currentVersion };
}

async function getAllProduct() {
  const response = await apiRoot.products().get().execute();

  return response.body;
}

async function sortPriceSmall(price: number) {
  return apiRoot
    .productProjections()
    .search()
    .get({
      queryArgs: {
        filter: `variants.price.centAmount:range (0 to ${price * 100})`,
        sort: `price asc`,
        limit,
      },
    })
    .execute();
}

function getvalueCardProduct(data: Product, wrapper: HTMLElement) {
  wrapper.innerHTML = ``;
  const result = data.masterData.current;
  const imgUrl = result.masterVariant.images![0].url;
  const name = result.name['en-US'];
  const bref = result.masterVariant.attributes![0].value['en-US'];
  const price = `${result.masterVariant.prices![2].value.centAmount / 100} ${result.masterVariant.prices![2].value.currencyCode}`;
  const key = data.key!;

  let discount;
  const disc = result.masterVariant.prices![2].discounted?.value.centAmount;
  if (typeof disc === 'number') {
    discount = `${(disc / 100).toFixed(2)} ${result.masterVariant.prices![2].discounted?.value.currencyCode}`;
  }
  wrapper.append(new Card(imgUrl, name, bref, price, key, discount).getCard());
  wrapper.classList.add('oneCard');
}

function addCard(
  data:
    | ProductPagedQueryResponse
    | ClientResponse<ProductProjectionPagedSearchResponse>,
  wrapper: HTMLElement,
) {
  wrapper.innerHTML = ``;
  wrapper.classList.remove('oneCard');
  if ('results' in data) {
    for (let i = 0; i < data.results.length; i += 1) {
      const result = data.results[i].masterData.current;
      const imgUrl = result.masterVariant.images![0].url;
      const name = result.name['en-US'];
      const bref = result.masterVariant.attributes![0].value['en-US'];
      const price = `${result.masterVariant.prices![2].value.centAmount / 100} ${result.masterVariant.prices![2].value.currencyCode}`;
      const key = data.results[i].key!;
      let discount;
      const disc = result.masterVariant.prices![2].discounted?.value.centAmount;
      if (typeof disc === 'number') {
        discount = `${(disc / 100).toFixed(2)} ${result.masterVariant.prices![2].discounted?.value.currencyCode}`;
      }

      wrapper.append(
        new Card(imgUrl, name, bref, price, key, discount).getCard(),
      );
    }
  } else {
    for (let i = 0; i < data.body.results.length; i += 1) {
      const result = data.body.results[i];
      const imgUrl = result.masterVariant.images![0].url;
      const name = result.name['en-US'];
      const bref = result.masterVariant.attributes![0].value['en-US'];
      const price = `${result.masterVariant.prices![2].value.centAmount / 100} ${result.masterVariant.prices![2].value.currencyCode}`;
      const key = result.key!;
      let discount;
      const disc = result.masterVariant.prices![2].discounted?.value.centAmount;
      if (typeof disc === 'number') {
        discount = `${(disc / 100).toFixed(2)} ${result.masterVariant.prices![2].discounted?.value.currencyCode}`;
      }
      wrapper.append(
        new Card(imgUrl, name, bref, price, key, discount).getCard(),
      );
    }
  }
}

async function getCategoryId(name: string) {
  const response = await apiRoot
    .categories()
    .withKey({
      key: name,
    })
    .get()
    .execute();
  return response.body.id;
}

async function sortCategory(category: string) {
  const id = await getCategoryId(category);
  const response = await apiRoot
    .productProjections()
    .search()
    .get({
      queryArgs: {
        filter: [`categories.id:"${id}"`],
        limit: 500,
      },
    })
    .execute();
  return response;
}

async function sortPriceHigh(price: number) {
  return apiRoot
    .productProjections()
    .search()
    .get({
      queryArgs: {
        filter: `variants.price.centAmount:range (${price * 100} to *)`,
        sort: `price asc`,
        limit,
      },
    })
    .execute();
}

async function getProd(key: string) {
  const response = await apiRoot.products().withKey({ key }).get().execute();
  return response.body;
}

async function getgetProdByName(name: string) {
  const response = await apiRoot
    .productProjections()
    .search()
    .get({
      queryArgs: {
        'text.en-US': `{${name}}`,
        staged: false,
      },
    })
    .execute();

  return response;
}

// eslint-disable-next-line consistent-return
async function getBasket(id: string | undefined, anon: boolean, token: string) {
  try {
    if (!anon) {
      const response = await apiRoot
        .carts()
        .withCustomerId({ customerId: id! })
        .get()
        .execute();
      return response;
    }

    const response = await apiRoot.carts().withId({ ID: id! }).get().execute();
    return response;
  } catch (err) {
    if (err instanceof Error) {
      if (err.name === 'NetworkError') {
        showModal(`${err.name}`);
        return undefined;
      }
      if (!anon) {
        const response = await apiRoot
          .carts()
          .post({
            body: {
              currency: 'USD',
              customerId: id,
              country: 'US',
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .execute();
        return response;
      }
      const response = await apiRoot
        .carts()
        .post({
          body: {
            currency: 'USD',
            country: 'US',
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .execute();

      sessionStorage.setItem('anonBasket', btoa(response.body.id));
      return response;
    }
  }
}

// eslint-disable-next-line consistent-return
async function addProductBasket(
  idCost: string | undefined,
  key: string,
  anon: boolean,
  token: string,
) {
  const basket = await getBasket(idCost, anon, token);
  if (basket) {
    const product = await getProd(key);
    const { id } = basket.body;
    const { version } = basket.body;
    const productId = product.id;

    const response = await apiRoot
      .carts()
      .withId({ ID: id })
      .post({
        body: {
          version,
          actions: [
            {
              action: 'addLineItem',
              productId,
            },
          ],
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .execute();

    return response;
  }
}

async function getTokenAnon() {
  const URL = `${Env.CTP_AUTH_URL}/oauth/${Env.CTP_PROJECT_KEY}/anonymous/token`;
  const auth = btoa(`${Env.CTP_CLIENT_ID}:${Env.CTP_CLIENT_SECRET}`);

  const body = `grant_type=client_credentials&scope=${Env.CTP_SCOPES}`;

  const response = await fetch(URL, {
    method: `POST`,
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });
  const data = await response.json();

  return data;
}

async function isLog() {
  const log = Cookies.get('log');
  if (log) {
    const token = Cookies.get('token');

    return {
      value: atob(log),
      anon: false,
      token: atob(token!),
    };
  }
  const anonBasket = sessionStorage.getItem('anonBasket');
  if (anonBasket) {
    const token = sessionStorage.getItem('anonToken');
    return {
      value: atob(anonBasket),
      anon: true,
      token: atob(token!),
    };
  }
  const token = await getTokenAnon();
  sessionStorage.setItem('anonToken', btoa(token.access_token));
  return {
    value: undefined,
    anon: true,
    token: token.access_token,
  };
}

export {
  loginCustomer,
  customerOn,
  createCustomer,
  getToken,
  fetchCustomerData,
  getAllProduct,
  getAllCategories,
  sortPriceSmall,
  addCard,
  sortCategory,
  sortPriceHigh,
  getProd,
  getvalueCardProduct,
  sortByName,
  getgetProdByName,
  fetchShippingAddressId,
  fetchBillingAddressId,
  getBasket,
  addProductBasket,
  isLog,
  getTokenAnon,
};
