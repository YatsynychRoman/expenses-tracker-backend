import { getUserByLogin } from '../../db/user/index.ts';
import { buildErrorResponse, buildSuccessResponse } from '../../helpers/buildResponse.ts';

export default async (req: Request) => {
  const { username } = await req.json();
  const userFound = await getUserByLogin(username);
  if (userFound) {
    return buildErrorResponse('Username you specified is already taken', 409);
  }

  return buildSuccessResponse(undefined, 204);
}
