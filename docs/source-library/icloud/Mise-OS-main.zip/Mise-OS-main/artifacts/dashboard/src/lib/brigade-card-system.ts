// MiseOS Brigade Card System — collectible workflow profile generator.
// Extends the canonical BRIGADE_GROUPS roster into original single-player deployment cards.
// This is not based on any existing trading-card game frame or third-party franchise identity.

import { BRIGADE_GROUPS } from "./brigade-data";

export type BrigadeCardRarity = "Core" | "Rare" | "Epic" | "Legendary";

export interface BrigadeCardStats {
  orchestration: number;
  build: number;
  runtime: number;
  security: number;
  insight: number;
  stamina: number;
}

export interface BrigadeCardProfile {
  id: string;
  slug: string;
  name: string;
  role: string;
  brigadeId: string;
  brigadeName: string;
  brigadeTagline: string;
  accent: string;
  rarity: BrigadeCardRarity;
  element: string;
  workflowFocus: string;
  archetype: string;
  primaryTool: string;
  temperament: string;
  designSignature: string;
  profile: string;
  singlePlayerAction: string;
  workflowAction: string;
  passiveAbility: string;
  activeAbility: string;
  ultimateMove: string;
  soloCommand: string;
  deploymentUse: string;
  stats: BrigadeCardStats;
  cardPrompt: string;
}

const WORKFLOW_FOCUS: Record<string, string> = {
  "Orchestra Core": "Orchestration Core",
  "Kurogami": "Strategic Control",
  "Kuro Guard": "Threat Shield",
  "Seira": "Signal Routing",
  "Conductor": "Flow Baton",
  "Steward Prime": "Capacity Stewardship",
  "Root Chef": "Root Access",
  "Policy Monk": "Policy Gate",
  "Audit Sensei": "Evidence Audit",
  "Human Liaison": "Human Approval",
  "Build Kun": "Build Execution",
  "Dispatcher": "Task Dispatch",
  "Gatekeeper": "Queue Control",
  "Kaji": "Incident Response",
  "Mizu": "Flow Control",
  "PrepBot": "Preflight Prep",
  "Scale Oni": "Scale Control",
  "Scheduler": "Job Timing",
  "Swarmar": "Agent Swarm",
  "Tensho": "Shift Handoff",
  "Cache Cat": "Cache Management",
  "Flash Riku": "Edge Delivery",
  "Iron Hashi": "Mesh Routing",
  "Null Chan": "Fallback Recovery",
  "Patch Panda": "Patch Delivery",
  "Relay Fox": "Message Broker",
  "Streama": "Stream Processing",
  "Ticket Tengu": "Ticket Routing",
  "Umami Code": "API Service",
  "Yume": "Async Jobs",
  "Architect": "Architecture",
  "Coder": "Code Generation",
  "Debugger": "Debugging",
  "DevRel": "Developer Experience",
  "Doc Writer": "Documentation",
  "Perf Chef": "Performance",
  "Reviewer": "Review",
  "SRE Chef": "Reliability",
  "Tester": "Testing",
  "UX Chef": "UX",
  "Compliance": "Compliance",
  "Encryptor": "Encryption",
  "Firewall": "Perimeter Security",
  "Pen Tester": "Pen-Testing",
  "Quality Guard": "Quality Gate",
  "Risk Oracle": "Risk Analysis",
  "Scanner": "Scanning",
  "Security Auditor": "Security Audit",
  "Token Monk": "Secrets",
  "Vault Link": "Vault Integration",
  "Alarmer": "Alerting",
  "Automator": "Automation",
  "Cloud Chef": "Cloud Provisioning",
  "Cost Guard": "Cost Control",
  "Database": "Database",
  "DR Builder": "Disaster Recovery",
  "Load Balancer": "Load Balancing",
  "Logger": "Logging",
  "Networker": "Networking",
  "Observatory": "Observability",
  "Pipeline": "Pipeline",
  "Storage": "Storage",
  "API Gateway": "API Gateway",
  "Argo Chef": "GitOps",
  "Community Rep": "Community",
  "Datadog": "Datadog Monitoring",
  "Docker": "Containers",
  "GitHub Chef": "GitHub Automation",
  "GitLab Chef": "GitLab Automation",
  "Jenkins Chef": "Jenkins CI",
  "Kubernetes": "Kubernetes",
  "Prometheus": "Prometheus Metrics",
  "Slack Bot": "Slack Notifications",
  "Teacher": "Teaching",
  "Terraformer": "Terraform",
};

