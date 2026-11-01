import { useMemo } from "react";
import {
  useGetGridSummary,
  useListGridProjects,
  useListGridTasks,
  useListGridSources,
  useListGridClaims,
  useListGridTools,
  type GridSource,
  type GridProject,
  type GridTool,
} from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { ClaimsTab } from "./claims";
import {
  Boxes,
  CheckSquare,
  FileText,
  ListChecks,
  Wrench,
  ExternalLink,
  Target,
  Calendar,
  User,
  ArrowRight,
} from "lucide-react";

const STATION_LABEL: Record<string, string> = {
  pipeline: "Pipeline",
  platform: "Platform",
  reliability: "Reliability",
  security: "Security",
  data: "Data",
};

const PROJECT_STATUS_STYLE: Record<string, string> = {
  active: "text-success border-success/40 bg-success/10",
  planning: "text-info-foreground border-info/50 bg-info/20",
  blocked: "text-destructive border-destructive/40 bg-destructive/10",
  shipped: "text-gold border-gold/40 bg-gold/10",
  archived: "text-muted-foreground border-border bg-muted/40",
};

const PRIORITY_STYLE: Record<string, string> = {
  critical: "text-destructive border-destructive/40 bg-destructive/10",
  high: "text-warning border-warning/40 bg-warning/10",
  medium: "text-info-foreground border-info/50 bg-info/20",
  low: "text-muted-foreground border-border bg-muted/40",
};

const TASK_STATUS_STYLE: Record<string, string> = {
  todo: "text-muted-foreground border-border bg-muted/40",
  in_progress: "text-warning border-warning/40 bg-warning/10",
  review: "text-info-foreground border-info/50 bg-info/20",
  done: "text-success border-success/40 bg-success/10",
  blocked: "text-destructive border-destructive/40 bg-destructive/10",
};

const RELIABILITY_STYLE: Record<string, string> = {
  high: "text-success border-success/40 bg-success/10",
  medium: "text-warning border-warning/40 bg-warning/10",
  low: "text-destructive border-destructive/40 bg-destructive/10",
  unknown: "text-muted-foreground border-border bg-muted/40",
};

const TOOL_CATEGORY_STYLE: Record<string, string> = {
  ci: "text-info-foreground border-info/50 bg-info/20",
  security: "text-destructive border-destructive/40 bg-destructive/10",
  observability: "text-warning border-warning/40 bg-warning/10",
  infra: "text-muted-foreground border-border bg-muted/40",
  data: "text-gold border-gold/40 bg-gold/10",
  ai: "text-success border-success/40 bg-success/10",
};

function Pill({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded px-2 py-0.5 border font-mono text-[10px] uppercase tracking-wider",
        className,
      )}
    >
      {children}
    </span>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded bg-muted/60 px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground">
      {children}
    </span>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: number | string;
  icon: React.ElementType;
  accent?: string;
}) {
  return (
    <div className="rounded border border-border/60 bg-card p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
        <Icon className={cn("h-4 w-4", accent ?? "text-gold")} />
      </div>
      <div className={cn("font-display text-3xl font-bold tabular-nums", accent ?? "text-foreground")}>
        {value}
      </div>
    </div>
  );
}

const HEALTH_SEGMENTS: { key: string; label: string; color: string }[] = [
  { key: "verified", label: "Verified", color: "hsl(var(--success))" },
  { key: "pending", label: "Pending", color: "hsl(var(--warning))" },
  { key: "unsupported", label: "Unsupported", color: "hsl(var(--destructive))" },
  { key: "deprecated", label: "Deprecated", color: "hsl(var(--muted-foreground))" },
];

