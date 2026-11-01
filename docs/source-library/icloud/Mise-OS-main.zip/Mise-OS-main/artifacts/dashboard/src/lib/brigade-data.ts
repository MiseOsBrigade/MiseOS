// The Agent Brigade — the canonical 7-group MiseOS mascot roster.
// Mascot art lives in attached_assets/miseos_agents/<folder>/<Name>.png (transparent PNGs).
// Images are resolved at build time via Vite's import.meta.glob.

const mascotUrls = import.meta.glob(
  "../../../../attached_assets/miseos_agents/**/*.png",
  { eager: true, query: "?url", import: "default" },
) as Record<string, string>;

/** Resolve a mascot URL from a "<folder>/<File>.png" key. */
function resolveMascot(relPath: string): string {
  const hit = Object.entries(mascotUrls).find(([p]) => p.endsWith(`/${relPath}`));
  return hit?.[1] ?? "";
}

export interface BrigadeAgent {
  name: string;
  role: string;
  img: string;
}

export interface BrigadeGroup {
  id: string;
  name: string;
  tagline: string;
  accent: string;
  agents: BrigadeAgent[];
}

interface RawAgent {
  file: string;
  name: string;
  role: string;
}

interface RawGroup {
  id: string;
  folder: string;
  name: string;
  tagline: string;
  accent: string;
  agents: RawAgent[];
}

