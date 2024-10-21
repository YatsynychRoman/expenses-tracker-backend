import { editCategory, getCategory } from '../../db/categories/index.ts';

export default async (req: Request, _info: unknown, params?: URLPatternResult | null) => {
  const categoryId = params?.pathname.groups.id;
  const { name } = await req.json();
  const userId = req.headers.get('userId');

  if (!categoryId) {
    return new Response('Bad request', { status: 400 });
  }

  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const category = await getCategory(Number(categoryId), userId);

  if (!category) {
    return new Response('Category not found', { status: 404 });
  }

  if (category.user_id !== Number(userId)) {
    return new Response('Not permitted', { status: 403 });
  }

  await editCategory(Number(categoryId), name);

  return new Response('Category renamed', { status: 200 });
}
