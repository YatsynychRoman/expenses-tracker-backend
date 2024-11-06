import router from './src/routing/router.ts';

Deno.serve({ port: Number(Deno.env.get('PORT')) }, router);
