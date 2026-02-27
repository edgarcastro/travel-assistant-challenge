import {
  DynamoDBClient,
  CreateTableCommand,
  ListTablesCommand,
} from "@aws-sdk/client-dynamodb";

const TABLE_NAME = "travels";

const client = new DynamoDBClient({
  endpoint: "http://localhost:8000",
  region: "us-east-1",
  credentials: { accessKeyId: "local", secretAccessKey: "local" },
});

export async function setup() {
  const { TableNames } = await client.send(new ListTablesCommand({}));

  if (TableNames?.includes(TABLE_NAME)) {
    console.log(`Table "${TABLE_NAME}" already exists. Skipping.`);
    return;
  }

  await client.send(
    new CreateTableCommand({
      TableName: TABLE_NAME,
      AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
      KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
      BillingMode: "PAY_PER_REQUEST",
    })
  );

  console.log(`Table "${TABLE_NAME}" created successfully.`);
}

