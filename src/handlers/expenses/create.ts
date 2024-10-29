import { createExpense } from '../../db/expenses/index.ts';

import { buildErrorResponse, buildSuccessResponse } from '../../helpers/buildResponse.ts';

export default async (req: Request) => {
  const userId = req.headers.get('userId');
  if (!userId) {
    return buildErrorResponse('Unauthorized', 401);
  }

  const { categoryId, amount, description } = await req.json();

  const expense = await createExpense({ user_id: Number(userId), category_id: categoryId, amount, description });
  return buildSuccessResponse({ id: expense.id, categoryId: expense.category_id, amount: expense.amount, description: expense.description }, 201);
};
