import { Stack } from "aws-cdk-lib";
import { IVpc, Vpc } from "aws-cdk-lib/aws-ec2";
import {
  ACCOUNT_PRIVATE_SUBNET_IDS,
  ACCOUNT_PUBLIC_SUBNET_IDS,
  ACCOUNT_VPC_AZS,
  ACCOUNT_VPC_ID,
} from "../network/constants";

/**
 * Import the ingenio-population VPC. Never call `new Vpc()` here — this
 * account is at the 5-VPC cap, and Care/FHIR must not own the network.
 */
export function resolveAccountVpc(stack: Stack): IVpc {
  return Vpc.fromVpcAttributes(stack, "AccountVpc", {
    vpcId: ACCOUNT_VPC_ID,
    availabilityZones: [...ACCOUNT_VPC_AZS],
    privateSubnetIds: [...ACCOUNT_PRIVATE_SUBNET_IDS],
    publicSubnetIds: [...ACCOUNT_PUBLIC_SUBNET_IDS],
  });
}
