import { getCategories } from '../../db/categories/index.ts';

import { buildErrorResponse, buildSuccessResponse } from '../../helpers/buildResponse.ts';
import type { AuthenticatedRequest } from "../../types/types.ts";

export default async (req: AuthenticatedRequest) => {
  const userId = req.userId;

  try {
    const categories = await getCategories(userId);
    return buildSuccessResponse(categories);
  } catch (e) {
    console.error(e);
    return buildErrorResponse();
  }
}
