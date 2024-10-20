import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
import { getUserByLogin } from '../../db/auth/index.ts';

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

  return new Response('Success', { status: 200 });
}