const PRIMARY_TOOL: Record<string, string> = {
  "Orchestra Core": "orchestrator",
  "Kurogami": "planner",
  "Kuro Guard": "policy shield",
  "Seira": "event bus",
  "Conductor": "workflow graph",
  "Steward Prime": "resource ledger",
  "Root Chef": "RBAC gate",
  "Policy Monk": "policy engine",
  "Audit Sensei": "audit log",
  "Human Liaison": "approval queue",
  "Build Kun": "build runner",
  "Dispatcher": "task router",
  "Gatekeeper": "queue gate",
  "Kaji": "incident runbook",
  "Mizu": "flow board",
  "PrepBot": "preflight checklist",
  "Scale Oni": "autoscaler",
  "Scheduler": "scheduler",
  "Swarmar": "agent coordinator",
  "Tensho": "handoff packet",
  "Cache Cat": "cache layer",
  "Flash Riku": "edge runtime",
  "Iron Hashi": "service mesh",
  "Null Chan": "fallback router",
  "Patch Panda": "hotfix lane",
  "Relay Fox": "message queue",
  "Streama": "stream processor",
  "Ticket Tengu": "ticket triage",
  "Umami Code": "API responder",
  "Yume": "worker queue",
  "Architect": "system diagrammer",
  "Coder": "code editor",
  "Debugger": "debugger",
  "DevRel": "dev portal",
  "Doc Writer": "docs generator",
  "Perf Chef": "profiler",
  "Reviewer": "pull request reviewer",
  "SRE Chef": "SLO dashboard",
  "Tester": "test runner",
  "UX Chef": "prototype board",
  "Compliance": "control matrix",
  "Encryptor": "key manager",
  "Firewall": "firewall rules",
  "Pen Tester": "attack simulator",
  "Quality Guard": "quality checklist",
  "Risk Oracle": "risk register",
  "Scanner": "vulnerability scanner",
  "Security Auditor": "audit ledger",
  "Token Monk": "secret scanner",
  "Vault Link": "vault connector",
  "Alarmer": "alert manager",
  "Automator": "automation runner",
  "Cloud Chef": "cloud console",
  "Cost Guard": "cost dashboard",
  "Database": "database console",
  "DR Builder": "backup plan",
  "Load Balancer": "traffic router",
  "Logger": "log aggregator",
  "Networker": "network map",
  "Observatory": "observability stack",
  "Pipeline": "CI/CD runner",
  "Storage": "object storage",
  "API Gateway": "API gateway",
  "Argo Chef": "GitOps controller",
  "Community Rep": "community inbox",
  "Datadog": "Datadog connector",
  "Docker": "container builder",
  "GitHub Chef": "GitHub app",
  "GitLab Chef": "GitLab integration",
  "Jenkins Chef": "Jenkins bridge",
  "Kubernetes": "cluster API",
  "Prometheus": "metrics scraper",
  "Slack Bot": "notification bot",
  "Teacher": "onboarding playbook",
  "Terraformer": "IaC runner",
};

const ELEMENT_BY_GROUP: Record<string, string> = {
  "executive-chefs": "Gold / Command",
  "kitchen-operations": "Flame / Dispatch",
  "service-layer": "Matcha / Runtime",
  "engineering": "Blue / Buildcraft",
  "security": "Red / Sentinel",
  "platform-infra": "Teal / Infrastructure",
  "ecosystem": "Violet / Connectors",
};

const BASE_STATS_BY_GROUP: Record<string, [number, number, number, number, number, number]> = {
  "executive-chefs": [92, 68, 66, 84, 90, 78],
  "kitchen-operations": [74, 92, 78, 62, 70, 86],
  "service-layer": [68, 76, 94, 64, 72, 84],
  "engineering": [72, 94, 76, 70, 86, 78],
  "security": [76, 68, 70, 96, 84, 82],
  "platform-infra": [70, 82, 88, 76, 86, 84],
  "ecosystem": [76, 78, 80, 72, 86, 82],
};

const TEMPERAMENTS = ["Precise", "Calm", "Fast", "Protective", "Curious", "Relentless", "Supportive"] as const;

function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function clampStat(value: number): number {
  return Math.max(50, Math.min(99, value));
}

function rarityFor(name: string, agentIndex: number): BrigadeCardRarity {
  if (["Orchestra Core", "Kurogami", "Kuro Guard", "Root Chef"].includes(name)) return "Legendary";
  if (agentIndex % 7 === 0) return "Epic";
  if (agentIndex % 3 === 0) return "Rare";
  return "Core";
}

function statsFor(groupId: string, agentIndex: number): BrigadeCardStats {
  const base = BASE_STATS_BY_GROUP[groupId] ?? [70, 70, 70, 70, 70, 70];
  const keys = ["orchestration", "build", "runtime", "security", "insight", "stamina"] as const;
  return Object.fromEntries(keys.map((key, statIndex) => [
    key,
    clampStat(base[statIndex] + ((agentIndex * 7 + statIndex * 5) % 9) - 4),
  ])) as unknown as BrigadeCardStats;
}

