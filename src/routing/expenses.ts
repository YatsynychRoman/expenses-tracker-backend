import { type Route } from '@std/http/unstable-route';

import buildURLPattern from '../helpers/buildURLPattern.ts';
import withAuthentication from "../middlewares/withAuthentication.ts";

import {
  createExpenseHandler,
  deleteExpenseHandler,
  editExpenseHandler,
  getExpensesHandler,
  getTrendsHandler,
  getExpensesByCategoriesHandler,
} from '../handlers/index.ts';

const routes: Route[] = [
  {
    method: ['POST'],
    pattern: buildURLPattern('expenses', ''),
    handler: withAuthentication(createExpenseHandler),
  },
  {
    method: ['DELETE'],
    pattern: buildURLPattern('expenses', ':id'),
    handler: withAuthentication(deleteExpenseHandler),
  },
  {
    method: ['PATCH'],
    pattern: buildURLPattern('expenses',':id'),
    handler: withAuthentication(editExpenseHandler),
  },
  {
    method: ['GET'],
    pattern: buildURLPattern('expenses',''),
    handler: withAuthentication(getExpensesHandler),
  },
  {
    method: ['GET'],
    pattern: buildURLPattern('expenses','categories'),
    handler: withAuthentication(getExpensesByCategoriesHandler),
  },
  {
    method: ['GET'],
    pattern: buildURLPattern('trends',''),
    handler: withAuthentication(getTrendsHandler),
  },
]

export default routes;
