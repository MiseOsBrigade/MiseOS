import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useUpdateGridClaim,
  getListGridClaimsQueryKey,
  getGetGridSummaryQueryKey,
  type GridClaim,
  type GridSource,
  type GridProject,
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  BadgeCheck,
  CircleSlash,
  Flag,
  Link2,
  Link2Off,
  RotateCcw,
  ShieldCheck,
  Gauge,
} from "lucide-react";

const VERIFICATION_STYLE: Record<string, string> = {
  verified: "text-success border-success/40 bg-success/10",
  pending: "text-warning border-warning/40 bg-warning/10",
  unsupported: "text-destructive border-destructive/40 bg-destructive/10",
  deprecated: "text-muted-foreground border-border bg-muted/40",
};

const CONFIDENCE_STYLE: Record<string, string> = {
  high: "text-success border-success/40 bg-success/10",
  medium: "text-warning border-warning/40 bg-warning/10",
  low: "text-muted-foreground border-border bg-muted/40",
  unknown: "text-destructive border-destructive/40 bg-destructive/10",
};

type ClaimFilter = "all" | "verified" | "pending" | "unsupported" | "deprecated";

const FILTERS: ClaimFilter[] = [
  "all",
  "pending",
  "verified",
  "unsupported",
  "deprecated",
];

