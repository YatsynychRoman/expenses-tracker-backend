import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
import { create, getNumericDate } from "https://deno.land/x/djwt@v3.0.2/mod.ts";

import { createNewUser, getUserByLogin } from '../../db/user/index.ts';

import key from '../../helpers/jwtKey.ts';
import { buildErrorResponse, buildSuccessResponse } from '../../helpers/buildResponse.ts';

import { User } from '../../types/types.ts';

export default async (req: Request): Promise<Response> => {
  const { email, username, password, name, surname, currency } = (await req.json()) as Omit<User, 'id'>;
  if (!email || !username || !password || !name || !surname || !currency) {
    return buildErrorResponse('Some fields are missing', 400);
  }

  const userByEmail = await getUserByLogin(email);

  if (userByEmail) {
    return buildErrorResponse('User with this email already exists', 409);
  }

  const userByUsername = await getUserByLogin(username);

  if (userByUsername) {
    return buildErrorResponse('User with this username already exists', 409);
  }

  const salt = await bcrypt.genSalt(8);
  const passwordHash = await bcrypt.hash(password, salt);

  try {
    await createNewUser({ username, email, password: passwordHash, name, surname, currency });
    const createdUser = await getUserByLogin(username);

    if (!createdUser) {
      return buildErrorResponse();
    }

    const accessToken = await create({ alg: "HS512", typ: "JWT", exp: getNumericDate(60 * 60) }, { userId: createdUser.id }, key);
    const refreshToken = await create({ alg: "HS512", typ: "JWT", exp: getNumericDate(60 * 60 * 24 * 30) }, { userId: createdUser.id }, key);
    return buildSuccessResponse({ accessToken, refreshToken });
  } catch (e) {
    console.error(e);
    return buildErrorResponse();
  }
}
