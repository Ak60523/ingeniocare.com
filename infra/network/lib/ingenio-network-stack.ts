import {
  CfnDeletionPolicy,
  CfnResource,
  RemovalPolicy,
  Stack,
  StackProps,
} from "aws-cdk-lib";
import {
  CfnEIP,
  CfnInternetGateway,
  CfnNatGateway,
  CfnRoute,
  CfnRouteTable,
  CfnSecurityGroup,
  CfnSubnet,
  CfnSubnetRouteTableAssociation,
  CfnVPC,
  CfnVPCGatewayAttachment,
} from "aws-cdk-lib/aws-ec2";
import { CfnDBCluster, CfnDBInstance, CfnDBSubnetGroup } from "aws-cdk-lib/aws-rds";
import { CfnSecret } from "aws-cdk-lib/aws-secretsmanager";
import { Construct } from "constructs";
import * as ids from "./ids";

function retain(resource: CfnResource) {
  resource.applyRemovalPolicy(RemovalPolicy.RETAIN);
  resource.cfnOptions.deletionPolicy = CfnDeletionPolicy.RETAIN;
  resource.cfnOptions.updateReplacePolicy = CfnDeletionPolicy.RETAIN;
}

/**
 * Account VPC + Aurora. Import-only: do not add tags or MasterUsername here.
 * CloudFormation import cannot create/modify Tags or RoleArn.
 */
