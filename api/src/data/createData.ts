import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { docClient, TABLE_NAME } from "../db";
import type { TravelEntry } from "shared";

export async function createData(item: TravelEntry & { id: string }): Promise<TravelEntry> {
  await docClient.send(new PutCommand({ TableName: TABLE_NAME, Item: item }));
  return item;
}
