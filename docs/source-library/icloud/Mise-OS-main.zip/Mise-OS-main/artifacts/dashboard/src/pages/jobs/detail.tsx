import { useRoute, Link } from "wouter";
import { useGetJob, useListJobLogs, getGetJobQueryKey, getListJobLogsQueryKey } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  In_Progress: "text-amber-400 border-amber-500/30 bg-amber-500/8",
  Completed:   "text-emerald-400 border-emerald-500/30 bg-emerald-500/8",
  Queued:      "text-blue-400 border-blue-500/30 bg-blue-500/8",
  Failed:      "text-red-400 border-red-500/30 bg-red-500/8",
};

const AGENT_STATE_STYLES: Record<string, string> = {
  Running:          "text-amber-400",
  Waiting_Approval: "text-red-400",
  Completed:        "text-emerald-400",
  Failed:           "text-red-400",
  Idle:             "text-muted-foreground",
};

const DEPT_COLOR: Record<string, string> = {
  pipeline:    "#3B82F6",
  platform:    "#14B8A6",
  reliability: "#F59E0B",
  security:    "#EF4444",
  data:        "#8B5CF6",
};

const LOG_LEVEL_COLOR: Record<string, string> = {
  INFO:  "text-blue-400",
  WARN:  "text-amber-400",
  ERROR: "text-red-400",
  DEBUG: "text-muted-foreground",
};

export default function JobDetail() {
  const [, params] = useRoute("/jobs/:id");
  const id = params?.id ? parseInt(params.id, 10) : 0;

  const { data: job, isLoading } = useGetJob(id, {
    query: { enabled: !!id, queryKey: getGetJobQueryKey(id) },
  });
  const { data: logs, isLoading: logsLoading } = useListJobLogs(id, {
    query: { enabled: !!id, queryKey: getListJobLogsQueryKey(id) },
  });

  return (
    <div className="space-y-8" data-testid="job-detail-page">
      <div>
        <Link href="/jobs" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors font-mono mb-4">
          <ChevronLeft className="h-3.5 w-3.5" />
          Back to Jobs
        </Link>

        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-64 rounded" />
            <Skeleton className="h-4 w-32 rounded" />
          </div>
        ) : job ? (
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-display font-bold tracking-tight">{job.triggerEvent}</h1>
              <p className="text-sm text-muted-foreground font-mono mt-1">Job #{job.id} · Started {new Date(job.startedAt).toLocaleString()}</p>
            </div>
            <span className={cn("inline-flex items-center rounded border px-3 py-1.5 font-mono text-xs uppercase tracking-wide", STATUS_STYLES[job.status] ?? "text-muted-foreground border-border")}>
              {job.status.replace("_", " ")}
            </span>
          </div>
        ) : (
          <div className="text-muted-foreground">Job not found</div>
        )}
      </div>

      {/* Agent Instances */}
      <div className="space-y-3">
        <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Agent Instances ({job?.agents?.length ?? 0})
        </div>
        {isLoading ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded" />)}
          </div>
        ) : job?.agents && job.agents.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {job.agents.map(agent => (
              <div
                key={agent.id}
                data-testid={`card-agent-${agent.id}`}
                className="rounded border border-border/60 bg-card p-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Cpu className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <div className="min-w-0">
                      <div className="text-sm font-semibold truncate">{agent.characterName}</div>
                      <div
                        className="text-[10px] font-mono"
                        style={{ color: DEPT_COLOR[agent.department] ?? "#888" }}
                      >{agent.department}</div>
                    </div>
                  </div>
                  <span className={cn("font-mono text-[10px] shrink-0", AGENT_STATE_STYLES[agent.state] ?? "text-muted-foreground")}>
                    {agent.state.replace("_", " ")}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Tokens</span>
                  <span className="font-mono text-xs text-foreground">{(agent.tokenUsage ?? 0).toLocaleString()}</span>
                </div>
                <div className="h-1 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min(((agent.tokenUsage ?? 0) / 8000) * 100, 100)}%`,
                      backgroundColor: (agent.tokenUsage ?? 0) > 6000 ? "#EF4444" : (agent.tokenUsage ?? 0) > 3000 ? "#F59E0B" : "#10B981",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground py-8 text-center">No agent instances for this job</div>
        )}
      </div>

      {/* Execution Logs */}
      <div className="rounded border border-border/60 bg-card p-5 space-y-4">
        <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Execution Logs</div>
        {logsLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-7 rounded" />)}
          </div>
        ) : logs && logs.length > 0 ? (
          <div className="space-y-0.5 font-mono text-xs">
            {logs.map(log => (
              <div key={log.id} className="flex items-start gap-3 py-1.5 border-b border-border/20 last:border-0" data-testid={`log-${log.id}`}>
                <span className="text-muted-foreground shrink-0 w-20">
                  {new Date(log.timestamp).toLocaleTimeString('en-US', { hour12: false })}
                </span>
                <span className={cn("shrink-0 w-12 uppercase font-bold", LOG_LEVEL_COLOR[log.logLevel] ?? "text-muted-foreground")}>{log.logLevel}</span>
                <span className="text-primary/70 shrink-0 w-32 truncate">{log.characterName}</span>
                <span className="text-foreground/80 flex-1">{log.message}</span>
                {log.actionTaken && (
                  <span className="shrink-0 text-muted-foreground italic">{log.actionTaken}</span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground text-center py-8">No logs for this job</div>
        )}
      </div>
    </div>
  );
}
