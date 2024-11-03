import { deleteUser } from "../../db/user/index.ts";
import { buildErrorResponse, buildSuccessResponse } from "../../helpers/buildResponse.ts";

export default async (req: Request) => {
  const userId = req.headers.get('userId');
  if (!userId) {
    return buildErrorResponse('Unathorized', 401);
  }

  try {
    await deleteUser(userId);
    return buildSuccessResponse(null, 204);
  } catch (e) {
    console.error(e);
    return buildErrorResponse()
  }
}