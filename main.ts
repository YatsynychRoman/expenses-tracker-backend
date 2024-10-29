import router from './src/routing/router.ts';

Deno.serve({ port: Deno.env.get('PORT') }, router);
