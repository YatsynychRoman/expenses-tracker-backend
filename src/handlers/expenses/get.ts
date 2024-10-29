import { getExpenses } from '../../db/expenses/index.ts';
import { buildErrorResponse, buildSuccessResponse } from '../../helpers/buildResponse.ts';

export default async (req: Request, _info?: Deno.ServeHandlerInfo, params?: URLPatternResult | null) => {
  const userId = req.headers.get('userId');
  if (!userId) {
    return buildErrorResponse('Unauthorized', 401);
  }

  const searchParams = new URLSearchParams(params?.search.input);
  const dateFrom = searchParams.get('dateFrom');
  const dateTo = searchParams.get('dateTo');
  const categoryId = searchParams.get('categoryId');

  const expenses = await getExpenses(Number(userId), { dateFrom, dateTo, categoryId: Number(categoryId) });
  return buildSuccessResponse(expenses);
};
