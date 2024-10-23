import { editExpense } from '../../db/expenses/index.ts';

export default async (req: Request, _info: unknown, params?: URLPatternResult | null) => {
  const userId = req.headers.get('userId');
  const id = params?.pathname.groups.id;
  let requestBody;
  try {
    requestBody = await req.json();
  } catch (error) {
    console.error(error);
    return new Response('Bad request', { status: 400 });
  }

  const { categoryId, amount, description } = requestBody;

  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  if (!id) {
    return new Response('Bad request', { status: 400 });
  }

  try {
    const expense = await editExpense(Number(id), Number(userId), {category_id: categoryId, amount, description });
    return new Response(JSON.stringify({ id: expense.id, categoryId: expense.category_id, amount: expense.amount, description: expense.description }), { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Expense not found')) {
      return new Response('Not found', { status: 404 });
    }
    console.error(error);
    return new Response('Internal Server Error', { status: 500 });
  }
};