const RAW_GROUPS: RawGroup[] = [
  {
    id: "executive-chefs",
    folder: "01_executive_chefs",
    name: "Executive Chefs",
    tagline: "Leadership & Orchestration",
    accent: "#D4AF37",
    agents: [
      { file: "Orchestra-Core.png", name: "Orchestra Core", role: "Chief Orchestrator" },
      { file: "Kurogami.png", name: "Kurogami", role: "Master Strategist" },
      { file: "Kuro-Guard.png", name: "Kuro Guard", role: "Chief Sentinel" },
      { file: "Seira.png", name: "Seira", role: "Signal Conductor" },
      { file: "Conductor.png", name: "Conductor", role: "Workflow Conductor" },
      { file: "Steward-Prime.png", name: "Steward Prime", role: "Resource Steward" },
      { file: "Root-Chef.png", name: "Root Chef", role: "Root Authority" },
      { file: "Policy-Monk.png", name: "Policy Monk", role: "Policy Arbiter" },
      { file: "Audit-Sensei.png", name: "Audit Sensei", role: "Audit Master" },
      { file: "Human-Liaison.png", name: "Human Liaison", role: "Human-in-the-Loop" },
    ],
  },
  {
    id: "kitchen-operations",
    folder: "02_kitchen_operations",
    name: "Kitchen Operations",
    tagline: "Build · Schedule · Dispatch",
    accent: "#E97B22",
    agents: [
      { file: "Build-Kun.png", name: "Build Kun", role: "Build Runner" },
      { file: "Dispatcher.png", name: "Dispatcher", role: "Task Dispatcher" },
      { file: "Gatekeeper.png", name: "Gatekeeper", role: "Queue Gatekeeper" },
      { file: "Kaji.png", name: "Kaji", role: "Incident Firefighter" },
      { file: "Mizu.png", name: "Mizu", role: "Flow Coordinator" },
      { file: "PrepBot.png", name: "PrepBot", role: "Mise-en-place Prep" },
      { file: "Scale-Oni.png", name: "Scale Oni", role: "Autoscaler" },
      { file: "Scheduler.png", name: "Scheduler", role: "Job Scheduler" },
      { file: "Swarmar.png", name: "Swarmar", role: "Swarm Coordinator" },
      { file: "Tensho.png", name: "Tensho", role: "Shift Lead" },
    ],
  },
  {
    id: "service-layer",
    folder: "03_service_layer",
    name: "Service Layer",
    tagline: "Runtime · Cache · Delivery",
    accent: "#2E8B4E",
    agents: [
      { file: "Cache-Cat.png", name: "Cache Cat", role: "Cache Keeper" },
      { file: "Flash-Riku.png", name: "Flash Riku", role: "Edge Accelerator" },
      { file: "Iron-Hashi.png", name: "Iron Hashi", role: "Service Mesh" },
      { file: "Null-Chan.png", name: "Null Chan", role: "Fallback Handler" },
      { file: "Patch-Panda.png", name: "Patch Panda", role: "Hotfix Patcher" },
      { file: "Relay-Fox.png", name: "Relay Fox", role: "Message Relay" },
      { file: "Streama.png", name: "Streama", role: "Stream Processor" },
      { file: "Ticket-Tengu.png", name: "Ticket Tengu", role: "Ticket Router" },
      { file: "Umami-Code.png", name: "Umami Code", role: "API Responder" },
      { file: "Yume.png", name: "Yume", role: "Async Worker" },
    ],
  },
  {
    id: "engineering",
    folder: "04_engineering",
    name: "Engineering & Development",
    tagline: "Code · Test · Review",
    accent: "#5B8DEF",
    agents: [
      { file: "Architect.png", name: "Architect", role: "System Architect" },
      { file: "Coder.png", name: "Coder", role: "Implementation Coder" },
      { file: "Debugger.png", name: "Debugger", role: "Bug Hunter" },
      { file: "DevRel.png", name: "DevRel", role: "Developer Advocate" },
      { file: "Doc-Writer.png", name: "Doc Writer", role: "Documentation Scribe" },
      { file: "Perf-Chef.png", name: "Perf Chef", role: "Performance Tuner" },
      { file: "Reviewer.png", name: "Reviewer", role: "Code Reviewer" },
      { file: "SRE-Chef.png", name: "SRE Chef", role: "Reliability Engineer" },
      { file: "Tester.png", name: "Tester", role: "QA Tester" },
      { file: "UX-Chef.png", name: "UX Chef", role: "Experience Designer" },
    ],
  },
  {
    id: "security",
    folder: "05_security",
    name: "Security & Quality",
    tagline: "Guard · Audit · Comply",
    accent: "#E5564B",
    agents: [
      { file: "Compliance.png", name: "Compliance", role: "Compliance Officer" },
      { file: "Encryptor.png", name: "Encryptor", role: "Encryption Specialist" },
      { file: "Firewall.png", name: "Firewall", role: "Perimeter Guard" },
      { file: "Pen-Tester.png", name: "Pen Tester", role: "Penetration Tester" },
      { file: "Quality-Guard.png", name: "Quality Guard", role: "Quality Gate" },
      { file: "Risk-Oracle.png", name: "Risk Oracle", role: "Risk Analyst" },
      { file: "Scanner.png", name: "Scanner", role: "Vulnerability Scanner" },
      { file: "Security-Auditor.png", name: "Security Auditor", role: "Security Auditor" },
      { file: "Token-Monk.png", name: "Token Monk", role: "Secrets Custodian" },
      { file: "Vault-Link.png", name: "Vault Link", role: "Vault Connector" },
    ],
  },
  {
    id: "platform-infra",
    folder: "06_platform_infra",
    name: "Platform & Infrastructure",
    tagline: "Compute · Storage · Observe",
    accent: "#26B6A6",
    agents: [
      { file: "Alarmer.png", name: "Alarmer", role: "Alert Manager" },
      { file: "Automator.png", name: "Automator", role: "Automation Engine" },
      { file: "Cloud-Chef.png", name: "Cloud Chef", role: "Cloud Provisioner" },
      { file: "Cost-Guard.png", name: "Cost Guard", role: "Cost Optimizer" },
      { file: "Database.png", name: "Database", role: "Database Steward" },
      { file: "DR-Builder.png", name: "DR Builder", role: "Disaster Recovery" },
      { file: "Load-Balancer.png", name: "Load Balancer", role: "Load Balancer" },
      { file: "Logger.png", name: "Logger", role: "Log Aggregator" },
      { file: "Networker.png", name: "Networker", role: "Network Engineer" },
      { file: "Observatory.png", name: "Observatory", role: "Observability Hub" },
      { file: "Pipeline.png", name: "Pipeline", role: "CI/CD Pipeline" },
      { file: "Storage.png", name: "Storage", role: "Storage Manager" },
    ],
  },
  {
    id: "ecosystem",
    folder: "07_ecosystem",
    name: "Integrations & Ecosystem",
    tagline: "Connect · Deploy · Extend",
    accent: "#A98BE0",
    agents: [
      { file: "API-Gateway.png", name: "API Gateway", role: "API Gateway" },
      { file: "Argo-Chef.png", name: "Argo Chef", role: "GitOps Deployer" },
      { file: "Community-Rep.png", name: "Community Rep", role: "Community Liaison" },
      { file: "Datadog.png", name: "Datadog", role: "Monitoring Connector" },
      { file: "Docker.png", name: "Docker", role: "Container Builder" },
      { file: "GitHub-Chef.png", name: "GitHub Chef", role: "GitHub Integrator" },
      { file: "GitLab-Chef.png", name: "GitLab Chef", role: "GitLab Integrator" },
      { file: "Jenkins-Chef.png", name: "Jenkins Chef", role: "CI Integrator" },
      { file: "Kubernetes.png", name: "Kubernetes", role: "Cluster Connector" },
      { file: "Prometheus.png", name: "Prometheus", role: "Metrics Collector" },
      { file: "Slack-Bot.png", name: "Slack Bot", role: "Notifications Bot" },
      { file: "Teacher.png", name: "Teacher", role: "Onboarding Mentor" },
      { file: "Terraformer.png", name: "Terraformer", role: "Infrastructure as Code" },
    ],
  },
];

export const BRIGADE_GROUPS: BrigadeGroup[] = RAW_GROUPS.map((g) => ({
  id: g.id,
  name: g.name,
  tagline: g.tagline,
  accent: g.accent,
  agents: g.agents.map((a) => ({
    name: a.name,
    role: a.role,
    img: resolveMascot(`${g.folder}/${a.file}`),
  })),
}));

export const BRIGADE_TOTAL = BRIGADE_GROUPS.reduce((n, g) => n + g.agents.length, 0);
