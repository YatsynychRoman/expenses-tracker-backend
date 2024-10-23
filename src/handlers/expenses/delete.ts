import { deleteExpense } from '../../db/expenses/index.ts';

export default async (req: Request, _info: unknown, params?: URLPatternResult | null) => {
  const userId = req.headers.get('userId');
  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const id = params?.pathname.groups.id;

  if (!id) {
    return new Response('Bad request', { status: 400 });
  }

  try {
    await deleteExpense(Number(id), Number(userId));
    return new Response(null, { status: 204 });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Expense not found')) {
      return new Response('Not found', { status: 404 });
    }
    console.error(error);
    return new Response('Internal Server Error', { status: 500 });
  }
};