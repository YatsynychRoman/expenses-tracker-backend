import { createCategory } from '../../db/categories/index.ts';

export default async (req: Request) => {
  const userId = req.headers.get('userId'); 
  const name = await req.json();

  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  await createCategory(userId, name);

  return new Response('Category created', { status: 201 });
}
