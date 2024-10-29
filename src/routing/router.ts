import { route, type Route } from '@std/http/unstable-route';

import userRoutes from './user.ts';
import expensesRoutes from './expenses.ts';

const routes: Route[] = [
  {
    pattern: new URLPattern({ pathname: '*/*' }),
    method: ['OPTIONS'],
    handler: (req: Request) => {
      // Security is for weak :)
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Methods': '*',
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Max-Age': 86400,
        }
      });
    }
  },
  ...userRoutes,
  ...expensesRoutes
];

const defaultHandler = () => {
  return new Response('Not found', { status: 404 });
};

export default route(routes, defaultHandler);
