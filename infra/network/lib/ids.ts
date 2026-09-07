/**
 * Live Population VPC / Aurora identifiers.
 * Step 2 only records these. Step 3 imports them into IngenioNetwork.
 * Do not change IDs unless AWS shows a different resource.
 */
export const ACCOUNT_ID = "711387140392";
export const REGION = "us-east-1";

export const VPC_ID = "vpc-007b736a57c46f7e2";
export const VPC_CIDR = "10.0.0.0/16";

export const PUBLIC_SUBNET_1 = {
  id: "subnet-02d8e0e9aa8095a66",
  az: "us-east-1a",
  cidr: "10.0.0.0/18",
} as const;
export const PUBLIC_SUBNET_2 = {
  id: "subnet-017b3c66db09d70ad",
  az: "us-east-1b",
  cidr: "10.0.64.0/18",
} as const;
export const PRIVATE_SUBNET_1 = {
  id: "subnet-05295adaf90c9e4c0",
  az: "us-east-1a",
  cidr: "10.0.128.0/18",
} as const;
export const PRIVATE_SUBNET_2 = {
  id: "subnet-06ad42445ece5ff5d",
  az: "us-east-1b",
  cidr: "10.0.192.0/18",
} as const;

export const IGW_ID = "igw-0917151f76fba682c";
export const NAT_ID = "nat-003b09228e1ec0b03";
export const NAT_EIP_ALLOC = "eipalloc-0ef6f76dc6391846d";
export const NAT_EIP_PUBLIC_IP = "100.59.93.51";

export const PUBLIC_RT_1 = {
  id: "rtb-080282030ba376155",
  assocId: "rtbassoc-07084ba945a277abb",
} as const;
export const PUBLIC_RT_2 = {
  id: "rtb-03df6c204b9d12d84",
  assocId: "rtbassoc-026873f26b2510b7d",
} as const;
export const PRIVATE_RT_1 = {
  id: "rtb-0fa44895e5df34a7b",
  assocId: "rtbassoc-0f87af7d38decc16a",
} as const;
export const PRIVATE_RT_2 = {
  id: "rtb-043f9b0c3e518d203",
  assocId: "rtbassoc-0652e37307abaa84b",
} as const;

export const CLUSTER_SG_ID = "sg-035aaf8580c1fc67e";
export const CLUSTER_SG_DESCRIPTION =
  "amplify-d578rlejynwf1-main-branch-fee583e4ef/PopulationData/PopulationDbSg";
export const POPULATION_LAMBDA_SG_ID = "sg-04cc911441e96fabc";

export const DB_SUBNET_GROUP_NAME =
  "amplify-d578rlejynwf1-main-branch-fee583e4ef-populationdata17553ce0-7pokvruw34kx-populationaurorasubnetsad24d274-6nrl906fl8p8";

export const CLUSTER_ID = "ingenio-pop-local-main";
export const CLUSTER_ENDPOINT =
  "ingenio-pop-local-main.cluster-c1wggewos0o7.us-east-1.rds.amazonaws.com";
export const WRITER_ID = "amplify-d578rlejynwf1-mai-populationauroraprivatew-zokupk3vrpqs";
export const DB_NAME = "ingenio_population";
export const DB_MASTER_USERNAME = "ingenio_population";

export const DB_SECRET_ARN =
  "arn:aws:secretsmanager:us-east-1:711387140392:secret:PopulationDbSecret8C5F0FC7-VKk24ZDTyfxn-UyOd67";
export const DB_SECRET_NAME = "PopulationDbSecret8C5F0FC7-VKk24ZDTyfxn";
