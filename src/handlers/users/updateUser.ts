import { updateUser } from "../../db/user/index.ts";
import { buildErrorResponse, buildSuccessResponse } from "../../helpers/buildResponse.ts";
import { User } from '../../types/types.ts';

export default async (req: Request) => {
  const options: Partial<User> = await req.json();
  const userId = req.headers.get('userId');

  if (!userId) {
    return buildErrorResponse('Unathorized', 401);
  }

  try {
    const user = await updateUser(userId, options);
    return buildSuccessResponse(user);
  } catch (e) {
    console.error(e);
    return buildErrorResponse();
  }
}