export default function Kitchen() {
  const { data: summary, isLoading: summaryLoading } = useGetGridSummary();
  const { data: projects } = useListGridProjects();
  const { data: tasks } = useListGridTasks();
  const { data: sources } = useListGridSources();
  const { data: claims } = useListGridClaims();
  const { data: tools } = useListGridTools();

  const sourceMap = useMemo(
    () => Object.fromEntries((sources ?? []).map(s => [s.id, s])) as Record<string, GridSource>,
    [sources],
  );
  const projectMap = useMemo(
    () => Object.fromEntries((projects ?? []).map(p => [p.id, p])) as Record<string, GridProject>,
    [projects],
  );
  const toolMap = useMemo(
    () => Object.fromEntries((tools ?? []).map(t => [t.id, t])) as Record<string, GridTool>,
    [tools],
  );

  const health = summary?.verificationHealth;
  const claimsByVerification = summary?.claimsByVerification ?? {};
  const totalClaims = summary?.counts.claims ?? 0;

  return (
    <div className="space-y-8" data-testid="kitchen-page">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold tracking-tight">
            The Kitchen <span className="text-gold">Knowledge Grid</span>
          </h1>
          <p className="text-sm text-muted-foreground font-mono mt-1">
            Projects, evidence & verified truth — mise en place for the brigade
          </p>
        </div>
        {health && (
          <div className="rounded border border-gold/30 bg-gold/5 px-4 py-3 text-right shrink-0">
            <div className="font-display text-3xl font-bold text-gold tabular-nums">
              {health.verifiedPct}%
            </div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Verified
            </div>
          </div>
        )}
      </div>

      {/* Summary stats */}
      {summaryLoading || !summary ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
            <StatCard label="Projects" value={summary.counts.projects} icon={Boxes} />
            <StatCard label="Tasks" value={summary.counts.tasks} icon={CheckSquare} accent="text-warning" />
            <StatCard label="Sources" value={summary.counts.sources} icon={FileText} accent="text-info-foreground" />
            <StatCard label="Claims" value={summary.counts.claims} icon={ListChecks} accent="text-success" />
            <StatCard label="Tools" value={summary.counts.tools} icon={Wrench} accent="text-foreground" />
          </div>

          {/* Verification health bar */}
          <div className="rounded border border-border/60 bg-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Evidence Health
              </span>
              <span className="font-mono text-[10px] text-muted-foreground">
                {health?.supported ?? 0}/{totalClaims} claims sourced
              </span>
            </div>
            <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-muted">
              {HEALTH_SEGMENTS.map(seg => {
                const count = (claimsByVerification as Record<string, number>)[seg.key] ?? 0;
                const pct = totalClaims > 0 ? (count / totalClaims) * 100 : 0;
                if (pct === 0) return null;
                return (
                  <div
                    key={seg.key}
                    className="h-full transition-all duration-700"
                    style={{ width: `${pct}%`, backgroundColor: seg.color }}
                    title={`${seg.label}: ${count}`}
                  />
                );
              })}
            </div>
            <div className="flex flex-wrap gap-4">
              {HEALTH_SEGMENTS.map(seg => (
                <div key={seg.key} className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: seg.color }} />
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {seg.label} ({(claimsByVerification as Record<string, number>)[seg.key] ?? 0})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Tabs */}
      <Tabs defaultValue="projects" className="w-full">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="projects" data-testid="tab-projects">Projects</TabsTrigger>
          <TabsTrigger value="tasks" data-testid="tab-tasks">Tasks</TabsTrigger>
          <TabsTrigger value="sources" data-testid="tab-sources">Sources</TabsTrigger>
          <TabsTrigger value="claims" data-testid="tab-claims">Claims</TabsTrigger>
          <TabsTrigger value="tools" data-testid="tab-tools">Tools</TabsTrigger>
        </TabsList>

        {/* Projects */}
        <TabsContent value="projects" className="mt-6">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {(projects ?? []).map(p => (
              <div
                key={p.id}
                data-testid={`project-card-${p.id}`}
                className="rounded border border-border/60 bg-card p-5 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      {STATION_LABEL[p.station] ?? p.station}
                    </div>
                    <h3 className="text-base font-semibold mt-0.5">{p.name}</h3>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <Pill className={PROJECT_STATUS_STYLE[p.status]}>{p.status}</Pill>
                    <Pill className={PRIORITY_STYLE[p.priority]}>{p.priority}</Pill>
                  </div>
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed flex items-start gap-1.5">
                  <Target className="h-3.5 w-3.5 text-gold shrink-0 mt-0.5" />
                  {p.goal}
                </p>
                <p className="font-mono text-[11px] text-muted-foreground leading-relaxed border-l-2 border-gold/30 pl-2">
                  {p.canonicalSummary}
                </p>
                <div className="flex items-center justify-between pt-1">
                  <span className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground">
                    <User className="h-3 w-3" />
                    {p.owner}
                  </span>
                  <span className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {p.deadline}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {p.tags.map(t => <Tag key={t}>{t}</Tag>)}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Tasks */}
        <TabsContent value="tasks" className="mt-6">
          <div className="space-y-2">
            {(tasks ?? []).map(t => (
              <div
                key={t.id}
                data-testid={`task-row-${t.id}`}
                className="rounded border border-border/60 bg-card p-4 flex items-start justify-between gap-4"
              >
                <div className="min-w-0 space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium">{t.title}</span>
                    <Pill className={PRIORITY_STYLE[t.priority]}>{t.priority}</Pill>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground flex-wrap">
                    <span>{projectMap[t.projectId]?.name ?? t.projectId}</span>
                    <span className="text-border">·</span>
                    <span className="flex items-center gap-1"><User className="h-3 w-3" />{t.owner}</span>
                    {t.toolId && toolMap[t.toolId] && (
                      <>
                        <span className="text-border">·</span>
                        <span className="flex items-center gap-1"><Wrench className="h-3 w-3" />{toolMap[t.toolId].name}</span>
                      </>
                    )}
                  </div>
                  <p className="flex items-center gap-1 text-xs text-foreground/70">
                    <ArrowRight className="h-3 w-3 text-gold" />
                    {t.nextAction}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <Pill className={TASK_STATUS_STYLE[t.status]}>{t.status.replace("_", " ")}</Pill>
                  <span className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {t.dueDate}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Sources */}
        <TabsContent value="sources" className="mt-6">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {(sources ?? []).map(s => (
              <div
                key={s.id}
                data-testid={`source-card-${s.id}`}
                className="rounded border border-border/60 bg-card p-5 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      {s.type}
                    </span>
                    <h3 className="text-sm font-semibold mt-0.5">{s.title}</h3>
                  </div>
                  <Pill className={RELIABILITY_STYLE[s.reliability]}>{s.reliability}</Pill>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.summary}</p>
                <div className="flex items-center justify-between pt-1">
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {s.author} · {s.datePublished}
                  </span>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 font-mono text-[10px] text-info-foreground hover:text-gold transition-colors"
                  >
                    <ExternalLink className="h-3 w-3" />
                    open
                  </a>
                </div>
                <div className="flex flex-wrap gap-1">
                  {s.tags.map(t => <Tag key={t}>{t}</Tag>)}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Claims */}
        <TabsContent value="claims" className="mt-6">
          <ClaimsTab
            claims={claims ?? []}
            sourceMap={sourceMap}
            projectMap={projectMap}
          />
        </TabsContent>

        {/* Tools */}
        <TabsContent value="tools" className="mt-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {(tools ?? []).map(t => (
              <div
                key={t.id}
                data-testid={`tool-card-${t.id}`}
                className="rounded border border-border/60 bg-card p-5 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold">{t.name}</h3>
                  <Pill className={TOOL_CATEGORY_STYLE[t.category]}>{t.category}</Pill>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{t.useCase}</p>
                <div className="flex flex-wrap gap-1.5">
                  <Pill className="text-muted-foreground border-border bg-muted/40">{t.privacy}</Pill>
                  <Pill className="text-muted-foreground border-border bg-muted/40">{t.integrationType}</Pill>
                  <Pill className="text-muted-foreground border-border bg-muted/40">{STATION_LABEL[t.relatedStation] ?? t.relatedStation}</Pill>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="font-mono text-[10px] text-muted-foreground">{t.cost}</span>
                  <div className="flex flex-wrap gap-1 justify-end">
                    {t.tags.map(tag => <Tag key={tag}>{tag}</Tag>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
