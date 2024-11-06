import { getUserById } from "../../db/user/index.ts";
import { buildErrorResponse, buildSuccessResponse } from '../../helpers/buildResponse.ts';

import type { AuthenticatedRequest } from "../../types/types.ts";

export default async (req: AuthenticatedRequest) => {
  const userId = req.userId;

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
