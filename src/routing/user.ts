import { type Route } from '@std/http/unstable-route';

import buildURLPattern from '../helpers/buildURLPattern.ts';

import { 
  loginHandler,
  registerHandler,
  refreshTokens,
  getCategoriesHandler,
  createCategoryHandler,
  deleteCategoryHandler,
  renameCategoryHandler,
} from '../handlers/index.ts';

import withAuthentication from "../middlewares/withAuthentication.ts";

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
    handler: withAuthentication(getCategoriesHandler),
  },
  {
    method: ['POST'],
    pattern: buildURLPattern('user', 'categories'),
    handler: withAuthentication(createCategoryHandler),
  },
  {
    method: ['DELETE'],
    pattern: buildURLPattern('user', 'categories/:id'),
    handler: withAuthentication(deleteCategoryHandler),
  },
  {
    method: ['PATCH'],
    pattern: buildURLPattern('user', 'categories/:id'),
    handler: withAuthentication(renameCategoryHandler),
  },
];

export default routes;
