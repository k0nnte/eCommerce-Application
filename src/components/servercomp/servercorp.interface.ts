import { BaseAddress } from '@commercetools/platform-sdk';

export interface ClientInfo {
  clientId: string;
  isPlatformClient: boolean;
}

export interface Customer {
  id: string;
  version: number;
  versionModifiedAt: string;
  lastMessageSequenceNumber: number;
  createdAt: string;
  lastModifiedAt: string;
  lastModifiedBy: ClientInfo;
  createdBy: ClientInfo;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  addresses: unknown[];
  shippingAddressIds: unknown[];
  billingAddressIds: unknown[];
  isEmailVerified: boolean;
  stores: unknown[];
  authenticationMode: string;
}

export interface CustomerSignUp {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  addresses: BaseAddress[];
  shippingAddresses?: number[];
  billingAddresses?: number[];
  defaultBillingAddress?: number;
  defaultShippingAddress?: number;
}

export interface SuccessResponse {
  customer: Customer;
}

export interface ErrorResponse {
  code: number;
  statusCode: number;
  status: number;
  message: string;
  originalRequest: {
    baseUri: string;
    method: string;
    uriTemplate: string;
    pathVariables: {
      projectKey: string;
    };
    headers: {
      'Content-Type': string;
      Authorization: string;
    };
    body: {
      email: string;
      password: string;
    };
    uri: string;
  };
  retryCount: number;
  headers: {
    'content-length': string;
    'content-type': string;
    'x-correlation-id': string;
  };
  body: {
    statusCode: number;
    message: string;
    errors: {
      code: string;
      message: string;
    }[];
  };
  name: string;
}

export interface LoginResponse {
  istrue: boolean;
  response?: SuccessResponse;
  error?: ErrorResponse;
}
