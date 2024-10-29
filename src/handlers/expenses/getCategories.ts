import { getExpensesByCategories } from '../../db/expenses/index.ts';
import { buildErrorResponse, buildSuccessResponse } from '../../helpers/buildResponse.ts';

export default async (req: Request) => {
  const userId = req.headers.get('userId');
  if (!userId) {
    return buildErrorResponse('Unauthorized', 401);
  }

  const expensesByCategories = await getExpensesByCategories(userId);
  return buildSuccessResponse(expensesByCategories, 200);
};

