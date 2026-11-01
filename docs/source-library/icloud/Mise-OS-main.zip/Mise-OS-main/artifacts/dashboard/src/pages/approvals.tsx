import { useListApprovals, useResolveApproval, getListApprovalsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, AlertTriangle, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const RISK_STYLES: Record<string, string> = {
  critical: "text-red-400 border-red-500/40 bg-red-500/10",
  high: "text-orange-400 border-orange-500/40 bg-orange-500/10",
  medium: "text-amber-400 border-amber-500/40 bg-amber-500/10",
  low: "text-blue-400 border-blue-500/40 bg-blue-500/10",
};

const DEPT_COLOR: Record<string, string> = {
  pipeline: "text-blue-400",
  platform: "text-teal-400",
  reliability: "text-amber-400",
  security: "text-red-400",
  data: "text-purple-400",
};

function ApprovalCard({ approval, onResolve, resolving }: {
  approval: {
    id: number; jobId: number; characterName: string; department: string;
    riskLevel: string; proposedAction: string; sqlPreview?: string | null;
    status: string; createdAt: string;
  };
  onResolve: (id: number, decision: "approved" | "denied") => void;
  resolving: boolean;
}) {
  const isPending = approval.status === "pending";

  return (
    <div
      data-testid={`approval-card-${approval.id}`}
      className={cn(
        "rounded border bg-card p-6 space-y-4 transition-opacity",
        isPending ? "border-border/60" : "border-border/20 opacity-60",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={cn("font-mono text-[10px] uppercase tracking-widest", DEPT_COLOR[approval.department] ?? "text-muted-foreground")}>
              {approval.department}
            </span>
            <span className="text-border/60">·</span>
            <span className="font-mono text-[10px] text-muted-foreground">job #{approval.jobId}</span>
          </div>
          <div className="text-base font-semibold">{approval.characterName}</div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={cn("inline-flex items-center gap-1 rounded px-2 py-1 border font-mono text-[10px] uppercase tracking-wider", RISK_STYLES[approval.riskLevel] ?? "text-muted-foreground border-border bg-muted")}>
            <AlertTriangle className="h-3 w-3" />
            {approval.riskLevel}
          </span>
          {!isPending && (
            <span className={cn(
              "inline-flex items-center gap-1 rounded px-2 py-1 border font-mono text-[10px] uppercase",
              approval.status === "approved"
                ? "text-emerald-400 border-emerald-500/40 bg-emerald-500/10"
                : "text-red-400 border-red-500/40 bg-red-500/10"
            )}>
              {approval.status === "approved" ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
              {approval.status}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Proposed Action</div>
        <p className="text-sm text-foreground/90 leading-relaxed">{approval.proposedAction}</p>
      </div>

      {approval.sqlPreview && (
        <div className="space-y-2">
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">SQL Preview</div>
          <pre className="rounded bg-background border border-border/60 p-3 font-mono text-xs text-amber-300 overflow-x-auto">
            {approval.sqlPreview}
          </pre>
        </div>
      )}

      <div className="flex items-center justify-between pt-2">
        <span className="font-mono text-[10px] text-muted-foreground">
          {new Date(approval.createdAt).toLocaleString()}
        </span>
        {isPending && (
          <div className="flex gap-2">
            <Button
              data-testid={`button-deny-${approval.id}`}
              variant="outline"
              size="sm"
              disabled={resolving}
              onClick={() => onResolve(approval.id, "denied")}
              className="gap-1.5 border-red-500/40 text-red-400 hover:bg-red-500/10 hover:text-red-300 font-mono text-xs"
            >
              <XCircle className="h-3.5 w-3.5" />
              Deny
            </Button>
            <Button
              data-testid={`button-approve-${approval.id}`}
              size="sm"
              disabled={resolving}
              onClick={() => onResolve(approval.id, "approved")}
              className="gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs"
            >
              <CheckCircle className="h-3.5 w-3.5" />
              Approve
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Approvals() {
  const [statusFilter, setStatusFilter] = useState<string>("pending");
  const queryClient = useQueryClient();
  const { data: approvals, isLoading } = useListApprovals(
    { status: statusFilter },
    { query: { queryKey: getListApprovalsQueryKey({ status: statusFilter }) } }
  );
  const resolve = useResolveApproval();

  function handleResolve(id: number, decision: "approved" | "denied") {
    resolve.mutate(
      { id, data: { decision, resolvedBy: "operator" } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListApprovalsQueryKey({ status: "pending" }) });
          queryClient.invalidateQueries({ queryKey: getListApprovalsQueryKey({ status: statusFilter }) });
        },
      }
    );
  }

  const pending = approvals?.filter(a => a.status === "pending") ?? [];

  return (
    <div className="space-y-8" data-testid="approvals-page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold tracking-tight">HITL Approvals</h1>
          <p className="text-sm text-muted-foreground font-mono mt-1">Human-in-the-loop review queue</p>
        </div>
        {pending.length > 0 && (
          <div className="flex items-center gap-2 rounded border border-red-500/40 bg-red-500/10 px-3 py-2">
            <Shield className="h-4 w-4 text-red-400 animate-pulse" />
            <span className="font-mono text-sm text-red-400">{pending.length} pending review</span>
          </div>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 font-mono text-xs">
        {["pending", "approved", "denied"].map(s => (
          <button
            key={s}
            data-testid={`filter-${s}`}
            onClick={() => setStatusFilter(s)}
            className={cn(
              "px-3 py-1.5 rounded uppercase tracking-wider transition-colors border",
              statusFilter === s
                ? "bg-primary/10 text-primary border-primary/40"
                : "text-muted-foreground border-border/40 hover:text-foreground hover:border-border"
            )}
          >
            {s}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-48 rounded" />)}
        </div>
      ) : !approvals || approvals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <CheckCircle className="h-12 w-12 text-emerald-400 mb-4" />
          <h3 className="text-lg font-semibold">No {statusFilter} approvals</h3>
          <p className="text-muted-foreground text-sm mt-1">
            {statusFilter === "pending" ? "All agent actions have been reviewed." : `No ${statusFilter} requests found.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {approvals.map(a => (
            <ApprovalCard
              key={a.id}
              approval={a}
              onResolve={handleResolve}
              resolving={resolve.isPending}
            />
          ))}
        </div>
      )}
    </div>
  );
}
