import { useState } from "react";
import { useListJobs, useSimulateWebhook, getListJobsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Zap, ChevronRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  In_Progress: "text-amber-400 border-amber-500/30 bg-amber-500/8",
  Completed:   "text-emerald-400 border-emerald-500/30 bg-emerald-500/8",
  Queued:      "text-blue-400 border-blue-500/30 bg-blue-500/8",
  Failed:      "text-red-400 border-red-500/30 bg-red-500/8",
};

const EVENT_TYPES = [
  "pull_request.opened",
  "pipeline.test_failed",
  "monitor.alert",
  "security.vulnerability_detected",
  "deployment.requested",
] as const;

function StatusDot({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    In_Progress: "bg-amber-400",
    Completed:   "bg-emerald-400",
    Queued:      "bg-blue-400",
    Failed:      "bg-red-400",
  };
  const isAnimated = status === "In_Progress" || status === "Queued";
  return (
    <span className="relative flex h-2 w-2 shrink-0">
      {isAnimated && <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-60", colorMap[status])} />}
      <span className={cn("relative inline-flex rounded-full h-2 w-2", colorMap[status] ?? "bg-muted-foreground")} />
    </span>
  );
}

export default function JobsList() {
  const [statusFilter, setStatusFilter] = useState("");
  const [simulating, setSimulating] = useState(false);
  const queryClient = useQueryClient();

  const { data: jobs, isLoading } = useListJobs(
    { status: statusFilter || undefined, limit: 20 },
    { query: { queryKey: getListJobsQueryKey({ status: statusFilter || undefined, limit: 20 }) } }
  );
  const simulate = useSimulateWebhook();

  function handleSimulate() {
    const event = EVENT_TYPES[Math.floor(Math.random() * EVENT_TYPES.length)]!;
    setSimulating(true);
    simulate.mutate(
      { data: { eventType: event, source: "control-plane" } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListJobsQueryKey() });
          setSimulating(false);
        },
        onError: () => setSimulating(false),
      }
    );
  }

  return (
    <div className="space-y-8" data-testid="jobs-page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold tracking-tight">Orchestration Jobs</h1>
          <p className="text-sm text-muted-foreground font-mono mt-1">Pipeline runs and agent dispatches</p>
        </div>
        <Button
          data-testid="button-simulate-event"
          onClick={handleSimulate}
          disabled={simulating || simulate.isPending}
          className="gap-2 font-mono text-xs"
        >
          <Zap className="h-3.5 w-3.5" />
          {simulating ? "Dispatching…" : "Simulate Event"}
        </Button>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-1 font-mono text-xs">
        {["", "In_Progress", "Completed", "Queued", "Failed"].map(s => (
          <button
            key={s || "all"}
            data-testid={`filter-${s || "all"}`}
            onClick={() => setStatusFilter(s)}
            className={cn(
              "px-3 py-1.5 rounded uppercase tracking-wider transition-colors border",
              statusFilter === s
                ? "bg-primary/10 text-primary border-primary/40"
                : "text-muted-foreground border-border/40 hover:text-foreground hover:border-border"
            )}
          >
            {s || "All"}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-16 rounded" />)}
        </div>
      ) : !jobs || jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Clock className="h-10 w-10 text-muted-foreground mb-3" />
          <h3 className="text-base font-semibold">No jobs found</h3>
          <p className="text-sm text-muted-foreground mt-1">Simulate an event to create a job</p>
        </div>
      ) : (
        <div className="rounded border border-border/60 bg-card overflow-hidden">
          <div className="grid grid-cols-[auto_1fr_auto_auto_auto] items-center gap-4 px-4 py-2 border-b border-border/40 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            <div className="w-2" />
            <div>Trigger Event</div>
            <div className="w-28 text-right">Status</div>
            <div className="w-36 text-right">Started</div>
            <div className="w-6" />
          </div>
          {jobs.map(job => (
            <Link key={job.id} href={`/jobs/${job.id}`} className="block">
              <div
                data-testid={`row-job-${job.id}`}
                className="grid grid-cols-[auto_1fr_auto_auto_auto] items-center gap-4 px-4 py-3 border-b border-border/30 last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
              >
                <StatusDot status={job.status} />
                <div className="min-w-0">
                  <div className="font-mono text-sm font-medium truncate">{job.triggerEvent}</div>
                  <div className="font-mono text-[10px] text-muted-foreground">#{job.id}</div>
                </div>
                <span className={cn("inline-flex items-center rounded border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide w-28 justify-center", STATUS_STYLES[job.status] ?? "text-muted-foreground border-border")}>
                  {job.status.replace("_", " ")}
                </span>
                <span className="font-mono text-xs text-muted-foreground w-36 text-right">
                  {new Date(job.startedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false })}
                </span>
                <ChevronRight className="h-4 w-4 text-muted-foreground w-6" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
