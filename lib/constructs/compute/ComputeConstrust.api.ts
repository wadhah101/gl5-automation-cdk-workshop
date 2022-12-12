import { Context, APIGatewayProxyResult, APIGatewayEvent } from "aws-lambda";
import { env } from "process";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

const { TARGET_QUEUE_URL, TARGET_TABLE_NAME } = env;

const sqsClient = new SQSClient({ region: "us-east-1" });

export const handler = async (
  event: APIGatewayEvent,
  _: Context
): Promise<APIGatewayProxyResult> => {
  if (!TARGET_QUEUE_URL)
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Please specify a queue in env" }),
    };

  if (!TARGET_TABLE_NAME)
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Please specify a table in env" }),
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

  const message = { url };
  const sqsCommand = new SendMessageCommand({
    MessageBody: JSON.stringify(message),
    QueueUrl: TARGET_QUEUE_URL,
  });

  const response = await sqsClient.send(sqsCommand);

  return {
    statusCode: 200,
    body: JSON.stringify({ response }),
  };
};
