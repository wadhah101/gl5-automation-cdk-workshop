import { Context, APIGatewayProxyResult, APIGatewayEvent } from "aws-lambda";
import { env } from "process";

const { TARGET_QUEUE_NAME } = env;

export const handler = async (
  event: APIGatewayEvent,
  _: Context
): Promise<APIGatewayProxyResult> => {
  if (!TARGET_QUEUE_NAME)
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Please specify a queue in env" }),
    };

  if (event.httpMethod !== "POST")
    return {
      statusCode: 200,
      body: JSON.stringify(event),
    };

  const { url } = JSON.parse(event.body!!);

  if (!url)
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Please specify a url in post body" }),
    };

  return {
    statusCode: 200,
    body: JSON.stringify({ url }),
  };
};
