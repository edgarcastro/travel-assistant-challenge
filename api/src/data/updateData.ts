import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { docClient, TABLE_NAME } from "../db";
import type { TravelEntry } from "shared";

export async function updateData(
  userId: string,
  id: string,
  fields: { priority?: "low" | "medium" | "high"; notes?: string }
): Promise<TravelEntry> {
  const result = await docClient.send(
    new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { userId, id },
      UpdateExpression:
        "SET priority = :priority, notes = :notes, updatedAt = :updatedAt",
      ExpressionAttributeValues: {
        ":priority": fields.priority ?? null,
        ":notes": fields.notes ?? null,
        ":updatedAt": new Date().toISOString(),
      },
      ReturnValues: "ALL_NEW",
    })
  );
  return result.Attributes as TravelEntry;
}