export class IngenioNetworkStack extends Stack {
  constructor(scope: Construct, stackId: string, props?: StackProps) {
    super(scope, stackId, props);

    const vpc = new CfnVPC(this, "AccountVpc", {
      cidrBlock: ids.VPC_CIDR,
      enableDnsHostnames: true,
      enableDnsSupport: true,
      instanceTenancy: "default",
    });
    retain(vpc);

    const igw = new CfnInternetGateway(this, "AccountIgw");
    retain(igw);

    const gwAttach = new CfnVPCGatewayAttachment(this, "AccountVpcGatewayAttachment", {
      vpcId: vpc.ref,
      internetGatewayId: igw.ref,
    });
    retain(gwAttach);

    const publicSubnet1 = new CfnSubnet(this, "PublicSubnet1", {
      vpcId: vpc.ref,
      availabilityZone: ids.PUBLIC_SUBNET_1.az,
      cidrBlock: ids.PUBLIC_SUBNET_1.cidr,
      mapPublicIpOnLaunch: true,
    });
    retain(publicSubnet1);

    const publicSubnet2 = new CfnSubnet(this, "PublicSubnet2", {
      vpcId: vpc.ref,
      availabilityZone: ids.PUBLIC_SUBNET_2.az,
      cidrBlock: ids.PUBLIC_SUBNET_2.cidr,
      mapPublicIpOnLaunch: true,
    });
    retain(publicSubnet2);

    const privateSubnet1 = new CfnSubnet(this, "PrivateSubnet1", {
      vpcId: vpc.ref,
      availabilityZone: ids.PRIVATE_SUBNET_1.az,
      cidrBlock: ids.PRIVATE_SUBNET_1.cidr,
      mapPublicIpOnLaunch: false,
    });
    retain(privateSubnet1);

    const privateSubnet2 = new CfnSubnet(this, "PrivateSubnet2", {
      vpcId: vpc.ref,
      availabilityZone: ids.PRIVATE_SUBNET_2.az,
      cidrBlock: ids.PRIVATE_SUBNET_2.cidr,
      mapPublicIpOnLaunch: false,
    });
    retain(privateSubnet2);

    const publicRt1 = new CfnRouteTable(this, "PublicRouteTable1", { vpcId: vpc.ref });
    retain(publicRt1);
    const publicRt2 = new CfnRouteTable(this, "PublicRouteTable2", { vpcId: vpc.ref });
    retain(publicRt2);
    const privateRt1 = new CfnRouteTable(this, "PrivateRouteTable1", { vpcId: vpc.ref });
    retain(privateRt1);
    const privateRt2 = new CfnRouteTable(this, "PrivateRouteTable2", { vpcId: vpc.ref });
    retain(privateRt2);

    const publicAssoc1 = new CfnSubnetRouteTableAssociation(this, "PublicSubnet1Assoc", {
      subnetId: publicSubnet1.ref,
      routeTableId: publicRt1.ref,
    });
    retain(publicAssoc1);
    const publicAssoc2 = new CfnSubnetRouteTableAssociation(this, "PublicSubnet2Assoc", {
      subnetId: publicSubnet2.ref,
      routeTableId: publicRt2.ref,
    });
    retain(publicAssoc2);
    const privateAssoc1 = new CfnSubnetRouteTableAssociation(this, "PrivateSubnet1Assoc", {
      subnetId: privateSubnet1.ref,
      routeTableId: privateRt1.ref,
    });
    retain(privateAssoc1);
    const privateAssoc2 = new CfnSubnetRouteTableAssociation(this, "PrivateSubnet2Assoc", {
      subnetId: privateSubnet2.ref,
      routeTableId: privateRt2.ref,
    });
    retain(privateAssoc2);

    const natEip = new CfnEIP(this, "AccountNatEip", { domain: "vpc" });
    retain(natEip);

    const nat = new CfnNatGateway(this, "AccountNatGateway", {
      allocationId: natEip.attrAllocationId,
      subnetId: publicSubnet1.ref,
    });
    retain(nat);
    nat.addResourceDependency(gwAttach);

    const publicRoute1 = new CfnRoute(this, "PublicRoute1", {
      routeTableId: publicRt1.ref,
      destinationCidrBlock: "0.0.0.0/0",
      gatewayId: igw.ref,
    });
    retain(publicRoute1);
    publicRoute1.addResourceDependency(gwAttach);

    const publicRoute2 = new CfnRoute(this, "PublicRoute2", {
      routeTableId: publicRt2.ref,
      destinationCidrBlock: "0.0.0.0/0",
      gatewayId: igw.ref,
    });
    retain(publicRoute2);
    publicRoute2.addResourceDependency(gwAttach);

    const privateRoute1 = new CfnRoute(this, "PrivateRoute1", {
      routeTableId: privateRt1.ref,
      destinationCidrBlock: "0.0.0.0/0",
      natGatewayId: nat.ref,
    });
    retain(privateRoute1);

    const privateRoute2 = new CfnRoute(this, "PrivateRoute2", {
      routeTableId: privateRt2.ref,
      destinationCidrBlock: "0.0.0.0/0",
      natGatewayId: nat.ref,
    });
    retain(privateRoute2);

    const dbSg = new CfnSecurityGroup(this, "AccountDbSg", {
      groupDescription: ids.CLUSTER_SG_DESCRIPTION,
      vpcId: vpc.ref,
    });
    retain(dbSg);

    const subnetGroup = new CfnDBSubnetGroup(this, "AccountDbSubnetGroup", {
      dbSubnetGroupName: ids.DB_SUBNET_GROUP_NAME,
      dbSubnetGroupDescription: "Subnets for PopulationAurora database",
      subnetIds: [privateSubnet1.ref, privateSubnet2.ref],
    });
    retain(subnetGroup);

    const dbSecret = new CfnSecret(this, "AccountDbSecret", {
      name: ids.DB_SECRET_NAME,
      description: "Aurora credentials for ingenio-population analytics only",
    });
    retain(dbSecret);

    const cluster = new CfnDBCluster(this, "AccountAurora", {
      dbClusterIdentifier: ids.CLUSTER_ID,
      engine: "aurora-postgresql",
      engineVersion: "15.17",
      engineMode: "provisioned",
      port: 5432,
      dbSubnetGroupName: subnetGroup.ref,
      vpcSecurityGroupIds: [dbSg.ref],
      dbClusterParameterGroupName: "default.aurora-postgresql15",
      backupRetentionPeriod: 1,
      storageEncrypted: false,
      deletionProtection: true,
      copyTagsToSnapshot: true,
      serverlessV2ScalingConfiguration: {
        minCapacity: 0.5,
        maxCapacity: 4,
      },
    });
    retain(cluster);
    cluster.addResourceDependency(dbSecret);

    const writer = new CfnDBInstance(this, "AccountAuroraWriter", {
      dbInstanceIdentifier: ids.WRITER_ID,
      dbClusterIdentifier: cluster.ref,
      dbInstanceClass: "db.serverless",
      engine: "aurora-postgresql",
      publiclyAccessible: false,
    });
    retain(writer);
  }
}
