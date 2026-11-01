import { Octokit } from "@octokit/rest";
import { createAppAuth } from "@octokit/auth-app";
import { env, getGithubPrivateKey } from "./config.js";
import { evaluateGovernance } from "./governance.js";
import { validateAgentMode, validateFilePaths } from "./guards.js";

export type AgentFileChange = {
  path: string;
  content: string;
};

export type PullRequestResult = {
  branch: string;
  pullRequestUrl: string;
  filesChanged: number;
};

export async function getInstallationOctokit(): Promise<Octokit> {
  const auth = createAppAuth({
    appId: env.GITHUB_APP_ID,
    privateKey: getGithubPrivateKey(),
    installationId: env.GITHUB_APP_INSTALLATION_ID,
  });

  const installationAuth = await auth({ type: "installation" });

  return new Octokit({
    auth: installationAuth.token,
  });
}

async function createBranchFromDefault(params: {
  octokit: Octokit;
  branchName: string;
}): Promise<void> {
  const { octokit, branchName } = params;

  const baseRef = await octokit.git.getRef({
    owner: env.GITHUB_OWNER,
    repo: env.GITHUB_REPO,
    ref: `heads/${env.GITHUB_DEFAULT_BRANCH}`,
  });

  await octokit.git.createRef({
    owner: env.GITHUB_OWNER,
    repo: env.GITHUB_REPO,
    ref: `refs/heads/${branchName}`,
    sha: baseRef.data.object.sha,
  });
}

async function getExistingFileSha(params: {
  octokit: Octokit;
  path: string;
  branch: string;
}): Promise<string | undefined> {
  try {
    const response = await params.octokit.repos.getContent({
      owner: env.GITHUB_OWNER,
      repo: env.GITHUB_REPO,
      path: params.path,
      ref: params.branch,
    });

    if (!Array.isArray(response.data) && "sha" in response.data) {
      return response.data.sha;
    }

    return undefined;
  } catch {
    return undefined;
  }
}

async function upsertFile(params: {
  octokit: Octokit;
  branch: string;
  file: AgentFileChange;
  message: string;
}): Promise<void> {
  const sha = await getExistingFileSha({
    octokit: params.octokit,
    path: params.file.path,
    branch: params.branch,
  });

  await params.octokit.repos.createOrUpdateFileContents({
    owner: env.GITHUB_OWNER,
    repo: env.GITHUB_REPO,
    path: params.file.path,
    branch: params.branch,
    message: params.message,
    content: Buffer.from(params.file.content, "utf8").toString("base64"),
    sha,
    committer: {
      name: env.AGENT_COMMIT_AUTHOR_NAME,
      email: env.AGENT_COMMIT_AUTHOR_EMAIL,
    },
    author: {
      name: env.AGENT_COMMIT_AUTHOR_NAME,
      email: env.AGENT_COMMIT_AUTHOR_EMAIL,
    },
  });
}

async function openPullRequest(params: {
  octokit: Octokit;
  branch: string;
  title: string;
  body: string;
}): Promise<string> {
  const pr = await params.octokit.pulls.create({
    owner: env.GITHUB_OWNER,
    repo: env.GITHUB_REPO,
    base: env.GITHUB_DEFAULT_BRANCH,
    head: params.branch,
    title: params.title,
    body: params.body,
  });

  return pr.data.html_url;
}

export async function createAgentPullRequest(params: {
  task: string;
  files: AgentFileChange[];
  title?: string;
}): Promise<PullRequestResult> {
  if (params.files.length > env.MAX_FILES_PER_RUN) {
    throw new Error(`Too many files. Max allowed: ${env.MAX_FILES_PER_RUN}`);
  }

  const paths = params.files.map((file) => file.path);
  const pathGuard = validateFilePaths(paths);
  const modeGuard = validateAgentMode();
  const governance = evaluateGovernance({ task: params.task, changedPaths: paths });

  const failures = [...pathGuard.reasons, ...modeGuard.reasons];

  if (!governance.passed) {
    failures.push(governance.summary);
  }

  if (failures.length > 0) {
    throw new Error(`Guard failure: ${failures.join(" | ")}`);
  }

  if (env.DRY_RUN) {
    return {
      branch: "dry-run/no-branch-created",
      pullRequestUrl: "dry-run/no-pr-created",
      filesChanged: params.files.length,
    };
  }

  const octokit = await getInstallationOctokit();

  const safeTimestamp = new Date()
    .toISOString()
    .replaceAll(":", "-")
    .replaceAll(".", "-");

  const branch = `${env.AGENT_BRANCH_PREFIX}${safeTimestamp}`;

  await createBranchFromDefault({ octokit, branchName: branch });

  for (const file of params.files) {
    await upsertFile({
      octokit,
      branch,
      file,
      message: `agent: update ${file.path}`,
    });
  }

  const prUrl = await openPullRequest({
    octokit,
    branch,
    title: params.title ?? `[MiseOS Agent] ${params.task.slice(0, 70)}`,
    body: [
      "## Agent Task",
      params.task,
      "",
      "## Files Changed",
      ...paths.map((path) => `- \`${path}\``),
      "",
      "## Governance",
      `ECTI: \`${governance.ecti}\``,
      `CSM: \`${governance.csm}\``,
      `STL: \`${governance.stl}\``,
      `KAQ: \`${governance.kaq}\``,
      `Passed: \`${governance.passed}\``,
      "",
      "## Safety",
      `Mode: \`${env.AGENT_MODE}\``,
      `Human approval required: \`${env.REQUIRE_HUMAN_APPROVAL}\``,
      "",
      "---",
      env.AGENT_SIGNATURE_LINE,
    ].join("\n"),
  });

  return {
    branch,
    pullRequestUrl: prUrl,
    filesChanged: params.files.length,
  };
}
