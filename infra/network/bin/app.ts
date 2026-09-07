#!/usr/bin/env node
import { App } from "aws-cdk-lib";
import { ACCOUNT_ID, REGION } from "../lib/ids";
import { IngenioNetworkStack } from "../lib/ingenio-network-stack";

const app = new App();
const mode = String(app.node.tryGetContext("ingenioNetworkMode") || "");

if (mode !== "synth" && mode !== "import") {
  throw new Error(
    "IngenioNetwork is not wired to Amplify and must not be deployed yet. Use npm run network:synth. Step 3 is CloudFormation import after Population releases ownership."
  );
}

new IngenioNetworkStack(app, "IngenioNetwork", {
  description: "Account VPC and Aurora. Independent of Amplify apps.",
  terminationProtection: true,
  env: {
    account: ACCOUNT_ID,
    region: REGION,
  },
});
