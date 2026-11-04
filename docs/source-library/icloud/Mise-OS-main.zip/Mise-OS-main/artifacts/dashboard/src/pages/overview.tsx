import { useGetDashboardStats, useListApprovals } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity, CheckCircle, Clock, ShieldAlert, Users, Zap } from "lucide-react";
import { cn, stationName } from "@/lib/utils";
import { LiveAgentChat } from "@/components/live-agent-chat";
import { ShiftSummaryBar } from "@/components/shift-summary-bar";

const DEPT_ICONS: Record<string, string> = {
  pipeline: "◈",
  platform: "◉",
  reliability: "◎",
  security: "◆",
  data: "◇",
};

function StatCard({ label, value, sub, icon: Icon, accent }: {
  label: string;
  value: number | string;
  sub?: string;
  icon: React.ElementType;
  accent?: string;
}) {
  return (
    <div data-testid={`stat-${label.toLowerCase().replace(/\s+/g, "-")}`}
      className="rounded border border-border/60 bg-card p-5 flex flex-col gap-3 relative overflow-hidden">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
        <Icon className={cn("h-4 w-4", accent ?? "text-primary")} />
      </div>
      <div className={cn("font-display text-4xl font-bold tabular-nums", accent ?? "text-foreground")}>
        {value}
      </div>
      {sub && <div className="font-mono text-[10px] text-muted-foreground">{sub}</div>}
    </div>
  );
}

export default function Overview() {
  const { data: stats, isLoading: statsLoading } = useGetDashboardStats();
  const { data: approvals } = useListApprovals({ status: "pending" });

  return (
    <div className="space-y-8" data-testid="overview-page">
      <div>
        <h1 className="text-2xl font-display font-bold tracking-tight">System Overview</h1>
        <p className="text-sm text-muted-foreground font-mono mt-1">Real-time telemetry across all stations</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
        {statsLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded" />
          ))
        ) : stats ? (
          <>
            <StatCard label="Total Agents" value={stats.totalCharacters} icon={Users} sub={`across ${stats.totalDepartments} stations`} />
            <StatCard label="Active Jobs" value={stats.activeJobs} icon={Zap} accent="text-amber-400" sub="currently running" />
            <StatCard label="Completed Jobs" value={stats.completedJobs} icon={CheckCircle} accent="text-emerald-400" sub="all time" />
            <StatCard label="Pending Approvals" value={stats.pendingApprovals} icon={ShieldAlert} accent={stats.pendingApprovals > 0 ? "text-red-400" : "text-muted-foreground"} sub="awaiting review" />
            <StatCard label="Total Log Lines" value={stats.totalLogs.toLocaleString()} icon={Activity} sub="execution logs" />
            <StatCard label="Stations" value={stats.totalDepartments} icon={Clock} sub="active stations" />
          </>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Station Breakdown */}
        {stats && (
          <div className="rounded border border-border/60 bg-card p-5 space-y-4">
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Station Breakdown</div>
            <div className="space-y-3">
              {stats.departmentBreakdown.map(dept => (
                <div key={dept.id} className="flex items-center gap-3" data-testid={`dept-row-${dept.id}`}>
                  <span className="font-mono text-lg" style={{ color: dept.color }}>{DEPT_ICONS[dept.id] ?? "◈"}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium truncate">{stationName(dept.name)}</span>
                      <span className="font-mono text-xs text-muted-foreground ml-2">{dept.count}</span>
                    </div>
                    <div className="h-1 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${(dept.count / 15) * 100}%`, backgroundColor: dept.color }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pending Approvals */}
        <div className="rounded border border-border/60 bg-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Pending Approvals</div>
            {approvals && approvals.length > 0 && (
              <span className="font-mono text-[10px] text-red-400 animate-pulse">{approvals.length} awaiting</span>
            )}
          </div>
          {!approvals || approvals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <CheckCircle className="h-8 w-8 text-emerald-400 mb-2" />
              <span className="text-sm text-muted-foreground">All clear — no pending approvals</span>
            </div>
          ) : (
            <div className="space-y-3">
              {approvals.slice(0, 4).map(a => (
                <div key={a.id} className="rounded border border-border/60 bg-background/50 p-3 space-y-1" data-testid={`approval-card-${a.id}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{a.characterName}</span>
                    <span className={cn(
                      "font-mono text-[10px] rounded px-1.5 py-0.5 border",
                      a.riskLevel === "critical" ? "text-red-400 border-red-500/30 bg-red-500/10" :
                      a.riskLevel === "high" ? "text-orange-400 border-orange-500/30 bg-orange-500/10" :
                      "text-amber-400 border-amber-500/30 bg-amber-500/10"
                    )}>{a.riskLevel}</span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{a.proposedAction}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Shift summary + live comms */}
      <div className="space-y-3">
        <ShiftSummaryBar />
        <LiveAgentChat />
      </div>
    </div>
  );
}
