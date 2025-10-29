export const handler = async (event: any) => {
  return {
    statusCode: 200,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      message: 'Hello OP, from the backend',
      path: event.rawPath,
      time: new Date().toISOString(),
    }),
  };
};
