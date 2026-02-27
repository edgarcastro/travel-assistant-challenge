import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { docClient, TABLE_NAME } from "../db";
import type { TravelEntry } from "shared";

export async function readData(userId: string): Promise<TravelEntry[]> {
  const result = await docClient.send(
    new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: { ":userId": userId },
    })
  );
  return (result.Items ?? []) as TravelEntry[];
}
