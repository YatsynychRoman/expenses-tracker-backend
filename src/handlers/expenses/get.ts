import { getExpenses, getExpensesByDate } from '../../db/expenses/index.ts';

export default async (req: Request, info?: Deno.ServeHandlerInfo, params?: URLPatternResult | null) => {
  const userId = req.headers.get('userId');
  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const searchParams = new URLSearchParams(params?.search.input);
  const dateFrom = searchParams.get('dateFrom');
  const dateTo = searchParams.get('dateTo');
  const categoryId = searchParams.get('categoryId');

  const expenses = await getExpenses(Number(userId), { dateFrom, dateTo, categoryId: Number(categoryId) });
  return new Response(JSON.stringify(expenses), { status: 200 });
};  