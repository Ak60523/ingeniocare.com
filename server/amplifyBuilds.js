import {
  AmplifyClient,
  DeleteJobCommand,
  GetJobCommand,
  ListBranchesCommand,
  ListJobsCommand,
  StopJobCommand,
} from "@aws-sdk/client-amplify";

function appId() {
  return String(process.env.AMPLIFY_APP_ID || process.env.AWS_APP_ID || "").trim();
}

function region() {
  return String(process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || "us-east-1");
}

function jobToItem(branch, job, app) {
  const jobId = String(job.jobId || "");
  return {
    jobId,
    branch,
    status: String(job.status || "UNKNOWN"),
    commitId: job.commitId ? String(job.commitId) : null,
    commitMessage: job.commitMessage ? String(job.commitMessage) : null,
    startTime: job.startTime ? new Date(job.startTime).toISOString() : null,
    endTime: job.endTime ? new Date(job.endTime).toISOString() : null,
    consoleUrl: jobId
      ? `https://${region()}.console.aws.amazon.com/amplify/apps/${app}/branches/${encodeURIComponent(branch)}/deployments/${jobId}`
      : null,
  };
}

export function amplifyBuildsConfigured() {
  return Boolean(appId());
}

export async function listAmplifyBuilds(limitPerBranch = 10) {
  const id = appId();
  if (!id) {
    return {
      appId: "",
      items: [],
      note: "AMPLIFY_APP_ID is not configured on the API. Redeploy with AWS_APP_ID set.",
    };
  }

  const client = new AmplifyClient({});
  const branchesRes = await client.send(new ListBranchesCommand({ appId: id, maxResults: 20 }));
  const branches = (branchesRes.branches || []).map((b) => b.branchName).filter(Boolean);

  if (!branches.length) {
    return { appId: id, items: [], note: "No Amplify branches found for this app." };
  }

  const items = [];
  for (const branch of branches) {
    const jobsRes = await client.send(
      new ListJobsCommand({
        appId: id,
        branchName: branch,
        maxResults: limitPerBranch,
      })
    );
    for (const job of jobsRes.jobSummaries || []) {
      items.push(jobToItem(branch, job, id));
    }
  }

  items.sort((a, b) => {
    const ta = a.startTime ? Date.parse(a.startTime) : 0;
    const tb = b.startTime ? Date.parse(b.startTime) : 0;
    return tb - ta;
  });

  return { appId: id, items };
}

const LOG_MAX_CHARS = 48_000;
const LOG_TAIL_LINES = 120;

function truncateLogTail(text) {
  const trimmed = String(text || "").replace(/\r\n/g, "\n").trimEnd();
  if (!trimmed) return "";
  const lines = trimmed.split("\n");
  const sliced =
    lines.length > LOG_TAIL_LINES
      ? [`… (${lines.length - LOG_TAIL_LINES} earlier lines omitted)`, ...lines.slice(-LOG_TAIL_LINES)]
      : lines;
  let out = sliced.join("\n");
  if (out.length > LOG_MAX_CHARS) {
    out = `… (truncated)\n${out.slice(-LOG_MAX_CHARS)}`;
  }
  return out;
}

async function fetchLogUrl(url) {
  const res = await fetch(url, { signal: AbortSignal.timeout(12_000) });
  if (!res.ok) throw new Error(`Log fetch HTTP ${res.status}`);
  return await res.text();
}

function pickLogSteps(steps) {
  const withLog = steps.filter((s) => s.logUrl);
  if (!withLog.length) return [];
  const build = withLog.filter((s) => /build/i.test(s.stepName));
  if (build.length) return build;
  const failed = withLog.filter((s) => /FAIL|CANCEL/i.test(s.status));
  if (failed.length) return failed;
  return [withLog[withLog.length - 1]];
}

export async function getAmplifyBuildLog(branch, jobId) {
  const id = appId();
  if (!id) throw new Error("AMPLIFY_APP_ID is not configured on the API");
  if (!branch || !jobId) throw new Error("branch and jobId are required");

  const client = new AmplifyClient({});
  const res = await client.send(
    new GetJobCommand({
      appId: id,
      branchName: branch,
      jobId,
    })
  );
  const job = res.job;
  const summary = job?.summary;
  const steps = (job?.steps || []).map((s) => ({
    stepName: String(s.stepName || "step"),
    status: String(s.status || "UNKNOWN"),
    statusReason: s.statusReason ? String(s.statusReason) : null,
    startTime: s.startTime ? new Date(s.startTime).toISOString() : null,
    endTime: s.endTime ? new Date(s.endTime).toISOString() : null,
    logUrl: s.logUrl ? String(s.logUrl) : null,
  }));

  const header = steps
    .map((s) => {
      const reason = s.statusReason ? ` — ${s.statusReason}` : "";
      return `[${s.status}] ${s.stepName}${reason}`;
    })
    .join("\n");

  const logParts = [];
  if (header) logParts.push(header, "");

  for (const step of pickLogSteps(steps)) {
    if (!step.logUrl) continue;
    try {
      const body = await fetchLogUrl(step.logUrl);
      logParts.push(`── ${step.stepName} ──`, truncateLogTail(body), "");
    } catch (err) {
      logParts.push(
        `── ${step.stepName} ──`,
        `(could not fetch log: ${err?.message || String(err)})`,
        step.logUrl,
        ""
      );
    }
  }

  if (logParts.length <= 1) {
    logParts.push("(no step logs available for this job)");
  }

  return {
    appId: id,
    branch,
    jobId,
    status: String(summary?.status || "UNKNOWN"),
    steps,
    logText: logParts.join("\n").trimEnd(),
  };
}

const IN_PROGRESS = new Set(["PENDING", "PROVISIONING", "RUNNING", "DEPLOYING"]);

export async function deleteAmplifyBuild(branch, jobId) {
  const id = appId();
  if (!id) throw new Error("AMPLIFY_APP_ID is not configured on the API");
  if (!branch || !jobId) throw new Error("branch and jobId are required");

  const client = new AmplifyClient({});
  let stopped = false;

  try {
    const current = await client.send(new GetJobCommand({ appId: id, branchName: branch, jobId }));
    const status = String(current.job?.summary?.status || "").toUpperCase();
    if (IN_PROGRESS.has(status)) {
      await client.send(new StopJobCommand({ appId: id, branchName: branch, jobId }));
      stopped = true;
    }
  } catch {
    /* still attempt delete */
  }

  await client.send(
    new DeleteJobCommand({
      appId: id,
      branchName: branch,
      jobId,
    })
  );

  return { appId: id, branch, jobId, stopped };
}
