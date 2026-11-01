import {
  GitPullRequest,
  Wrench,
  Workflow,
  Lock,
  Package,
  Cpu,
  ArrowRight,
  Terminal,
  FileCode,
  GitBranch,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Ecosystem Architecture — the "MiseOS" control plane + module map.
 * A Git-native control plane for repository operations, PR quality, repo health,
 * and safe-by-default automation. Each repo is a station in one kitchen brigade.
 */

const CONTROL_PLANE = {
  repo: "Git-it-Got-it-Good",
  chef: "The Expeditor",
  station: "Executive Chef · Core Engine",
  color: "#F97316",
  desc: "Reads mise.yaml, routes every event, and decides which stations fire — coordinating bounded GitHub actions under explicit approval boundaries.",
  responsibilities: ["Event router", "Module registry", "Approval gates", "Policy engine"],
};

interface Module {
  repo: string;
  station: string;
  layer: string;
  role: string;
  color: string;
  icon: typeof GitPullRequest;
  flagship?: boolean;
}

const MODULES: Module[] = [
  {
    repo: "mise-pr",
    station: "Saucier",
    layer: "PR Intelligence",
    role: "Review-readiness, PR hygiene, risk checks, and clean summary packets. Inspects every plate before it leaves the pass.",
    color: "#3B82F6",
    icon: GitPullRequest,
    flagship: true,
  },
  {
    repo: "mise-brigade-de-repo",
    station: "Sous Chef",
    layer: "Repo Stewardship",
    role: "Merge gates, repo health, branch intelligence, and automated cleanup PRs. Keeps every station in order.",
    color: "#14B8A6",
    icon: Wrench,
  },
  {
    repo: "mise-salt-shakers",
    station: "Garde Manger",
    layer: "Workflow Primitives",
    role: "Safe-by-default GitHub Actions building blocks — reusable mise-en-place every station can reach for.",
    color: "#F59E0B",
    icon: Workflow,
  },
  {
    repo: "Git-Locker-",
    station: "Pass Guardian",
    layer: "Guardrails & Security",
    role: "Repo protection and policy enforcement. Nothing reaches production without clearing the safety line.",
    color: "#EF4444",
    icon: Lock,
  },
  {
    repo: "Mise-en-Preplist",
    station: "Prep Cook",
    layer: "Bootstrap & Packaging",
    role: "Converts raw artifacts and projects into a GitHub-ready structure, wired into the ecosystem from day one.",
    color: "#8B5CF6",
    icon: Package,
  },
];

const FLOW = [
  { label: "Developer Event", sub: "PR opened", icon: GitBranch, color: "#94A3B8" },
  { label: "The Expeditor", sub: "routes by mise.yaml", icon: Cpu, color: "#F97316" },
  { label: "mise-pr", sub: "quality + risk", icon: GitPullRequest, color: "#3B82F6" },
  { label: "Git-Locker-", sub: "policy boundaries", icon: ShieldCheck, color: "#EF4444" },
  { label: "mise-brigade", sub: "merge readiness", icon: Wrench, color: "#14B8A6" },
  { label: "Status + Packet", sub: "comment / check", icon: CheckCircle2, color: "#22C55E" },
  { label: "Approval Gate", sub: "human sign-off", icon: Lock, color: "#EAB308" },
];

const CLI = [
  { cmd: "mise init", desc: "scaffold the shared contract" },
  { cmd: "mise doctor", desc: "diagnose repo + config health" },
  { cmd: "mise pr audit", desc: "run PR intelligence checks" },
  { cmd: "mise repo steward", desc: "evaluate stewardship + gates" },
  { cmd: "mise policy check", desc: "validate against guardrails" },
  { cmd: "mise bootstrap", desc: "onboard a repo into the orchestra" },
];

const MISE_YAML = `mise:
  version: 1
  repo_profile: standard
  policies:
    pr:
      max_changed_files: 25
      require_test_evidence: true
      risky_paths:
        - infra/*
        - auth/
    stewardship:
      stale_branch_days: 30
      cleanup_mode: advisory
      merge_gates: true
  modules:
    pr: true
    brigade: true
    salt_shakers: true
    locker: true
    bootstrap: true`;

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/70 border-t border-border/30 pt-3">
      {children}
    </div>
  );
}

