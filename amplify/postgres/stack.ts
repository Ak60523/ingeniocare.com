import { Duration, Stack } from "aws-cdk-lib";
import { Vpc, SubnetType, SecurityGroup, Port } from "aws-cdk-lib/aws-ec2";
import { ManagedPolicy } from "aws-cdk-lib/aws-iam";
import * as rds from "aws-cdk-lib/aws-rds";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import { Rule, Schedule } from "aws-cdk-lib/aws-events";
import { LambdaFunction as LambdaWarmTarget } from "aws-cdk-lib/aws-events-targets";
import { Function as LambdaFunction, CfnFunction, FunctionUrlAuthType, HttpMethod } from "aws-cdk-lib/aws-lambda";

export type PostgresStackResult = {
  dbSecret: secretsmanager.ISecret;
  clusterEndpoint: string;
  dataApiUrl: string;
};

function attachLambdaToVpc(fn: LambdaFunction, vpc: Vpc, sg: SecurityGroup) {
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
  fn.addEnvironment("DB_NAME", "ingeniocare");
  fn.addEnvironment("DB_PORT", "5432");
  dbSecret.grantRead(fn);
}

export function wirePostgresAndDataApi(stack: Stack, dataApiLambda: LambdaFunction): PostgresStackResult {
  const vpc = new Vpc(stack, "IngenioVpc", {
    maxAzs: 2,
    natGateways: 1,
  });

  const dbSecret = new secretsmanager.Secret(stack, "IngenioDbSecret", {
    generateSecretString: {
      secretStringTemplate: JSON.stringify({ username: "ingenio" }),
      generateStringKey: "password",
      excludePunctuation: true,
    },
  });

  const lambdaSg = new SecurityGroup(stack, "DbLambdaSecurityGroup", { vpc });
  const dbSg = new SecurityGroup(stack, "IngenioDbSecurityGroup", { vpc });
  dbSg.addIngressRule(lambdaSg, Port.tcp(5432), "Lambda to Aurora");

  const cluster = new rds.DatabaseCluster(stack, "IngenioAurora", {
    clusterIdentifier: "ingenioCareCluster",
    engine: rds.DatabaseClusterEngine.auroraPostgres({
      version: rds.AuroraPostgresEngineVersion.of("15.17", "15"),
    }),
    credentials: rds.Credentials.fromSecret(dbSecret),
    serverlessV2MinCapacity: 0.5,
    serverlessV2MaxCapacity: 2,
    writer: rds.ClusterInstance.serverlessV2("writer"),
    vpc,
    vpcSubnets: { subnetType: SubnetType.PRIVATE_WITH_EGRESS },
    securityGroups: [dbSg],
    defaultDatabaseName: "ingeniocare",
  });

  const clusterEndpoint = cluster.clusterEndpoint.hostname;
  attachLambdaToVpc(dataApiLambda, vpc, lambdaSg);
  wireDbEnv(dataApiLambda, dbSecret, clusterEndpoint);

  new Rule(stack, "DataApiWarmSchedule", {
    schedule: Schedule.rate(Duration.minutes(5)),
    targets: [new LambdaWarmTarget(dataApiLambda)],
  });

  const fnUrl = dataApiLambda.addFunctionUrl({
    authType: FunctionUrlAuthType.NONE,
    cors: {
      allowedOrigins: ["*"],
      allowedHeaders: ["content-type", "authorization", "x-tenant-id"],
      allowedMethods: [HttpMethod.ALL],
    },
  });

  return {
    dbSecret,
    clusterEndpoint,
    dataApiUrl: fnUrl.url,
  };
}
