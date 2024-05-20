/* eslint-disable import/prefer-default-export */
import { apiRoot } from '@/sdk/builder';
import Cookies from 'js-cookie';
import {
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
  if (encryption) {
    // if (header.homeLink) {
    //   header.header.removeChild(header.homeLink);
    // }
  }
  // eslint-disable-next-line no-console
  console.log(header);
}

export { loginCustomer, customerOn };
