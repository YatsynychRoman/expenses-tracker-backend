import { type Route, type Handler } from '@std/http/unstable-route';

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
    pattern: buildURLPattern('expenses'),
    handler: withAuthentication(createExpenseHandler as Handler),
  },
  {
    method: ['DELETE'],
    pattern: buildURLPattern('expenses', ':id'),
    handler: withAuthentication(deleteExpenseHandler as Handler),
  },
  {
    method: ['PATCH'],
    pattern: buildURLPattern('expenses',':id'),
    handler: withAuthentication(editExpenseHandler as Handler),
  },
  {
    method: ['GET'],
    pattern: buildURLPattern('expenses'),
    handler: withAuthentication(getExpensesHandler as Handler),
  },
  {
    method: ['GET'],
    pattern: buildURLPattern('expenses','categories'),
    handler: withAuthentication(getExpensesByCategoriesHandler as Handler),
  },
  {
    method: ['GET'],
    pattern: buildURLPattern('trends'),
    handler: withAuthentication(getTrendsHandler as Handler),
  },
]

export default routes;
