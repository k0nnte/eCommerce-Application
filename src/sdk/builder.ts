import fetch from 'node-fetch';
import {
  ClientBuilder,
  type AuthMiddlewareOptions,
  type HttpMiddlewareOptions,
} from '@commercetools/sdk-client-v2';
import {
  ApiRoot,
  createApiBuilderFromCtpClient,
} from '@commercetools/platform-sdk';
import { Env } from './envar';

const projectKey = Env.CTP_PROJECT_KEY;
const scopes = [Env.CTP_SCOPES];

const authMiddlewareOptions: AuthMiddlewareOptions = {
  host: Env.CTP_AUTH_URL,
  projectKey,
  credentials: {
    clientId: Env.CTP_CLIENT_ID,
    clientSecret: Env.CTP_CLIENT_SECRET,
  },
  scopes,
  fetch,
};

const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: Env.CTP_API_URL,
  fetch,
};

const ctpClient = new ClientBuilder()
  .withProjectKey(projectKey)
  .withClientCredentialsFlow(authMiddlewareOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  .withLoggerMiddleware()
  .build();

export const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
  projectKey,
});