function ClaimRow({
  claim,
  source,
  project,
  onUpdate,
  busy,
}: {
  claim: GridClaim;
  source?: GridSource;
  project?: GridProject;
  onUpdate: (id: string, verification: GridClaim["verification"]) => void;
  busy: boolean;
}) {
  const verified = claim.verification === "verified";
  const deprecated = claim.verification === "deprecated";

  return (
    <div
      data-testid={`claim-row-${claim.id}`}
      className={cn(
        "rounded border bg-card p-4 space-y-3 transition-opacity",
        deprecated ? "border-border/30 opacity-70" : "border-border/60",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm text-foreground/90 leading-relaxed">{claim.statement}</p>
        <span
          className={cn(
            "shrink-0 inline-flex items-center gap-1 rounded px-2 py-0.5 border font-mono text-[10px] uppercase tracking-wider",
            VERIFICATION_STYLE[claim.verification],
          )}
        >
          {verified && <BadgeCheck className="h-3 w-3" />}
          {claim.verification}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* Source / evidence link */}
        {source ? (
          <span className="inline-flex items-center gap-1 rounded border border-info/40 bg-info/10 px-2 py-0.5 font-mono text-[10px] text-info-foreground/90 max-w-[20rem] truncate">
            <Link2 className="h-3 w-3 shrink-0" />
            <span className="truncate">{source.title}</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded border border-destructive/40 bg-destructive/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-destructive">
            <Link2Off className="h-3 w-3" />
            No source
          </span>
        )}

        {/* Confidence */}
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded px-2 py-0.5 border font-mono text-[10px] uppercase tracking-wider",
            CONFIDENCE_STYLE[claim.confidence],
          )}
        >
          <Gauge className="h-3 w-3" />
          {claim.confidence}
        </span>

        {project && (
          <span className="font-mono text-[10px] text-muted-foreground">
            ↳ {project.name}
          </span>
        )}

        {claim.lastVerified && (
          <span className="font-mono text-[10px] text-muted-foreground">
            verified {claim.lastVerified}
            {claim.verifiedBy ? ` · ${claim.verifiedBy}` : ""}
          </span>
        )}
      </div>

      {claim.notes && (
        <p className="font-mono text-[10px] text-muted-foreground/80 border-l-2 border-border/60 pl-2">
          {claim.notes}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
        {!claim.isVerifiable && !verified && (
          <span className="font-mono text-[10px] text-muted-foreground mr-auto">
            {claim.sourceId === null
              ? "Attach a source to verify"
              : "Needs a confidence signal to verify"}
          </span>
        )}

        {!verified && (
          <Button
            data-testid={`button-verify-${claim.id}`}
            size="sm"
            variant="outline"
            disabled={busy || !claim.isVerifiable}
            onClick={() => onUpdate(claim.id, "verified")}
            className="gap-1.5 border-success/40 text-success hover:bg-success/10 hover:text-success font-mono text-xs disabled:opacity-40"
          >
            <BadgeCheck className="h-3.5 w-3.5" />
            Verify
          </Button>
        )}

        {claim.verification !== "unsupported" && !verified && (
          <Button
            data-testid={`button-flag-${claim.id}`}
            size="sm"
            variant="outline"
            disabled={busy}
            onClick={() => onUpdate(claim.id, "unsupported")}
            className="gap-1.5 border-destructive/40 text-destructive hover:bg-destructive/10 font-mono text-xs"
          >
            <Flag className="h-3.5 w-3.5" />
            Flag
          </Button>
        )}

        {(verified || claim.verification === "unsupported") && (
          <Button
            data-testid={`button-reopen-${claim.id}`}
            size="sm"
            variant="outline"
            disabled={busy}
            onClick={() => onUpdate(claim.id, "pending")}
            className="gap-1.5 border-warning/40 text-warning hover:bg-warning/10 font-mono text-xs"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reopen
          </Button>
        )}

        {!deprecated && (
          <Button
            data-testid={`button-deprecate-${claim.id}`}
            size="sm"
            variant="ghost"
            disabled={busy}
            onClick={() => onUpdate(claim.id, "deprecated")}
            className="gap-1.5 text-muted-foreground hover:text-foreground font-mono text-xs"
          >
            <CircleSlash className="h-3.5 w-3.5" />
            Deprecate
          </Button>
        )}
      </div>
    </div>
  );
}

export function ClaimsTab({
  claims,
  sourceMap,
  projectMap,
}: {
  claims: GridClaim[];
  sourceMap: Record<string, GridSource>;
  projectMap: Record<string, GridProject>;
}) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const update = useUpdateGridClaim();
  const [filter, setFilter] = useState<ClaimFilter>("all");

  const queue = useMemo(
    () => claims.filter(c => c.verification === "pending" || c.verification === "unsupported"),
    [claims],
  );

  const filtered = useMemo(
    () => (filter === "all" ? claims : claims.filter(c => c.verification === filter)),
    [claims, filter],
  );

  function handleUpdate(id: string, verification: GridClaim["verification"]) {
    update.mutate(
      {
        id,
        data: {
          verification,
          ...(verification === "verified" ? { verifiedBy: "Operator" } : {}),
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListGridClaimsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetGridSummaryQueryKey() });
          toast({
            title: "Claim updated",
            description: `Marked ${verification}.`,
          });
        },
        onError: (err: unknown) => {
          const message =
            err instanceof Error ? err.message : "Could not update claim.";
          toast({
            title: "Update rejected",
            description: message,
            variant: "destructive",
          });
        },
      },
    );
  }

  return (
    <div className="space-y-8">
      {/* Operating rules */}
      <div className="rounded border border-gold/30 bg-gold/5 p-4 flex items-start gap-3">
        <ShieldCheck className="h-4 w-4 text-gold shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-mono text-[10px] uppercase tracking-widest text-gold">
            Verification Protocol
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Every claim must cite a <span className="text-info-foreground">Source</span>,
            carry a <span className="text-warning">Confidence</span> signal, and pass{" "}
            <span className="text-success">Verification</span>. A claim with no source
            cannot be verified — flag it or attach evidence first.
          </p>
        </div>
      </div>

      {/* Verification queue */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            Verification Queue
          </h3>
          <span className="font-mono text-[10px] text-warning">
            {queue.length} awaiting review
          </span>
        </div>
        {queue.length === 0 ? (
          <div className="rounded border border-border/40 bg-card p-6 text-center">
            <BadgeCheck className="h-8 w-8 text-success mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Queue clear — every claim is resolved.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {queue.map(c => (
              <ClaimRow
                key={c.id}
                claim={c}
                source={c.sourceId ? sourceMap[c.sourceId] : undefined}
                project={c.projectId ? projectMap[c.projectId] : undefined}
                onUpdate={handleUpdate}
                busy={update.isPending}
              />
            ))}
          </div>
        )}
      </div>

      {/* All claims */}
      <div className="space-y-3">
        <h3 className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          Evidence Board
        </h3>
        <div className="flex flex-wrap gap-1 font-mono text-xs">
          {FILTERS.map(f => (
            <button
              key={f}
              data-testid={`claim-filter-${f}`}
              onClick={() => setFilter(f)}
              className={cn(
                "px-3 py-1.5 rounded uppercase tracking-wider transition-colors border",
                filter === f
                  ? "bg-gold/10 text-gold border-gold/40"
                  : "text-muted-foreground border-border/40 hover:text-foreground hover:border-border",
              )}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="space-y-3">
          {filtered.map(c => (
            <ClaimRow
              key={c.id}
              claim={c}
              source={c.sourceId ? sourceMap[c.sourceId] : undefined}
              project={c.projectId ? projectMap[c.projectId] : undefined}
              onUpdate={handleUpdate}
              busy={update.isPending}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
