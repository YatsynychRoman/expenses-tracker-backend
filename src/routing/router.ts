import { route, type Route } from '@std/http/unstable-route';

import userRoutes from './user.ts';
import expensesRoutes from './expenses.ts';

const routes: Route[] = [
  ...userRoutes,
  ...expensesRoutes
];

const defaultHandler = () => {
  return new Response('Not found', { status: 404 });
};

export default route(routes, defaultHandler);
