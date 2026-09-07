import { Duration, Stack } from "aws-cdk-lib";
import { Port, SecurityGroup } from "aws-cdk-lib/aws-ec2";
import { ManagedPolicy } from "aws-cdk-lib/aws-iam";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import { Rule, Schedule } from "aws-cdk-lib/aws-events";
import { LambdaFunction as LambdaWarmTarget } from "aws-cdk-lib/aws-events-targets";
import { Function as LambdaFunction, CfnFunction, FunctionUrlAuthType } from "aws-cdk-lib/aws-lambda";
import {
  ACCOUNT_CLUSTER_ENDPOINT,
  ACCOUNT_CLUSTER_PORT,
  ACCOUNT_CLUSTER_SG_ID,
  ACCOUNT_DB_SECRET_ARN,
  ACCOUNT_MAINTENANCE_DB,
  CARE_DATABASE_NAME,
} from "../network/constants";
import { resolveAccountVpc } from "./vpc";

export type PostgresStackResult = {
  dbSecret: secretsmanager.ISecret;
  clusterEndpoint: string;
  dataApiUrl: string;
};

function attachLambdaToVpc(
  fn: LambdaFunction,
  vpc: ReturnType<typeof resolveAccountVpc>,
  sg: SecurityGroup
) {
  fn.role?.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName("service-role/AWSLambdaVPCAccessExecutionRole"));
  const cfn = fn.node.defaultChild as CfnFunction;
  cfn.vpcConfig = {
    subnetIds: vpc.privateSubnets.map((s) => s.subnetId),
    securityGroupIds: [sg.securityGroupId],
  };
}

function wireDbEnv(fn: LambdaFunction, dbSecret: secretsmanager.ISecret, clusterEndpoint: string) {
  fn.addEnvironment("DATABASE_SECRET_ARN", dbSecret.secretArn);
  fn.addEnvironment("DB_HOST", clusterEndpoint);
  fn.addEnvironment("DB_NAME", CARE_DATABASE_NAME);
  fn.addEnvironment("DB_MAINTENANCE_NAME", ACCOUNT_MAINTENANCE_DB);
  fn.addEnvironment("DB_PORT", String(ACCOUNT_CLUSTER_PORT));
  dbSecret.grantRead(fn);
}

/** Care Lambda joins IngenioNetwork. Does not create a VPC or Aurora cluster. */
export function wirePostgresAndDataApi(stack: Stack, dataApiLambda: LambdaFunction): PostgresStackResult {
  const vpc = resolveAccountVpc(stack);
  const dbSecret = secretsmanager.Secret.fromSecretCompleteArn(
    stack,
    "AccountDbSecret",
    ACCOUNT_DB_SECRET_ARN
  );

  const lambdaSg = new SecurityGroup(stack, "DbLambdaSecurityGroup", { vpc });
  const dbSg = SecurityGroup.fromSecurityGroupId(stack, "AccountDbSg", ACCOUNT_CLUSTER_SG_ID, {
    mutable: true,
  });
  dbSg.addIngressRule(lambdaSg, Port.tcp(ACCOUNT_CLUSTER_PORT), "Ingenio Care Lambda to account Aurora");

  attachLambdaToVpc(dataApiLambda, vpc, lambdaSg);
  wireDbEnv(dataApiLambda, dbSecret, ACCOUNT_CLUSTER_ENDPOINT);

  new Rule(stack, "DataApiWarmSchedule", {
    schedule: Schedule.rate(Duration.minutes(5)),
    targets: [new LambdaWarmTarget(dataApiLambda)],
  });

  // CORS is handled by Express. Setting it here too sends two
  // Access-Control-Allow-Origin headers and browsers block the API.
  const fnUrl = dataApiLambda.addFunctionUrl({
    authType: FunctionUrlAuthType.NONE,
  });

  return {
    dbSecret,
    clusterEndpoint: ACCOUNT_CLUSTER_ENDPOINT,
    dataApiUrl: fnUrl.url,
  };
}
