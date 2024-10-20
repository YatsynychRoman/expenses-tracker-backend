import { type Route } from '@std/http/unstable-route';

import buildURLPattern from '../helpers/buildURLPattern.ts';

const expensesHandlers = {
  createExpense: () => new Response('POST Expenses'),
  deleteExpense: () => new Response('DELETE Expenses'),
  editExpense: () => new Response('PATCH Expenses'),
  getExpenses: () => new Response('GET Expenses'),
};

const routes: Route[] = [
  {
    method: ['POST'],
    pattern: buildURLPattern('expenses', ''),
    handler: expensesHandlers.createExpense,
  },
  {
    method: ['DELETE'],
    pattern: buildURLPattern('expenses', ':id'),
    handler: expensesHandlers.deleteExpense,
  },
  {
    method: ['PATCH'],
    pattern: buildURLPattern('expenses',':id'),
    handler: expensesHandlers.editExpense,
  },
  {
    method: ['GET'],
    pattern: buildURLPattern('expenses',''),
    handler: expensesHandlers.getExpenses,
  },
]

export default routes;
