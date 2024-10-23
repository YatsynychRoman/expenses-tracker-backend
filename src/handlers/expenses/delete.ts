import { deleteExpense } from '../../db/expenses/index.ts';

export default async (req: Request) => {
  const userId = req.headers.get('userId');
  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { id } = await req.json();

  try {
    await deleteExpense(id, Number(userId));
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return new Response('Internal Server Error', { status: 500 });
  }
};