import { verify } from "https://deno.land/x/djwt@v3.0.2/mod.ts";
import { type Handler } from '@std/http';
import key from '../helpers/jwtKey.ts'

const UNAUTHORIZED_STATUS = 401;

interface AuthenticatedRequest extends Request {
  userId: number;
}

export default function withAuthentication(handler: Handler): Handler {
  return async (req: Request, info?: Deno.ServeHandlerInfo, params?: URLPatternResult | null): Promise<Response> => {
    const token = req.headers.get('Authorization');

    if (!token) {
      return createErrorResponse('No Authorization header was provided');
    }

    try {
      const payload = await verifyToken(token);
      const authenticatedReq = createAuthenticatedRequest(req, payload.userId);
      return handler(authenticatedReq, info, params);
    } catch (e) {
      console.error(e);
      return createErrorResponse('Authorization token is invalid');
    }
  };
}

async function verifyToken(token: string): Promise<{ userId: number }> {
  const payload = await verify(token, key);
  if (typeof payload.userId !== 'number') {
    throw new Error('Invalid userId in token');
  }
  return payload as { userId: number };
}

function createAuthenticatedRequest(req: Request, userId: number): AuthenticatedRequest {
  const newHeaders = new Headers(req.headers);
  newHeaders.set('userId', userId.toString());

  return Object.assign(
    new Request(req, { headers: newHeaders }),
    { userId }
  ) as AuthenticatedRequest;
}

function createErrorResponse(message: string): Response {
  return new Response(message, { status: UNAUTHORIZED_STATUS });
}
