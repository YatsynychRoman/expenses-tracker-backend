import { deleteCategory, getCategory } from '../../db/categories/index.ts';

export default async (req: Request) => {
  const categoryId = await req.json();
  const userId = req.headers.get('userId');

  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const category = await getCategory(categoryId, userId);

  if (!category) {
    return new Response('Category not found', { status: 404 });
  }

  if (category.user_id !== Number(userId)) {
    return new Response('Not permitted', { status: 403 });
  }

  await deleteCategory(categoryId, userId);

  return new Response('Category deleted', { status: 200 });
}
