import key from "../../helpers/jwtKey.ts";
import { create, getNumericDate, verify } from "https://deno.land/x/djwt@v3.0.2/mod.ts";

import { getUserByIdAndRefreshToken, updateUserRefreshToken } from '../../db/auth/index.ts';

export default async (req: Request) => {
  const refreshToken = req.headers.get('Authorization');
  if (!refreshToken) {
    return new Response('No Authorization header was provided', { status: 400 });
  }
  const payload = await verify(refreshToken, key);

  if (!payload.userId || typeof payload.userId !== 'number') {
    return new Response('Bad token', { status: 400 });
  }

  const user = await getUserByIdAndRefreshToken({ userId: payload.userId, refreshToken });

  if (!user) {
    return new Response('Bad token', { status: 400 });
  }

  const newAccessToken = await create({ alg: "HS512", typ: "JWT", exp: getNumericDate(60 * 60) }, { userId: user.id }, key);
  const newRefreshToken = await create({ alg: "HS512", typ: "JWT", exp: getNumericDate(60 * 60 * 24 * 30) }, { userId: user.id }, key);

  try {
    await updateUserRefreshToken({ userId: user.id, refreshToken: newRefreshToken });
  } catch {
    return new Response('Internal server error', { status: 500 });
  }

  return new Response(JSON.stringify({ accessToken: newAccessToken, refreshToken: newRefreshToken }), { status: 200, headers: { "Content-Type": "application/json" }});
}