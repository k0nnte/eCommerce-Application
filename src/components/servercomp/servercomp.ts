import { apiRoot } from '@/sdk/builder';
import Cookies from 'js-cookie';
import { Env } from '@/sdk/envar';

import {
  // ClientResponse,
  CustomerSignInResult,
} from '@commercetools/platform-sdk';
import {
  CustomerSignUp,
  ErrorResponse,
  LoginResponse,
  SuccessResponse,
} from './servercorp.interface';
import Header from '../header/header';

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
    if (!header.nav.contains(header.logoutLink!)) {
      header.nav.append(header.logoutLink!);
    }
    if (!header.nav.contains(header.profileLink!)) {
      header.nav.append(header.profileLink!);
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

async function fetchCustomerData(customerId: string) {
  const response = await apiRoot
    .customers()
    .withId({ ID: customerId })
    .get()
    .execute();
  return response.body;
}

async function getAllProduct() {
  const response = await apiRoot.products().get().execute();

  return response.body;
}

async function getProd(key: string) {
  const response = await apiRoot.products().withKey({ key }).get().execute();

  return response.body;
}

export {
  loginCustomer,
  customerOn,
  createCustomer,
  getToken,
  fetchCustomerData,
  getAllProduct,
  getProd,
};