function modeFor(focus: string): string {
  return slugify({
    Architecture: "design",
    "Code Generation": "implement",
    Debugging: "repair",
    Testing: "verify",
    Review: "review",
    Pipeline: "ship",
    "GitHub Automation": "merge",
    GitOps: "release",
    Kubernetes: "rollout",
    Terraform: "provision",
    Secrets: "seal",
    Compliance: "attest",
  }[focus] ?? focus);
}

function buildCardProfile(params: {
  id: string;
  name: string;
  role: string;
  brigadeId: string;
  brigadeName: string;
  brigadeTagline: string;
  accent: string;
  agentIndex: number;
  globalIndex: number;
}): BrigadeCardProfile {
  const focus = WORKFLOW_FOCUS[params.name] ?? params.role;
  const tool = PRIMARY_TOOL[params.name] ?? "workflow tool";
  const slug = slugify(params.name);
  const focusLower = focus.toLowerCase();

  return {
    id: params.id,
    slug,
    name: params.name,
    role: params.role,
    brigadeId: params.brigadeId,
    brigadeName: params.brigadeName,
    brigadeTagline: params.brigadeTagline,
    accent: params.accent,
    rarity: rarityFor(params.name, params.agentIndex),
    element: ELEMENT_BY_GROUP[params.brigadeId] ?? "MiseOS",
    workflowFocus: focus,
    archetype: `${focus} Operator`,
    primaryTool: tool,
    temperament: TEMPERAMENTS[params.globalIndex % TEMPERAMENTS.length],
    designSignature: `${params.name} uses ${params.accent} brigade trim, chef-operator silhouette, ${focusLower} iconography, and gold-ladle rim lighting.`,
    profile: `${params.name} is the ${params.role.toLowerCase()} of ${params.brigadeName}. This card turns ${focusLower} into a focused single-player deployment move with clear inputs, validation, and handoff.`,
    singlePlayerAction: `Run ${params.name} when the builder needs ${focusLower} handled without spawning a full agent swarm.`,
    workflowAction: `Execute ${focusLower} using the ${tool}; produce a concise artifact, status summary, and next-step recommendation.`,
    passiveAbility: `Every ${focusLower} step emits trace metadata for replay, audit, and rollback.`,
    activeAbility: `Activate ${params.name} to perform ${focusLower}, validate output, and attach a one-screen operator report.`,
    ultimateMove: `${params.name} Service Finish: plan, execute, verify, and package the ${focusLower} result into a deployable service packet.`,
    soloCommand: `mise card run ${slug} --mode ${modeFor(focus)} --solo --emit report`,
    deploymentUse: `Best for single-player work sessions where ${focusLower} must be completed quickly, visibly, and safely.`,
    stats: statsFor(params.brigadeId, params.agentIndex),
    cardPrompt: `Original MiseOS collectible workflow card for ${params.name}, ${params.role.toLowerCase()}, ${params.brigadeName} brigade, chef-inspired operator outfit, ${focusLower} symbols, premium black cream gold card frame, no third-party franchise styling, no copyrighted character references.`,
  };
}

export const BRIGADE_CARD_PROFILES: BrigadeCardProfile[] = BRIGADE_GROUPS.flatMap((group, groupIndex) =>
  group.agents.map((agent, agentIndex) =>
    buildCardProfile({
      id: `MO-${String(BRIGADE_GROUPS.slice(0, groupIndex).reduce((total, g) => total + g.agents.length, 0) + agentIndex + 1).padStart(3, "0")}`,
      name: agent.name,
      role: agent.role,
      brigadeId: group.id,
      brigadeName: group.name,
      brigadeTagline: group.tagline,
      accent: group.accent,
      agentIndex: agentIndex + 1,
      globalIndex: BRIGADE_GROUPS.slice(0, groupIndex).reduce((total, g) => total + g.agents.length, 0) + agentIndex,
    }),
  ),
);

export const BRIGADE_CARD_TOTAL = BRIGADE_CARD_PROFILES.length;

export function getBrigadeCardBySlug(slug: string): BrigadeCardProfile | undefined {
  return BRIGADE_CARD_PROFILES.find((card) => card.slug === slug);
}

export function getBrigadeCardsByGroup(brigadeId: string): BrigadeCardProfile[] {
  return BRIGADE_CARD_PROFILES.filter((card) => card.brigadeId === brigadeId);
}

export function getBrigadeCardsByRarity(rarity: BrigadeCardRarity): BrigadeCardProfile[] {
  return BRIGADE_CARD_PROFILES.filter((card) => card.rarity === rarity);
}

export function getSoloCommand(slug: string): string {
  return getBrigadeCardBySlug(slug)?.soloCommand ?? "";
}
