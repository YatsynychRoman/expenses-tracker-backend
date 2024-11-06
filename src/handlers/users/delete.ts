import { deleteUser } from "../../db/user/index.ts";
import { buildErrorResponse, buildSuccessResponse } from "../../helpers/buildResponse.ts";

import type { AuthenticatedRequest } from "../../types/types.ts";

export default async (req: AuthenticatedRequest) => {
  const userId = req.userId;

  try {
    await deleteUser(userId);
    return buildSuccessResponse(null, 204);
  } catch (e) {
    console.error(e);
    return buildErrorResponse()
  }
}