import { deleteExpense } from '../../db/expenses/index.ts';
import { buildErrorResponse, buildSuccessResponse } from '../../helpers/buildResponse.ts';

import type { AuthenticatedRequest } from "../../types/types.ts";

export default async (req: AuthenticatedRequest, _info: unknown, params?: URLPatternResult | null) => {
  const userId = req.userId;

  const id = params?.pathname.groups.id;

  if (!id) {
    return buildErrorResponse('Bad request', 400);
  }

  try {
    await deleteExpense(Number(id), userId);
    return buildSuccessResponse(undefined, 204);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Expense not found')) {
      return buildErrorResponse('Not found', 404);
    }
    console.error(error);
    return buildErrorResponse();
  }
};
