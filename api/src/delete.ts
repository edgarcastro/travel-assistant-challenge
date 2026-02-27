import { DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { docClient, TABLE_NAME } from "./db";

export const handler = async (event: any) => {
  const { id } = event.pathParameters;

  await docClient.send(
    new DeleteCommand({ TableName: TABLE_NAME, Key: { id } })
  );

  return {
    statusCode: 204,
    body: "",
  };
};
