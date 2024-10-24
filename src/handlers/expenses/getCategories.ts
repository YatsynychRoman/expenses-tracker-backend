import { getExpensesByCategories } from '../../db/expenses/index.ts';

export default async (req: Request) => {
  const userId = req.headers.get('userId');
  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const expensesByCategories = await getExpensesByCategories(userId);
  return new Response(JSON.stringify(expensesByCategories), { status: 200 });
};

