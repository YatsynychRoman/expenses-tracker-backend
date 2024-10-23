import { createExpense } from '../../db/expenses/index.ts';

export default async (req: Request) => {
  const userId = req.headers.get('userId');
  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { categoryId, amount, description } = await req.json();

  const expense = await createExpense({ user_id: Number(userId), category_id: categoryId, amount, description });
  return new Response(JSON.stringify({ id: expense.id, categoryId: expense.category_id, amount: expense.amount, description: expense.description }), { status: 201 });
};