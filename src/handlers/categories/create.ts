import { createCategory, getCategoryByName } from '../../db/categories/index.ts';

export default async (req: Request) => {
  const userId = req.headers.get('userId'); 
  const { name } = await req.json();

  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Check if the category already exists for this user
  const existingCategory = await getCategoryByName(userId, name);
  if (existingCategory) {
    return new Response('Category with this name already exists', { status: 400 });
  }

  await createCategory(userId, name);

  return new Response('Category created', { status: 201 });
}
