import { getUserById } from "../../db/auth/index.ts";

export default async (req: Request) => {
  const userId = req.headers.get('userId');
  if (!userId) {
    return new Response('Unathorized', { status: 401 });
  }

  try {
    const user = await getUserById(userId);
    if (!user) {
      return new Response('Not found', { status: 404 });
    }
  
    return new Response(JSON.stringify(user), { headers: { 'Content-Type': 'application/json' } });
  } catch {
    return new Response('Internal server error', { status: 500 });
  };
}
