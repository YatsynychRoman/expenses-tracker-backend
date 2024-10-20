import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
import { create, getNumericDate } from "https://deno.land/x/djwt@v3.0.2/mod.ts";

import { getUserByLogin, updateUserRefreshToken } from '../../db/auth/index.ts';

import key from '../../helpers/jwtKey.ts';

export default async (req: Request): Promise<Response> => {
  const { login, password } = await req.json();
  const user = await getUserByLogin(login);

  if (!user) {
    return new Response('Username or password is incorrect', { status: 404 });
  }

  const passwordCorrect = await bcrypt.compare(password, user.password);
  if (!passwordCorrect) {
    return new Response('Username or password is incorrect', { status: 404 });
  }
  const accessToken = await create({ alg: "HS512", typ: "JWT", exp: getNumericDate(60 * 60) }, { userId: user.id }, key);
  const refreshToken = await create({ alg: "HS512", typ: "JWT", exp: getNumericDate(60 * 60 * 24 * 30) }, { userId: user.id }, key);

  try {
    await updateUserRefreshToken({ userId: user.id, refreshToken });
  } catch {
    return new Response('Internal server error', { status: 500 });
  }

  return new Response(JSON.stringify({ accessToken, refreshToken }), { status: 200, headers: { "Content-Type": "application/json" }});
}