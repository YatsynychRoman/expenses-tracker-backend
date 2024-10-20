import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

import { createNewUser, getUserByLogin } from '../../db/auth/index.ts';

export default async (req: Request): Promise<Response> => {
  const { email, username, password } = await req.json();
  if (!email || !username || !password) {
    return new Response('Email, username or password is missing', { status: 400 });
  }

  const userByEmail = await getUserByLogin(email);

  if (userByEmail) {
    return new Response('User with this email already exists', { status: 400 });
  }

  const userByUsername = await getUserByLogin(username);

  if (userByUsername) {
    return new Response('User with this username already exists', { status: 400 });
  }

  const salt = await bcrypt.genSalt(8);
  const passwordHash = await bcrypt.hash(password, salt);

  try {
    await createNewUser({ username, email, password: passwordHash });
    return new Response('Success', { status: 200 });
  } catch (e) {
    console.error(e);
    return new Response('Internal server error', { status: 500 });
  }
}