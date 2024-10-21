import { getCategories } from '../../db/categories/index.ts';

export default async (req: Request) => {
  const userId = req.headers.get('userId');
  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const categories = await getCategories(userId);
  return new Response(JSON.stringify(categories), { headers: { 'Content-Type': 'application/json' } });
}
