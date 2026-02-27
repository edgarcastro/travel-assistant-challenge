import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { docClient, TABLE_NAME } from "./db";

export const handler = async (event: any) => {
  const { id } = event.pathParameters;
  const body = JSON.parse(event.body ?? "{}");

  const result = await docClient.send(
    new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { id },
      UpdateExpression:
        "SET destination = :destination, description = :description, updatedAt = :updatedAt",
      ExpressionAttributeValues: {
        ":destination": body.destination,
        ":description": body.description ?? null,
        ":updatedAt": new Date().toISOString(),
      },
      ReturnValues: "ALL_NEW",
    })
  );

  return {
    statusCode: 200,
    body: JSON.stringify(result.Attributes),
  };
};
