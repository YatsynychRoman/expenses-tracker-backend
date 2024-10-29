import { createCategory, getCategoryByName } from '../../db/categories/index.ts';
import { buildErrorResponse, buildSuccessResponse } from '../../helpers/buildResponse.ts';

export default async (req: Request) => {
  const userId = req.headers.get('userId');
  const { name } = await req.json();

  if (!userId) {
    return buildErrorResponse('Unauthorized', 401);
  }

  // Check if the category already exists for this user
  const existingCategory = await getCategoryByName(userId, name);
  if (existingCategory) {
    return buildErrorResponse('Category with this name already exists', 400);
  }

  await createCategory(userId, name);
  const createdCategory = await getCategoryByName(userId, name);
  return buildSuccessResponse(createdCategory, 201);
}
