import { DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { docClient, TABLE_NAME } from "../db";

export async function deleteData(userId: string, id: string): Promise<void> {
  await docClient.send(new DeleteCommand({ TableName: TABLE_NAME, Key: { userId, id } }));
}
