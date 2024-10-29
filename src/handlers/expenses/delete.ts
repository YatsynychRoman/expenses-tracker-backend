import { deleteExpense } from '../../db/expenses/index.ts';
import { buildErrorResponse, buildSuccessResponse } from '../../helpers/buildResponse.ts';

export default async (req: Request, _info: unknown, params?: URLPatternResult | null) => {
  const userId = req.headers.get('userId');
  if (!userId) {
    return buildErrorResponse('Unauthorized', 401);
  }

  const id = params?.pathname.groups.id;

  if (!id) {
    return buildErrorResponse('Bad request', 400);
  }

  try {
    await deleteExpense(Number(id), Number(userId));
    return buildSuccessResponse(undefined, 204);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Expense not found')) {
      return buildErrorResponse('Not found', 404);
    }
    console.error(error);
    return buildErrorResponse();
  }
};
