const imageModules = import.meta.glob<string>('@assets/miseos_agents/**/*.png', {
  eager: true,
  import: 'default',
  query: '?url',
});

const imageFor = (path: string) => {
  const match = Object.entries(imageModules).find(([key]) => key.endsWith(path));
  if (!match) throw new Error(`Missing launch-film agent image: ${path}`);
  return match[1];
};

export interface AgentProfile {
  name: string;
  role: string;
  image: string;
}

export interface BrigadeProfile {
  key: string;
  name: string;
  accent: string;
  mandate: string;
  agents: AgentProfile[];
}

const agent = (name: string, role: string, path: string): AgentProfile => ({
  name,
  role,
  image: imageFor(path),
});

export const BRIGADES: BrigadeProfile[] = [
  {
    key: 'executiveChefs',
    name: 'Executive Chefs',
    accent: '#D4AF37',
    mandate: 'Leadership & Orchestration',
    agents: [
      agent('Orchestra Core', 'Chief Orchestrator', '01_executive_chefs/Orchestra-Core.png'),
      agent('Kurogami', 'Master Strategist', '01_executive_chefs/Kurogami.png'),
      agent('Kuro Guard', 'Chief Sentinel', '01_executive_chefs/Kuro-Guard.png'),
      agent('Seira', 'Signal Conductor', '01_executive_chefs/Seira.png'),
      agent('Conductor', 'Workflow Conductor', '01_executive_chefs/Conductor.png'),
      agent('Steward Prime', 'Resource Steward', '01_executive_chefs/Steward-Prime.png'),
      agent('Root Chef', 'Root Authority', '01_executive_chefs/Root-Chef.png'),
      agent('Policy Monk', 'Policy Arbiter', '01_executive_chefs/Policy-Monk.png'),
      agent('Audit Sensei', 'Audit Master', '01_executive_chefs/Audit-Sensei.png'),
      agent('Human Liaison', 'Human-in-the-Loop', '01_executive_chefs/Human-Liaison.png'),
    ],
  },
  {
    key: 'kitchenOperations',
    name: 'Kitchen Operations',
    accent: '#E97B22',
    mandate: 'Build · Schedule · Dispatch',
    agents: [
      agent('Build Kun', 'Build Runner', '02_kitchen_operations/Build-Kun.png'),
      agent('Dispatcher', 'Task Dispatcher', '02_kitchen_operations/Dispatcher.png'),
      agent('Gatekeeper', 'Queue Gatekeeper', '02_kitchen_operations/Gatekeeper.png'),
      agent('Kaji', 'Incident Firefighter', '02_kitchen_operations/Kaji.png'),
      agent('Mizu', 'Flow Coordinator', '02_kitchen_operations/Mizu.png'),
      agent('PrepBot', 'Mise-en-place Prep', '02_kitchen_operations/PrepBot.png'),
      agent('Scale Oni', 'Autoscaler', '02_kitchen_operations/Scale-Oni.png'),
      agent('Scheduler', 'Job Scheduler', '02_kitchen_operations/Scheduler.png'),
      agent('Swarmar', 'Swarm Coordinator', '02_kitchen_operations/Swarmar.png'),
      agent('Tensho', 'Shift Lead', '02_kitchen_operations/Tensho.png'),
    ],
  },
  {
    key: 'serviceLayer',
    name: 'Service Layer',
    accent: '#2E8B4E',
    mandate: 'Runtime · Cache · Delivery',
    agents: [
      agent('Cache Cat', 'Cache Keeper', '03_service_layer/Cache-Cat.png'),
      agent('Flash Riku', 'Edge Accelerator', '03_service_layer/Flash-Riku.png'),
      agent('Iron Hashi', 'Service Mesh', '03_service_layer/Iron-Hashi.png'),
      agent('Null Chan', 'Fallback Handler', '03_service_layer/Null-Chan.png'),
      agent('Patch Panda', 'Hotfix Patcher', '03_service_layer/Patch-Panda.png'),
      agent('Relay Fox', 'Message Relay', '03_service_layer/Relay-Fox.png'),
      agent('Streama', 'Stream Processor', '03_service_layer/Streama.png'),
      agent('Ticket Tengu', 'Ticket Router', '03_service_layer/Ticket-Tengu.png'),
      agent('Umami Code', 'API Responder', '03_service_layer/Umami-Code.png'),
      agent('Yume', 'Async Worker', '03_service_layer/Yume.png'),
    ],
  },
  {
    key: 'engineeringDevelopment',
    name: 'Engineering & Development',
    accent: '#5B8DEF',
    mandate: 'Code · Test · Review',
    agents: [
      agent('Architect', 'System Architect', '04_engineering/Architect.png'),
      agent('Coder', 'Implementation Coder', '04_engineering/Coder.png'),
      agent('Debugger', 'Bug Hunter', '04_engineering/Debugger.png'),
      agent('DevRel', 'Developer Advocate', '04_engineering/DevRel.png'),
      agent('Doc Writer', 'Documentation Scribe', '04_engineering/Doc-Writer.png'),
      agent('Perf Chef', 'Performance Tuner', '04_engineering/Perf-Chef.png'),
      agent('Reviewer', 'Code Reviewer', '04_engineering/Reviewer.png'),
      agent('SRE Chef', 'Reliability Engineer', '04_engineering/SRE-Chef.png'),
      agent('Tester', 'QA Tester', '04_engineering/Tester.png'),
      agent('UX Chef', 'Experience Designer', '04_engineering/UX-Chef.png'),
    ],
  },
  {
    key: 'securityQuality',
    name: 'Security & Quality',
    accent: '#E5564B',
    mandate: 'Guard · Audit · Comply',
    agents: [
      agent('Compliance', 'Compliance Officer', '05_security/Compliance.png'),
      agent('Encryptor', 'Encryption Specialist', '05_security/Encryptor.png'),
      agent('Firewall', 'Perimeter Guard', '05_security/Firewall.png'),
      agent('Pen Tester', 'Security Tester', '05_security/Pen-Tester.png'),
      agent('Quality Guard', 'Quality Gate', '05_security/Quality-Guard.png'),
      agent('Risk Oracle', 'Risk Analyst', '05_security/Risk-Oracle.png'),
      agent('Scanner', 'Scanner', '05_security/Scanner.png'),
      agent('Security Auditor', 'Security Auditor', '05_security/Security-Auditor.png'),
      agent('Token Monk', 'Secrets Custodian', '05_security/Token-Monk.png'),
      agent('Vault Link', 'Vault Connector', '05_security/Vault-Link.png'),
    ],
  },
  {
    key: 'platformInfrastructure',
    name: 'Platform & Infrastructure',
    accent: '#26B6A6',
    mandate: 'Compute · Storage · Observe',
    agents: [
      agent('Alarmer', 'Alert Manager', '06_platform_infra/Alarmer.png'),
      agent('Automator', 'Automation Engine', '06_platform_infra/Automator.png'),
      agent('Cloud Chef', 'Cloud Provisioner', '06_platform_infra/Cloud-Chef.png'),
      agent('Cost Guard', 'Cost Optimizer', '06_platform_infra/Cost-Guard.png'),
      agent('Database', 'Database Steward', '06_platform_infra/Database.png'),
      agent('DR Builder', 'Disaster Recovery', '06_platform_infra/DR-Builder.png'),
      agent('Load Balancer', 'Load Balancer', '06_platform_infra/Load-Balancer.png'),
      agent('Logger', 'Log Aggregator', '06_platform_infra/Logger.png'),
      agent('Networker', 'Network Engineer', '06_platform_infra/Networker.png'),
      agent('Observatory', 'Observability Hub', '06_platform_infra/Observatory.png'),
      agent('Pipeline', 'CI/CD Pipeline', '06_platform_infra/Pipeline.png'),
      agent('Storage', 'Storage Manager', '06_platform_infra/Storage.png'),
    ],
  },
  {
    key: 'integrationsEcosystem',
    name: 'Integrations & Ecosystem',
    accent: '#A98BE0',
    mandate: 'Connect · Deploy · Extend',
    agents: [
      agent('API Gateway', 'API Gateway', '07_ecosystem/API-Gateway.png'),
      agent('Argo Chef', 'GitOps Deployer', '07_ecosystem/Argo-Chef.png'),
      agent('Community Rep', 'Community Liaison', '07_ecosystem/Community-Rep.png'),
      agent('Datadog', 'Monitoring Connector', '07_ecosystem/Datadog.png'),
      agent('Docker', 'Container Builder', '07_ecosystem/Docker.png'),
      agent('GitHub Chef', 'GitHub Integrator', '07_ecosystem/GitHub-Chef.png'),
      agent('GitLab Chef', 'GitLab Integrator', '07_ecosystem/GitLab-Chef.png'),
      agent('Jenkins Chef', 'CI Integrator', '07_ecosystem/Jenkins-Chef.png'),
      agent('Kubernetes', 'Cluster Connector', '07_ecosystem/Kubernetes.png'),
      agent('Prometheus', 'Metrics Collector', '07_ecosystem/Prometheus.png'),
      agent('Slack Bot', 'Notifications Bot', '07_ecosystem/Slack-Bot.png'),
      agent('Teacher', 'Onboarding Mentor', '07_ecosystem/Teacher.png'),
      agent('Terraformer', 'Infrastructure as Code', '07_ecosystem/Terraformer.png'),
    ],
  },
];

export const ALL_AGENTS = BRIGADES.flatMap((brigade) =>
  brigade.agents.map((agent) => ({ ...agent, brigade: brigade.name, accent: brigade.accent })),
);
