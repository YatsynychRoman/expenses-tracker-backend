import { createExpense } from '../../db/expenses/index.ts';

import { buildErrorResponse, buildSuccessResponse } from '../../helpers/buildResponse.ts';

import type { AuthenticatedRequest } from "../../types/types.ts";

export default async (req: AuthenticatedRequest) => {
  const userId = req.userId;

  const { categoryId, amount, description } = await req.json();
  try {
    const expense = await createExpense({ user_id: Number(userId), category_id: categoryId, amount, description });
    return buildSuccessResponse({ id: expense.id, categoryId: expense.category_id, amount: expense.amount, description: expense.description }, 201);
  } catch (e) {
    console.error(e);
    return buildErrorResponse();
  }
};
