import { getExpensesByCategories } from '../../db/expenses/index.ts';
import { buildErrorResponse, buildSuccessResponse } from '../../helpers/buildResponse.ts';

import type { AuthenticatedRequest } from "../../types/types.ts";

export default async (req: AuthenticatedRequest) => {
  const userId = req.userId;

  try {
    const expensesByCategories = await getExpensesByCategories(userId);
    return buildSuccessResponse(expensesByCategories, 200);
  } catch (e) {
    console.error(e);
    return buildErrorResponse();
  }
};

