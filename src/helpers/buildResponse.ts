export const buildSuccessResponse = (body?: object, status?: number) => {
  return new Response(
    body ? JSON.stringify(body) : null,
    {
      status: status || 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    }
  );
}

export const buildErrorResponse = (message: string, status: number) => {
  if (!message && !status) {
    return new Response(
      'Internal server error',
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    )
  }

  return new Response(
    JSON.stringify({ message }),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    }
  )
}
