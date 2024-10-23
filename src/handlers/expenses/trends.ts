import { getTrends } from '../../db/expenses/index.ts';

export default async (req: Request, _info?: Deno.ServeHandlerInfo, params?: URLPatternResult | null) => {
  const userId = req.headers.get('userId');
  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const searchParams = new URLSearchParams(params?.search.input);
  const dateFrom = searchParams.get('dateFrom');
  const dateTo = searchParams.get('dateTo');
  const categoryId = searchParams.get('categoryId');
  const type = searchParams.get('type');
  
  const trends = await getTrends(Number(userId), { dateFrom, dateTo, categoryId: Number(categoryId), type });
  const response = [];
  for (const trend of trends) {
    response.push({
      month: trend.month.toLocaleDateString('en-US', { month: 'long' }),
      amount: trend.amount,
    });
  }
  return new Response(JSON.stringify(response), { status: 200 });
};