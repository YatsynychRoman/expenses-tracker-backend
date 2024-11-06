import { getTrends } from '../../db/expenses/index.ts';
import { buildErrorResponse, buildSuccessResponse } from '../../helpers/buildResponse.ts';

import type { AuthenticatedRequest } from "../../types/types.ts";

export default async (req: AuthenticatedRequest, _info?: Deno.ServeHandlerInfo, params?: URLPatternResult | null) => {
  const userId = req.userId;

  const searchParams = new URLSearchParams(params?.search.input);
  const dateFrom = searchParams.get('dateFrom');
  const dateTo = searchParams.get('dateTo');
  const categoryId = searchParams.get('categoryId');
  const type = searchParams.get('type');

  try {
    const trends = await getTrends(userId, { dateFrom, dateTo, categoryId: Number(categoryId), type });
    const response = [];
    for (const trend of trends) {
      response.push({
        month: trend.month.toLocaleDateString('en-US', { month: 'long' }),
        amount: trend.amount,
      });
    }
    return buildSuccessResponse(response, 200);
  } catch (e) {
    console.error(e);
    return buildErrorResponse();
  }
};
