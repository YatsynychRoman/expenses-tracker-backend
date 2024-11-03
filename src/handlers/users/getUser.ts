import { getUserById } from "../../db/user/index.ts";
import { buildErrorResponse, buildSuccessResponse } from '../../helpers/buildResponse.ts';

export default async (req: Request) => {
  const userId = req.headers.get('userId');
  if (!userId) {
    return buildErrorResponse('Unathorized', 401);
  }

  try {
    const user = await getUserById(userId);
    if (!user) {
      return buildErrorResponse('Not found', 404);
    }

    return buildSuccessResponse(user);
  } catch {
    return buildErrorResponse();
  }
}
