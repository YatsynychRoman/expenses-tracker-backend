import key from "../../helpers/jwtKey.ts";
import { create, getNumericDate, verify } from "https://deno.land/x/djwt@v3.0.2/mod.ts";

import { getUserByIdAndRefreshToken, updateUserRefreshToken } from '../../db/auth/index.ts';

import { buildErrorResponse, buildSuccessResponse } from '../../helpers/buildResponse.ts';

export default async (req: Request) => {
  const refreshToken = req.headers.get('Authorization');
  if (!refreshToken) {
    return buildErrorResponse('No Authorization header was provided', 400);
  }
  let payload;
  try {
    payload = await verify(refreshToken, key);
  } catch {
    return buildErrorResponse('Bad token', 400);
  }

  if (!payload.userId || typeof payload.userId !== 'number') {
    return buildErrorResponse('Bad token', 400);
  }

  const user = await getUserByIdAndRefreshToken({ userId: payload.userId, refreshToken });

  if (!user) {
    return buildErrorResponse('Bad token', 400);
  }

  const newAccessToken = await create({ alg: "HS512", typ: "JWT", exp: getNumericDate(60 * 60) }, { userId: user.id }, key);
  const newRefreshToken = await create({ alg: "HS512", typ: "JWT", exp: getNumericDate(60 * 60 * 24 * 30) }, { userId: user.id }, key);

  try {
    await updateUserRefreshToken({ userId: user.id, refreshToken: newRefreshToken });
  } catch {
    return buildErrorResponse();
  }

  return buildSuccessResponse({ accessToken: newAccessToken, refreshToken: newRefreshToken });
}
