import { createCategory, getCategoryByName } from '../../db/categories/index.ts';
import { buildErrorResponse, buildSuccessResponse } from '../../helpers/buildResponse.ts';

import type { AuthenticatedRequest } from "../../types/types.ts";

export default async (req: AuthenticatedRequest) => {
  const userId = req.userId;
  const { name } = await req.json();
  try {
    const existingCategory = await getCategoryByName(userId, name);
    if (existingCategory) {
      return buildErrorResponse('Category with this name already exists', 400);
    }
  
    await createCategory(userId, name);
    const createdCategory = await getCategoryByName(userId, name);
    return buildSuccessResponse(createdCategory, 201);
  } catch (e) {
    console.error(e);
    return buildErrorResponse();
  }
}
