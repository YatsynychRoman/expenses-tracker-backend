import { getCategories } from '../../db/categories/index.ts';

import { buildErrorResponse, buildSuccessResponse } from '../../helpers/buildResponse.ts';

export default async (req: Request) => {
  const userId = req.headers.get('userId');
  if (!userId) {
    return buildErrorResponse('Unauthorized', 401);
  }

  const categories = await getCategories(userId);
  return buildSuccessResponse(categories);
}
