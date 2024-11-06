import { editExpense } from '../../db/expenses/index.ts';
import { buildErrorResponse, buildSuccessResponse } from '../../helpers/buildResponse.ts';

import type { AuthenticatedRequest } from "../../types/types.ts";

export default async (req: AuthenticatedRequest, _info: unknown, params?: URLPatternResult | null) => {
  const userId = req.userId;
  const id = params?.pathname.groups.id;
  let requestBody;
  try {
    requestBody = await req.json();
  } catch (error) {
    console.error(error);
    return buildErrorResponse('Bad request', 400);
  }

  const { categoryId, amount, description } = requestBody;

  if (!id) {
    return buildErrorResponse('Bad request',  400);
  }

  try {
    const expense = await editExpense(Number(id), userId, {category_id: categoryId, amount, description });
    return buildSuccessResponse({ id: expense.id, categoryId: expense.category_id, amount: expense.amount, description: expense.description });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Expense not found')) {
      return buildErrorResponse('Not found', 404);
    }
    console.error(error);
    return buildErrorResponse();
  }
};
