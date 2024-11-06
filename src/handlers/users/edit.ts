import { updateUser } from "../../db/user/index.ts";
import { buildErrorResponse, buildSuccessResponse } from "../../helpers/buildResponse.ts";

import { User, type AuthenticatedRequest } from '../../types/types.ts';

export default async (req: AuthenticatedRequest) => {
  const options: Partial<User> = await req.json();
  const userId = req.userId;

  if (options.email || options.refresh_token || options.username || options.id) {
    return buildErrorResponse('Protected fields received', 400);
  }

  try {
    const user = await updateUser(userId, options);
    return buildSuccessResponse(user);
  } catch (e) {
    console.error(e);
    return buildErrorResponse();
  }
}