/* eslint-disable import/prefer-default-export */
import { apiRoot } from '@/sdk/builder';
import {
  ErrorResponse,
  LoginResponse,
  SuccessResponse,
} from './servercorp.interface';

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

function costomerOn() {
  // eslint-disable-next-line no-console
  console.log('hi');
}

export { loginCustomer, costomerOn };
