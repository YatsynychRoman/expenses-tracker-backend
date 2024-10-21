import { editCategory, getCategory } from '../../db/categories/index.ts';

export default async (req: Request) => {
  const { categoryId, name } = await req.json();
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

  await editCategory(categoryId, name);

  return new Response('Category renamed', { status: 200 });
}
