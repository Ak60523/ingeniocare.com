import { defineBackend } from "@aws-amplify/backend";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Stack } from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import { Function as LambdaFunction } from "aws-cdk-lib/aws-lambda";
import { dataApiFunction } from "./functions/data-api/resource";
import { wirePostgresAndDataApi } from "./postgres/stack";

const backend = defineBackend({
  dataApiFunction,
});

const dataApiLambda = backend.dataApiFunction.resources.lambda as LambdaFunction;

dataApiLambda.addToRolePolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: ["bedrock:InvokeModel", "bedrock:InvokeModelWithResponseStream", "aws-marketplace:ViewSubscriptions", "aws-marketplace:Subscribe"],
    resources: ["*"],
  })
);

const pg = wirePostgresAndDataApi(Stack.of(dataApiLambda), dataApiLambda);

const contentImagesBucket = new s3.Bucket(Stack.of(dataApiLambda), "ContentImagesBucket", {
  blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS,
  cors: [
    {
      allowedMethods: [s3.HttpMethods.GET, s3.HttpMethods.HEAD],
      allowedOrigins: ["*"],
      allowedHeaders: ["*"],
    },
  ],
  encryption: s3.BucketEncryption.S3_MANAGED,
});
contentImagesBucket.grantPublicAccess("content-images/*");
contentImagesBucket.grantPublicAccess("content-infographics/*");
contentImagesBucket.grantPut(dataApiLambda);
contentImagesBucket.grantDelete(dataApiLambda);
dataApiLambda.addEnvironment("CONTENT_IMAGES_BUCKET", contentImagesBucket.bucketName);

backend.addOutput({
  custom: {
    dataApiUrl: pg.dataApiUrl,
  },
});
