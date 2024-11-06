import { type Route, type Handler } from '@std/http/unstable-route';

import buildURLPattern from '../helpers/buildURLPattern.ts';

import {
  signInHandler,
  registerHandler,
  refreshTokens,
  getCategoriesHandler,
  createCategoryHandler,
  deleteCategoryHandler,
  renameCategoryHandler,
  getUserHandler,
  updateUserHandler,
  deleteUserHandler,
  checkUsername,
  checkEmail,
} from '../handlers/index.ts';

import withAuthentication from "../middlewares/withAuthentication.ts";

const routes: Route[] = [
  {
    method: ['POST'],
    pattern: buildURLPattern('auth', 'sign-in'),
    handler: signInHandler,
  },
  {
    method: ['POST'],
    pattern: buildURLPattern('auth', 'check-username'),
    handler: checkUsername,
  },
  {
    method: ['POST'],
    pattern: buildURLPattern('auth', 'check-email'),
    handler: checkEmail,
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
    pattern: buildURLPattern('user'),
    handler: withAuthentication(getUserHandler as Handler),
  },
  {
    method: ['PATCH'],
    pattern: buildURLPattern('user'),
    handler: withAuthentication(updateUserHandler as Handler),
  },
  {
    method: ['DELETE'],
    pattern: buildURLPattern('user'),
    handler: withAuthentication(deleteUserHandler as Handler)
  },
  {
    method: ['GET'],
    pattern: buildURLPattern('user', 'categories'),
    handler: withAuthentication(getCategoriesHandler as Handler),
  },
  {
    method: ['POST'],
    pattern: buildURLPattern('user', 'categories'),
    handler: withAuthentication(createCategoryHandler as Handler),
  },
  {
    method: ['DELETE'],
    pattern: buildURLPattern('user', 'categories/:id'),
    handler: withAuthentication(deleteCategoryHandler as Handler),
  },
  {
    method: ['PATCH'],
    pattern: buildURLPattern('user', 'categories/:id'),
    handler: withAuthentication(renameCategoryHandler as Handler),
  },
];

export default routes;
