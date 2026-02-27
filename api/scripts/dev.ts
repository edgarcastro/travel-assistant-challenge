import { execSync, spawn } from "node:child_process";
import { DynamoDBClient, ListTablesCommand } from "@aws-sdk/client-dynamodb";
import { setup } from "./setup-local-db";

async function waitForDynamo(retries = 20, delayMs = 500): Promise<void> {
  const client = new DynamoDBClient({
    endpoint: "http://localhost:8000",
    region: "us-east-1",
    credentials: { accessKeyId: "local", secretAccessKey: "local" },
  });

  for (let i = 0; i < retries; i++) {
    try {
      await client.send(new ListTablesCommand({}));
      console.log("DynamoDB Local is ready.");
      return;
    } catch {
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }

  throw new Error("DynamoDB Local did not become ready in time.");
}

function stopDb() {
  console.log("\nStopping DynamoDB Local...");
  execSync("docker compose down", { stdio: "inherit" });
}

(async function main() {
  // Start DynamoDB Local
  console.log("Starting DynamoDB Local...");
  execSync("docker compose up -d", { stdio: "inherit" });

  // Wait for readiness, run table setup
  await waitForDynamo();
  await setup();

  // Start Serverless Offline
  const api = spawn("serverless", ["offline", "--reloadHandler"], {
    stdio: "inherit",
    shell: true,
  });

  // Stop DB when API process exits
  api.on("exit", () => {
    stopDb();
    process.exit(0);
  });

  // Stop DB on Ctrl+C / SIGTERM
  process.on("SIGINT", () => {
    api.kill("SIGINT");
  });

  process.on("SIGTERM", () => {
    api.kill("SIGTERM");
  });
})();
