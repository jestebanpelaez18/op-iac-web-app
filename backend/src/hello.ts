import { APIGatewayProxyHandlerV2 } from 'aws-lambda';

export const hello: APIGatewayProxyHandlerV2 = async (event:any) => {
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: 'Hello OP, from AWS Lambda 👋',
      path: event.rawPath,
      time: new Date().toISOString(),
    }),
  };
};

