import serverless from "serverless-http";
import { app, ensureDatabase } from "../../../server/index.js";

const serverlessHandler = serverless(app);

let ready: Promise<void> | null = null;

export async function handler(event: unknown, context: unknown) {
  if (!ready) ready = ensureDatabase();
  await ready;
  return serverlessHandler(event, context);
}
