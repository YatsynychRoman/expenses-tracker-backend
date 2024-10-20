import { verify } from "https://deno.land/x/djwt@v3.0.2/mod.ts";
import { type Handler } from '@std/http';
import key from '../helpers/jwtKey.ts'

// Probably could have been done better :)
export default async (handler: Handler, req: Request, info?: Deno.ServeHandlerInfo, params?: URLPatternResult | null ): Promise<Response> => {
  const token = req.headers.get('Authorization');

  if (!token) {
    return new Response('No Authorization header was provided', { status: 401 });
  }

  try {
    const payload = await verify(token, key);
    if (typeof payload.userId !== 'number') {
      return new Response('Authorization token is invalid', { status: 401 });
    }

    const parsedHeaders: { [key: string]: string } = {};
    req.headers.forEach((value, key) => {
      parsedHeaders[key] = value;
    })

    const appendedRequest = new Request(req, {
      headers: {
        ...parsedHeaders,
        userId: payload.userId.toString(),
      },
    });

    return handler(appendedRequest, info, params);
  } catch (e) {
    console.error(e);
    return new Response('Authorization token is invalid', { status: 401 });
  }
}