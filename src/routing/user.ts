import { type Route } from '@std/http/unstable-route';

import buildURLPattern from '../helpers/buildURLPattern.ts';

import { loginHandler, registerHandler, refreshTokens } from '../handlers/index.ts';

import withAuthentication from "../middlwares/withAuthentication.ts";

const userHandlers = {
  login: () => new Response('POST Login'),
  register: () => new Response('POST Register'),
  getCategories: () => new Response('GET Categories'),
  createCategory: () => new Response('POST Categories'),
  deleteCategory: () => new Response('DELETE Categories'),
  renameCategory: () => new Response('PATCH Categories'),
};

const routes: Route[] = [
  {
    method: ['POST'],
    pattern: buildURLPattern('auth', 'login'),
    handler: loginHandler,
  },
  {
    method: ['POST'],
    pattern: buildURLPattern('auth', 'register'),
    handler: registerHandler,
  },
  {
    method: ['POST'],
    pattern: buildURLPattern('auth', 'tokens'),
    handler: refreshTokens,
  },
  {
    method: ['GET'],
    pattern: buildURLPattern('user', 'categories'),
    handler: userHandlers.getCategories,
  },
  {
    method: ['POST'],
    pattern: buildURLPattern('user', 'categories'),
    handler: userHandlers.createCategory,
  },
  {
    method: ['DELETE'],
    pattern: buildURLPattern('user', 'categories'),
    handler: userHandlers.deleteCategory,
  },
  {
    method: ['PATCH'],
    pattern: buildURLPattern('user', 'categories/:id'),
    handler: userHandlers.renameCategory,
  },
];

export default routes;
