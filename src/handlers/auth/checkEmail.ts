import { getUserByLogin } from '../../db/user/index.ts';
import { buildErrorResponse, buildSuccessResponse } from '../../helpers/buildResponse.ts';

export default async (req: Request) => {
  const { email } = await req.json();
  const userFound = await getUserByLogin(email);
  if (userFound) {
    return buildErrorResponse('Email you specified is already taken', 409);
  }

  return buildSuccessResponse(undefined, 204);
}
