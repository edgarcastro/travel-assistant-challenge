import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { docClient, TABLE_NAME } from "./db";

export const handler = async () => {
  const result = await docClient.send(new ScanCommand({ TableName: TABLE_NAME }));

  return {
    statusCode: 200,
    body: JSON.stringify(result.Items ?? []),
  };
};
