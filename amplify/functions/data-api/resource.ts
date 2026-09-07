import { defineFunction, secret } from "@aws-amplify/backend";

export const dataApiFunction = defineFunction({
  name: "data-api",
  entry: "./handler.ts",
  runtime: 22,
  timeoutSeconds: 300,
  memoryMB: 1024,
  environment: {
    JWT_SECRET: secret("JWT_SECRET"),
    OWNER_EMAIL: "alex.kumar@ingeniocare.com",
    CORS_ORIGIN: "*",
    DB_NAME: "ingeniocare",
    OPENAI_API_KEY: secret("OPENAI_API_KEY"),
    OPENAI_IMAGE_MODEL: "gpt-image-1",
  },
});
