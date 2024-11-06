import { getExpenses } from '../../db/expenses/index.ts';
import { buildErrorResponse, buildSuccessResponse } from '../../helpers/buildResponse.ts';
import type { AuthenticatedRequest } from "../../types/types.ts";

export default async (req: AuthenticatedRequest, _info?: Deno.ServeHandlerInfo, params?: URLPatternResult | null) => {
  const userId = req.userId;

  const searchParams = new URLSearchParams(params?.search.input);
  const dateFrom = searchParams.get('dateFrom');
  const dateTo = searchParams.get('dateTo');
  const categoryId = searchParams.get('categoryId');

  try {
    const expenses = await getExpenses(userId, { dateFrom, dateTo, categoryId: Number(categoryId) });
    return buildSuccessResponse(expenses);
  } catch (e) {
    console.error(e);
    return buildErrorResponse();
  }
};