export default function Ecosystem() {
  return (
    <div className="space-y-10 max-w-6xl" data-testid="ecosystem-page">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold tracking-tight">Ecosystem Architecture</h1>
        <p className="text-sm text-muted-foreground font-mono mt-1">
          Git-native control plane · {MODULES.length} modules · one shared contract
        </p>
      </div>

      {/* Positioning band */}
      <div className="rounded border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,theme(colors.primary/15),transparent_60%)]" />
        <div className="relative space-y-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-primary/80">
            MiseOS
          </span>
          <h2 className="text-lg font-display font-semibold leading-snug max-w-2xl">
            A Git-native control plane for repository operations, PR quality, repo health, and
            safe-by-default automation.
          </h2>
          <p className="text-sm text-muted-foreground font-mono max-w-2xl">
            "Everything in its place, for every repo." Each repo is a focused station — not a
            competing startup — coordinated as one smooth service.
          </p>
        </div>
      </div>

      {/* Topology */}
      <div className="space-y-5">
        <SectionLabel>Orchestration Topology</SectionLabel>

        {/* Control plane */}
        <div
          className="rounded border bg-card p-6 relative"
          style={{ borderColor: CONTROL_PLANE.color + "55", borderLeftColor: CONTROL_PLANE.color, borderLeftWidth: 3 }}
          data-testid="control-plane-card"
        >
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-start gap-4">
              <div
                className="h-11 w-11 rounded flex items-center justify-center shrink-0"
                style={{ backgroundColor: CONTROL_PLANE.color + "22", color: CONTROL_PLANE.color, border: `1px solid ${CONTROL_PLANE.color}44` }}
              >
                <Cpu className="h-6 w-6" />
              </div>
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-lg font-display font-bold" style={{ color: CONTROL_PLANE.color }}>
                    {CONTROL_PLANE.chef}
                  </span>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded border border-border/60 text-muted-foreground">
                    {CONTROL_PLANE.repo}
                  </span>
                </div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {CONTROL_PLANE.station}
                </div>
                <p className="text-sm text-foreground/80 max-w-2xl pt-1">{CONTROL_PLANE.desc}</p>
              </div>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {CONTROL_PLANE.responsibilities.map((r) => (
              <span
                key={r}
                className="font-mono text-[10px] px-2 py-1 rounded border"
                style={{ borderColor: CONTROL_PLANE.color + "33", color: CONTROL_PLANE.color, backgroundColor: CONTROL_PLANE.color + "11" }}
              >
                {r}
              </span>
            ))}
          </div>
        </div>

        {/* Connector */}
        <div className="flex justify-center">
          <div className="h-6 w-px bg-gradient-to-b from-primary/50 to-border/40" />
        </div>

        {/* Modules grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MODULES.map((m) => (
            <div
              key={m.repo}
              data-testid={`module-card-${m.repo}`}
              className="rounded border border-border/60 bg-card p-5 hover:border-border transition-colors group relative"
              style={{ borderTopColor: m.color, borderTopWidth: 2 }}
            >
              {m.flagship && (
                <span
                  className="absolute top-3 right-3 font-mono text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded"
                  style={{ backgroundColor: m.color + "22", color: m.color }}
                >
                  Flagship
                </span>
              )}
              <div className="flex items-center gap-3">
                <div
                  className="h-9 w-9 rounded flex items-center justify-center shrink-0"
                  style={{ backgroundColor: m.color + "1f", color: m.color, border: `1px solid ${m.color}33` }}
                >
                  <m.icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="font-display font-semibold leading-tight" style={{ color: m.color }}>
                    {m.station}
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    {m.layer}
                  </div>
                </div>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-foreground/75">{m.role}</p>
              <div className="mt-3 flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground/70">
                <GitBranch className="h-3 w-3" />
                {m.repo}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Service flow */}
      <div className="space-y-5">
        <SectionLabel>Event-Driven Service</SectionLabel>
        <div className="rounded border border-border/60 bg-card p-6">
          <div className="flex items-stretch gap-2 overflow-x-auto pb-2">
            {FLOW.map((step, i) => (
              <div key={step.label} className="flex items-center gap-2 shrink-0">
                <div className="flex flex-col items-center gap-2 w-24">
                  <div
                    className="h-10 w-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: step.color + "1f", color: step.color, border: `1px solid ${step.color}44` }}
                  >
                    <step.icon className="h-5 w-5" />
                  </div>
                  <div className="text-center">
                    <div className="font-mono text-[10px] font-semibold text-foreground/90 leading-tight">
                      {step.label}
                    </div>
                    <div className="font-mono text-[9px] text-muted-foreground leading-tight mt-0.5">
                      {step.sub}
                    </div>
                  </div>
                </div>
                {i < FLOW.length - 1 && (
                  <ArrowRight className="h-4 w-4 text-muted-foreground/40 shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Shared contract + CLI */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* mise.yaml */}
        <div className="space-y-4">
          <SectionLabel>Shared Contract · mise.yaml</SectionLabel>
          <div className="rounded border border-border/60 bg-card overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-border/60 bg-background/40">
              <FileCode className="h-3.5 w-3.5 text-primary/70" />
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                one config every repo understands
              </span>
            </div>
            <pre className="p-4 overflow-x-auto text-[11px] leading-relaxed font-mono text-foreground/80">
              <code>{MISE_YAML}</code>
            </pre>
          </div>
        </div>

        {/* CLI */}
        <div className="space-y-4">
          <SectionLabel>One Command Surface</SectionLabel>
          <div className="rounded border border-border/60 bg-card overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-border/60 bg-background/40">
              <Terminal className="h-3.5 w-3.5 text-primary/70" />
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                many modules, one CLI
              </span>
            </div>
            <div className="divide-y divide-border/40">
              {CLI.map((c) => (
                <div key={c.cmd} className="flex items-baseline gap-3 px-4 py-2.5">
                  <code className={cn("font-mono text-xs text-primary shrink-0")}>
                    <span className="text-muted-foreground/50">$ </span>
                    {c.cmd}
                  </code>
                  <span className="font-mono text-[10px] text-muted-foreground truncate">
                    {c.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
