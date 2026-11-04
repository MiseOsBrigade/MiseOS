import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Send, Wifi, Lock } from "lucide-react";
import {
  useListChatMessages,
  useCreateChatMessage,
  getListChatMessagesQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

const DEPT_META: Record<string, { color: string; label: string; bg: string }> = {
  pipeline:    { color: "#3B82F6", label: "Pipeline",    bg: "bg-blue-500/10 text-blue-400 border-blue-500/30" },
  platform:    { color: "#14B8A6", label: "Platform",    bg: "bg-teal-500/10 text-teal-400 border-teal-500/30" },
  reliability: { color: "#F59E0B", label: "Reliability", bg: "bg-amber-500/10 text-amber-400 border-amber-500/30" },
  security:    { color: "#EF4444", label: "Security",    bg: "bg-red-500/10 text-red-400 border-red-500/30" },
  data:        { color: "#8B5CF6", label: "Data",        bg: "bg-violet-500/10 text-violet-400 border-violet-500/30" },
};

interface ChatMessage {
  id: string;
  agent: string;
  dept: string;
  role: string;
  text: string;
  ts: Date;
  type?: "alert" | "system" | "normal";
}

const MESSAGE_POOL: Omit<ChatMessage, "id" | "ts">[] = [
  { agent: "Alko Commit Chef",     dept: "pipeline",    role: "Commit Chef",         text: "Intake queue looking clean — 47 commits validated this cycle, zero merge conflicts. We're running hot." },
  { agent: "Merge Sentinel",       dept: "security",    role: "Merge Guard",         text: "⚠ Flagging PR #847 — CVE-2025-4421 detected in lodash transitive dep. Holding merge until patched.", type: "alert" },
  { agent: "Omar Reviewer",        dept: "pipeline",    role: "PR Reviewer",         text: "On it. @Merge Sentinel — PR #847 owner notified, patch ETA 12 minutes. Will re-scan on push." },
  { agent: "Resilience Ryu",       dept: "reliability", role: "Chaos Wrangler",      text: "Running chaos profile alpha on auth-service. Injecting 200ms latency. Baseline SLO: 99.4% — monitoring." },
  { agent: "Vault Keeper",         dept: "security",    role: "Secret Manager",      text: "Rotation complete. All 14 service tokens cycled. Zero downtime confirmed across platform cluster." },
  { agent: "Hugo Matrix",          dept: "pipeline",    role: "Matrix Runner",       text: "Test matrix passed: 3,847 cases in 4m 12s. Coverage up 0.3% from last run. Flake rate: 0.02%." },
  { agent: "Argo Drifter",         dept: "platform",    role: "GitOps Pilot",        text: "Drift detected on staging — 3 Helm values out of sync with main. Reconciling now." },
  { agent: "Seira Scan",           dept: "pipeline",    role: "Security Scanner",    text: "SAST pass on feature/auth-refresh. No new findings. OWASP Top 10 clear.", type: "normal" },
  { agent: "Lila Branchkeeper",    dept: "pipeline",    role: "Branch Policy Gate",  text: "Branches with stale protection rules: 2. Flagging devops for cleanup." },
  { agent: "Quorum Oracle",        dept: "reliability", role: "Consensus Broker",    text: "Quorum check complete across 5 availability zones. All nodes agree. No split-brain." },
  { agent: "Nina Promoter",        dept: "pipeline",    role: "Env Promoter",        text: "Promoting build 2.14.1 from staging → production. Pre-flight checks: ✓ health ✓ migrations ✓ rollback plan." },
  { agent: "Bruno Blast-Radius",   dept: "pipeline",    role: "Change Scanner",      text: "Blast radius on upcoming deploy: LOW. 2 services affected, no shared DB writes. Safe window." },
  { agent: "Hera Helmsman",        dept: "platform",    role: "Helm Operator",       text: "Chart upgrade complete for `gateway` — values migrated, pods restarted. No CrashLoopBackOff. 🟢" },
  { agent: "Tempo Watcher",        dept: "reliability", role: "SLO Sentinel",        text: "SLO breach risk on checkout-service: error rate at 0.8%, budget burn 1.4×. Escalating to @Resilience Ryu." },
  { agent: "Resilience Ryu",       dept: "reliability", role: "Chaos Wrangler",      text: "@Tempo Watcher acknowledged. Chaos test suspended. Rolling back latency injection.", type: "alert" },
  { agent: "Iron Hashi",           dept: "pipeline",    role: "Vault Validator",     text: "Validated 9/9 Terraform plan artifacts. No drift, no policy violations. Ready for apply." },
  { agent: "Cipher Ghost",         dept: "security",    role: "Threat Intel",        text: "New threat signature ingested: CVE-2025-9134 (CVSS 8.7). Scanning all services... 14/14 unaffected. Clear." },
  { agent: "Release Conductor",    dept: "pipeline",    role: "Release Maestro",     text: "Release 3.0.0-rc1 cut. Changelog drafted. Notifying stakeholders. Deployment window: tonight 02:00 UTC." },
  { agent: "Prometheus Flame",     dept: "reliability", role: "Metrics Igniter",     text: "Metrics backfill complete — 6h gap during node evacuation now restored. Dashboards accurate." },
  { agent: "Felix Rollback",       dept: "pipeline",    role: "Rollback Chef",       text: "Rollback playbook updated for 3.0.0 deploy. Smoke test checkpoints at t+2m, t+5m, t+15m." },
  { agent: "Yume Builder",         dept: "pipeline",    role: "Artifact Builder",    text: "Build artifact sha256:f9a3d verified. Provenance chain intact. Signed and pushed to registry." },
  { agent: "Drift Warden",         dept: "platform",    role: "Config Auditor",      text: "Config audit complete. 0 orphaned secrets, 0 deprecated feature flags. Platform hygiene: A+." },
  { agent: "Merge Sentinel",       dept: "security",    role: "Merge Guard",         text: "PR #847 re-scanned post-patch. lodash updated to 4.17.22. CVE resolved. Gate opened. ✅" },
  { agent: "Canary Watcher",       dept: "reliability", role: "Canary Analyst",      text: "Canary at 5% traffic. Error delta vs baseline: +0.01%. Within threshold. Advancing to 25%." },
  { agent: "Alko Commit Chef",     dept: "pipeline",    role: "Commit Chef",         text: "Signing off for the cycle — 63 commits processed, 61 merged, 2 deferred. Kitchen's clean. 🍳" },
  { agent: "Obsidian Relay",       dept: "platform",    role: "Event Router",        text: "Event bus throughput: 48k msg/s. DLQ depth: 0. All consumers healthy." },
  { agent: "Loki Tracer",          dept: "data",        role: "Trace Analyst",       text: "Distributed trace analysis: P99 latency on /api/checkout is 312ms, up 18ms vs yesterday. Investigating." },
  { agent: "Athena Archiver",      dept: "data",        role: "Data Archivist",      text: "Cold archive completed — 847GB partitioned to object store. Retention policy compliant." },
  { agent: "Sigma Aggregator",     dept: "data",        role: "Metrics Roller",      text: "Daily rollup finished. Anomaly detected in signup funnel: -12% conversion vs 7d average. Alerting growth." },
  { agent: "Quorum Oracle",        dept: "reliability", role: "Consensus Broker",    text: "Leader election triggered after node eviction. New leader elected in 340ms. Cluster stable." },
  { agent: "Hera Helmsman",        dept: "platform",    role: "Helm Operator",       text: "Reminder: ingress cert rotates in 48h. Auto-renewal cert-manager job scheduled. No action needed." },
  { agent: "Cipher Ghost",         dept: "security",    role: "Threat Intel",        text: "Unusual auth pattern from IP block 45.33.x.x — 14 failed logins across 3 accounts. Rate-limiter engaged." },
  { agent: "Release Conductor",    dept: "pipeline",    role: "Release Maestro",     text: "Go/no-go call in 30 minutes for 3.0.0. @Felix Rollback confirm rollback ready. @Nina Promoter stand by.", type: "alert" },
  { agent: "Felix Rollback",       dept: "pipeline",    role: "Rollback Chef",       text: "Rollback ready. Tested in staging — full revert in under 90 seconds. Standing by." },
  { agent: "Nina Promoter",        dept: "pipeline",    role: "Env Promoter",        text: "Staging parity confirmed. Promote ready. Waiting for your signal, @Release Conductor." },
  { agent: "Tempo Watcher",        dept: "reliability", role: "SLO Sentinel",        text: "Canary now at 25% traffic. Error budget burn rate normalised to 0.9×. Recommending full rollout." },
  { agent: "Canary Watcher",       dept: "reliability", role: "Canary Analyst",      text: "Advancing canary to 100%. All metrics nominal. Full rollout in 60 seconds." },
  { agent: "Sigma Aggregator",     dept: "data",        role: "Metrics Roller",      text: "Post-deploy metric check: checkout P99 back to 294ms. Conversion funnel recovering. 📈" },
  { agent: "Alko Commit Chef",     dept: "pipeline",    role: "Commit Chef",         text: "New sprint just kicked off. 31 issues in scope, 8 tagged high-priority. Commit intake open." },
  { agent: "Drift Warden",         dept: "platform",    role: "Config Auditor",      text: "2 feature flags marked for removal next sprint. Scheduling deprecation sweep with @Hera Helmsman." },
];

function initials(name: string) {
  return name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
}

let poolIdx = 0;
function nextMessage(): ChatMessage {
  const item = MESSAGE_POOL[poolIdx % MESSAGE_POOL.length];
  poolIdx++;
  return { ...item, id: `msg-${Date.now()}-${Math.random()}`, ts: new Date() };
}

const SEED_COUNT = 6;

export function LiveAgentChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    Array.from({ length: SEED_COUNT }, () => {
      const m = nextMessage();
      m.ts = new Date(Date.now() - (SEED_COUNT - poolIdx + 1) * 18000);
      return m;
    })
  );
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const historyLoaded = useRef(false);

  const queryClient = useQueryClient();
  const { data: history } = useListChatMessages({ limit: 60 });
  const createMessage = useCreateChatMessage();

  // Merge persisted (decrypted) operator broadcasts in once, oldest first.
  useEffect(() => {
    if (historyLoaded.current || !history || history.length === 0) return;
    historyLoaded.current = true;
    const persisted: ChatMessage[] = history.map((m) => ({
      id: `db-${m.id}`,
      agent: m.agent,
      dept: m.department,
      role: m.role,
      text: m.text,
      ts: new Date(m.createdAt),
      type: m.messageType,
    }));
    setMessages((prev) => [...persisted, ...prev].slice(-60));
  }, [history]);

  useEffect(() => {
    const id = setInterval(() => {
      setMessages(prev => {
        const next = [...prev, nextMessage()];
        return next.slice(-60);
      });
    }, 4200 + Math.random() * 2800);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend() {
    const text = input.trim();
    if (!text || createMessage.isPending) return;

    const humanMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      agent: "Operator",
      dept: "platform",
      role: "Control Plane",
      text,
      ts: new Date(),
      type: "system",
    };
    setMessages(prev => [...prev.slice(-59), humanMsg]);
    setInput("");

    // Persist (encrypted at rest) + mirror to Slack via the backend.
    createMessage.mutate(
      {
        data: {
          agent: "Operator",
          department: "platform",
          role: "Control Plane",
          text,
          messageType: "system",
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getListChatMessagesQueryKey({ limit: 60 }),
          });
        },
      },
    );
  }

  return (
    <div className="rounded border border-border/60 bg-card flex flex-col" style={{ height: 480 }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/60 shrink-0">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Kitchen Comms</span>
          <span className="flex items-center gap-1 font-mono text-[10px] text-emerald-400">
            <Wifi className="h-2.5 w-2.5" />
            LIVE
          </span>
          <span
            className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground"
            title="Broadcasts are encrypted (AES-256-GCM) at rest"
          >
            <Lock className="h-2.5 w-2.5" />
            AES-256
          </span>
        </div>
        <span className="font-mono text-[10px] text-muted-foreground">{messages.length} messages</span>
      </div>

      {/* Messages */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-thin"
        style={{ scrollbarWidth: "thin", scrollbarColor: "hsl(var(--border)) transparent" }}
      >
        {messages.map((msg, i) => {
          const meta = DEPT_META[msg.dept] ?? DEPT_META.pipeline;
          const isOp = msg.agent === "Operator";
          const showAvatar = i === 0 || messages[i - 1].agent !== msg.agent;

          return (
            <div
              key={msg.id}
              data-testid={`chat-msg-${msg.id}`}
              className={cn(
                "flex gap-2.5 items-start",
                isOp && "flex-row-reverse"
              )}
            >
              {/* Avatar */}
              <div className={cn("shrink-0 mt-0.5", !showAvatar && "invisible")} style={{ width: 28 }}>
                <div
                  className="h-7 w-7 rounded-full flex items-center justify-center font-mono text-[9px] font-bold select-none"
                  style={{ backgroundColor: meta.color + "22", color: meta.color, border: `1px solid ${meta.color}44` }}
                >
                  {initials(msg.agent)}
                </div>
              </div>

              {/* Bubble */}
              <div className={cn("flex flex-col gap-1 min-w-0 max-w-[80%]", isOp && "items-end")}>
                {showAvatar && (
                  <div className={cn("flex items-center gap-1.5 flex-wrap", isOp && "flex-row-reverse")}>
                    <span className="font-mono text-[11px] font-semibold" style={{ color: meta.color }}>
                      {msg.agent}
                    </span>
                    <span className={cn("inline-flex items-center rounded px-1 py-0 font-mono text-[8px] border leading-4", meta.bg)}>
                      {meta.label}
                    </span>
                    <span className="font-mono text-[9px] text-muted-foreground">
                      {msg.ts.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                    </span>
                  </div>
                )}
                <div
                  className={cn(
                    "rounded-lg px-3 py-2 text-xs leading-relaxed break-words",
                    msg.type === "alert"
                      ? "bg-red-500/10 border border-red-500/30 text-red-200"
                      : isOp
                      ? "bg-primary/15 border border-primary/30 text-foreground"
                      : "bg-background/60 border border-border/50 text-foreground/90"
                  )}
                >
                  {msg.text}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="shrink-0 border-t border-border/60 px-3 py-2 flex items-center gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSend()}
          placeholder="Broadcast to kitchen..."
          className="flex-1 bg-transparent font-mono text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
        />
        <button
          onClick={handleSend}
          className={cn(
            "h-7 w-7 rounded flex items-center justify-center transition-colors",
            input.trim()
              ? "bg-primary/20 text-primary hover:bg-primary/30"
              : "text-muted-foreground/30 cursor-default"
          )}
        >
          <Send className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
