/** Population VPC / IngenioNetwork. Do not create another VPC in this app. */
export const ACCOUNT_VPC_ID = "vpc-007b736a57c46f7e2";
export const ACCOUNT_VPC_AZS = ["us-east-1a", "us-east-1b"] as const;
export const ACCOUNT_PRIVATE_SUBNET_IDS = [
  "subnet-05295adaf90c9e4c0",
  "subnet-06ad42445ece5ff5d",
] as const;
export const ACCOUNT_PUBLIC_SUBNET_IDS = [
  "subnet-02d8e0e9aa8095a66",
  "subnet-017b3c66db09d70ad",
] as const;

/** Shared Aurora. Do not create another RDS cluster in this app. */
export const ACCOUNT_CLUSTER_IDENTIFIER = "ingenio-pop-local-main";
export const ACCOUNT_CLUSTER_ENDPOINT =
  "ingenio-pop-local-main.cluster-c1wggewos0o7.us-east-1.rds.amazonaws.com";
export const ACCOUNT_CLUSTER_PORT = 5432;
export const ACCOUNT_CLUSTER_SG_ID = "sg-035aaf8580c1fc67e";
export const ACCOUNT_DB_SECRET_ARN =
  "arn:aws:secretsmanager:us-east-1:711387140392:secret:PopulationDbSecret8C5F0FC7-VKk24ZDTyfxn-UyOd67";
export const ACCOUNT_MAINTENANCE_DB = "ingenio_population";
export const CARE_DATABASE_NAME = "ingeniocare";

export const SSM_PREFIX = "/ingenio/network";
export const SSM_VPC_ID = `${SSM_PREFIX}/vpc-id`;
export const SSM_PRIVATE_SUBNET_IDS = `${SSM_PREFIX}/private-subnet-ids`;
export const SSM_PUBLIC_SUBNET_IDS = `${SSM_PREFIX}/public-subnet-ids`;
export const SSM_AZS = `${SSM_PREFIX}/availability-zones`;


export const SSM_PREFIX = "/ingenio/network";
export const SSM_VPC_ID = `${SSM_PREFIX}/vpc-id`;
export const SSM_PRIVATE_SUBNET_IDS = `${SSM_PREFIX}/private-subnet-ids`;
export const SSM_PUBLIC_SUBNET_IDS = `${SSM_PREFIX}/public-subnet-ids`;
export const SSM_AZS = `${SSM_PREFIX}/availability-zones`;
