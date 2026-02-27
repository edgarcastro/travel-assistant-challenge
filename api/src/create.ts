import { randomUUID } from "node:crypto";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { docClient, TABLE_NAME } from "./db";
import type { TravelItem } from "shared";

export const handler = async (event: any) => {
  const body = JSON.parse(event.body ?? "{}");
  const now = new Date().toISOString();

  const item: TravelItem = {
    id: randomUUID(),
    destination: body.destination,
    description: body.description,
    createdAt: now,
    updatedAt: now,
  };

  await docClient.send(new PutCommand({ TableName: TABLE_NAME, Item: item }));

  return {
    statusCode: 201,
    body: JSON.stringify(item),
  };
};
