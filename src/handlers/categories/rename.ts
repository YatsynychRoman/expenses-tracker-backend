import { editCategory, getCategory, getCategoryByName } from '../../db/categories/index.ts';
import { buildErrorResponse, buildSuccessResponse } from '../../helpers/buildResponse.ts';

import type { AuthenticatedRequest } from "../../types/types.ts";

export default async (req: AuthenticatedRequest, _info: unknown, params?: URLPatternResult | null) => {
  const categoryId = params?.pathname.groups.id;
  const { name } = await req.json();
  const userId = req.userId;

  if (!categoryId) {
    return buildErrorResponse('Bad request', 400);
  }
  try {
    const category = await getCategory(Number(categoryId), userId);

    if (!category) {
      return buildErrorResponse('Category not found', 404);
    }
  
    if (category.user_id !== Number(userId)) {
      return buildErrorResponse('Not permitted', 403);
    }
  
    await editCategory(Number(categoryId), name);
    const newCategory = await getCategoryByName(userId, name)
    return buildSuccessResponse(newCategory);
  } catch (e) {
    console.error(e);
    return buildErrorResponse();
  }
}
