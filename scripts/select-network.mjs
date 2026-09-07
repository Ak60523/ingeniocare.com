#!/usr/bin/env node
/**
 * Discover Aurora PostgreSQL clusters in the account and write
 * amplify/network/constants.ts. Amplify Hosting cannot prompt; use this
 * locally, or set INGENIO_CLUSTER_IDENTIFIER for a non-interactive deploy.
 *
 *   npm run select-network
 *   npm run select-network -- --cluster ingenio-pop-local-main
 */
import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import path from "node:path";
import { createInterface } from "node:readline/promises";
import { fileURLToPath } from "node:url";
import { stdin as input, stdout as output } from "node:process";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONSTANTS_PATH = path.join(ROOT, "amplify", "network", "constants.ts");
const CARE_DATABASE_NAME = "ingeniocare";

function parseArgs(argv) {
  const out = { cluster: process.env.INGENIO_CLUSTER_IDENTIFIER?.trim() || "", region: "" };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === "--cluster") out.cluster = String(argv[++i] || "").trim();
    else if (a === "--region") out.region = String(argv[++i] || "").trim();
    else if (a === "--help" || a === "-h") out.help = true;
  }
  return out;
}

function regionOf(explicit) {
  return explicit || process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || "us-east-1";
}

function awsJson(args) {
  const raw = execFileSync("aws", args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  return JSON.parse(raw);
}

function listClusters(region) {
  const data = awsJson(["rds", "describe-db-clusters", "--region", region, "--output", "json"]);
  return (data.DBClusters || []).filter((c) => {
    const engine = String(c.Engine || "").toLowerCase();
    const status = String(c.Status || "").toLowerCase();
    return engine.includes("aurora-postgresql") && status === "available";
  });
}

function subnetIds(group) {
  return (group.Subnets || []).map((s) => s.SubnetIdentifier).filter(Boolean);
}

function classifySubnets(region, ids) {
  if (!ids.length) return { publicIds: [], privateIds: [], azs: [] };
  const described = awsJson([
    "ec2",
    "describe-subnets",
    "--region",
    region,
    "--subnet-ids",
    ...ids,
    "--output",
    "json",
  ]);
  const publicIds = [];
  const privateIds = [];
  const azs = [];
  for (const subnet of described.Subnets || []) {
    const id = subnet.SubnetId;
    const az = subnet.AvailabilityZone;
    if (az && !azs.includes(az)) azs.push(az);
    if (subnet.MapPublicIpOnLaunch) publicIds.push(id);
    else privateIds.push(id);
  }
  if (!privateIds.length && publicIds.length) {
    return { publicIds, privateIds: [...publicIds], azs };
  }
  if (!publicIds.length && privateIds.length) {
    return { publicIds: [...privateIds], privateIds, azs };
  }
  return { publicIds, privateIds, azs };
}

function secretArnOf(cluster) {
  const fromEnv = process.env.INGENIO_DB_SECRET_ARN?.trim();
  if (fromEnv) return fromEnv;
  const managed = cluster.MasterUserSecret?.SecretArn;
  if (managed) return managed;
  throw new Error(
    `Cluster ${cluster.DBClusterIdentifier} has no MasterUserSecret. Set INGENIO_DB_SECRET_ARN to the Secrets Manager ARN.`
  );
}

function clusterSg(cluster) {
  const groups = cluster.VpcSecurityGroups || [];
  const active = groups.find((g) => String(g.Status || "").toLowerCase() === "active") || groups[0];
  const id = active?.VpcSecurityGroupId;
  if (!id) throw new Error(`Cluster ${cluster.DBClusterIdentifier} has no VPC security group.`);
  return id;
}

function resolveCluster(region, cluster) {
  const groupName = cluster.DBSubnetGroup;
  if (!groupName) throw new Error(`Cluster ${cluster.DBClusterIdentifier} has no DB subnet group.`);
  const groups = awsJson([
    "rds",
    "describe-db-subnet-groups",
    "--region",
    region,
    "--db-subnet-group-name",
    groupName,
    "--output",
    "json",
  ]);
  const group = (groups.DBSubnetGroups || [])[0];
  if (!group?.VpcId) throw new Error(`Could not read VPC for subnet group ${groupName}.`);
  const ids = subnetIds(group);
  const classified = classifySubnets(region, ids);
  if (!classified.privateIds.length) {
    throw new Error(`Cluster ${cluster.DBClusterIdentifier} has no subnets Care can attach a Lambda to.`);
  }
  return {
    vpcId: group.VpcId,
    azs: classified.azs,
    privateSubnetIds: classified.privateIds,
    publicSubnetIds: classified.publicIds.length ? classified.publicIds : classified.privateIds,
    clusterId: cluster.DBClusterIdentifier,
    endpoint: cluster.Endpoint,
    port: Number(cluster.Port) || 5432,
    clusterSgId: clusterSg(cluster),
    secretArn: secretArnOf(cluster),
    maintenanceDb: cluster.DatabaseName || "postgres",
  };
}

function tsStrings(values) {
  return values.map((id) => `  "${id}",`).join("\n");
}

function renderConstants(cfg) {
  return `/** IngenioNetwork VPC. Do not create another VPC in this app.
 * Refresh with: npm run select-network
 */
export const ACCOUNT_VPC_ID = "${cfg.vpcId}";
export const ACCOUNT_VPC_AZS = [${cfg.azs.map((az) => `"${az}"`).join(", ")}] as const;
export const ACCOUNT_PRIVATE_SUBNET_IDS = [
${tsStrings(cfg.privateSubnetIds)}
] as const;
export const ACCOUNT_PUBLIC_SUBNET_IDS = [
${tsStrings(cfg.publicSubnetIds)}
] as const;

/** Shared Aurora. Do not create another RDS cluster in this app. */
export const ACCOUNT_CLUSTER_IDENTIFIER = "${cfg.clusterId}";
export const ACCOUNT_CLUSTER_ENDPOINT =
  "${cfg.endpoint}";
export const ACCOUNT_CLUSTER_PORT = ${cfg.port};
export const ACCOUNT_CLUSTER_SG_ID = "${cfg.clusterSgId}";
export const ACCOUNT_DB_SECRET_ARN =
  "${cfg.secretArn}";
export const ACCOUNT_MAINTENANCE_DB = "${cfg.maintenanceDb}";
export const CARE_DATABASE_NAME = "${CARE_DATABASE_NAME}";
`;
}

function printList(clusters) {
  console.log("Available Aurora PostgreSQL clusters:");
  clusters.forEach((c, i) => {
    console.log(`  ${i + 1}. ${c.DBClusterIdentifier}  (${c.Endpoint}, ${c.Engine})`);
  });
}

async function chooseCluster(clusters, requested) {
  if (requested) {
    const match = clusters.find((c) => c.DBClusterIdentifier === requested);
    if (!match) {
      printList(clusters);
      throw new Error(`Cluster "${requested}" is not an available Aurora PostgreSQL cluster in this account.`);
    }
    return match;
  }
  if (clusters.length === 1) {
    console.log(`Only one available cluster: ${clusters[0].DBClusterIdentifier}`);
    return clusters[0];
  }
  printList(clusters);
  if (!input.isTTY || !output.isTTY) {
    throw new Error(
      "Multiple clusters found. Re-run with --cluster <id> or set INGENIO_CLUSTER_IDENTIFIER. Amplify Hosting cannot prompt."
    );
  }
  const rl = createInterface({ input, output });
  const answer = (await rl.question("Select cluster number: ")).trim();
  rl.close();
  const n = Number(answer);
  if (!Number.isInteger(n) || n < 1 || n > clusters.length) {
    throw new Error(`Expected a number from 1 to ${clusters.length}.`);
  }
  return clusters[n - 1];
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(`Usage: node scripts/select-network.mjs [--cluster <id>] [--region <region>]

Writes amplify/network/constants.ts from an available Aurora PostgreSQL cluster.
If there is exactly one cluster, it is selected automatically.
If there are several, you are prompted (local TTY) or must pass --cluster.`);
    return;
  }
  const region = regionOf(args.region);
  const clusters = listClusters(region);
  if (!clusters.length) {
    throw new Error(`No available Aurora PostgreSQL clusters in ${region}. Create IngenioNetwork first, then re-run.`);
  }
  const chosen = await chooseCluster(clusters, args.cluster);
  const cfg = resolveCluster(region, chosen);
  writeFileSync(CONSTANTS_PATH, renderConstants(cfg), "utf8");
  console.log(`Wrote ${path.relative(ROOT, CONSTANTS_PATH)}`);
  console.log(`  cluster ${cfg.clusterId}`);
  console.log(`  vpc     ${cfg.vpcId}`);
  console.log(`  secret  ${cfg.secretArn}`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
