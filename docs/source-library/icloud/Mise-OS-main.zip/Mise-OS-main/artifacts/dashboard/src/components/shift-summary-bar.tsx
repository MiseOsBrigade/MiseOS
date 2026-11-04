import { useEffect, useRef, useState } from "react";
import { Clock, Users, CheckCircle2, Cpu, Activity, Wifi, type LucideIcon } from "lucide-react";

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

interface Tile {
  label: string;
  value: string;
  sub: string;
  icon: LucideIcon;
  color: string;
}

/**
 * Shift Summary — a live "service" readout that sits above Kitchen Comms.
 * Reports the brigade's current shift at a glance: time worked, agents on
 * shift, work done, agent (compute) usage, and general throughput.
 */
export function ShiftSummaryBar() {
  // Shift opened ~4h37m ago and is ticking live.
  const shiftStart = useRef(new Date(Date.now() - (4 * 3600 + 37 * 60 + 12) * 1000));
  const [elapsed, setElapsed] = useState("00:00:00");
  const [onShift, setOnShift] = useState(64);
  const [workDone, setWorkDone] = useState(1240);
  const [usage, setUsage] = useState(72);
  const [throughput, setThroughput] = useState(47);

  // Live shift clock.
  useEffect(() => {
    const tick = () => {
      const s = Math.floor((Date.now() - shiftStart.current.getTime()) / 1000);
      setElapsed(`${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Live metric drift.
  useEffect(() => {
    const id = setInterval(() => {
      setOnShift((v) => Math.min(75, Math.max(56, v + (Math.floor(Math.random() * 5) - 2))));
      setWorkDone((v) => v + Math.floor(Math.random() * 3) + 1);
      setUsage((v) => Math.min(94, Math.max(48, v + (Math.floor(Math.random() * 7) - 3))));
      setThroughput((v) => Math.min(62, Math.max(31, v + (Math.floor(Math.random() * 9) - 4))));
    }, 3800);
    return () => clearInterval(id);
  }, []);

  const tiles: Tile[] = [
    { label: "Time Worked", value: elapsed, sub: "this shift", icon: Clock, color: "#e87930" },
    { label: "On Shift", value: `${onShift}`, sub: "of 75 agents", icon: Users, color: "#3B82F6" },
    { label: "Work Done", value: workDone.toLocaleString(), sub: "orders served", icon: CheckCircle2, color: "#22C55E" },
    { label: "Agent Usage", value: `${usage}%`, sub: "compute load", icon: Cpu, color: "#F59E0B" },
    { label: "General Work", value: `${throughput}/min`, sub: "throughput", icon: Activity, color: "#8B5CF6" },
  ];

  return (
    <div className="rounded border border-border/60 bg-card overflow-hidden" data-testid="shift-summary-bar">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/60">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Shift Summary</span>
        <span className="flex items-center gap-1 font-mono text-[10px] text-emerald-400">
          <Wifi className="h-2.5 w-2.5" />
          LIVE
        </span>
      </div>

      {/* Tiles */}
      <div className="flex flex-wrap">
        {tiles.map((t) => (
          <div
            key={t.label}
            data-testid={`shift-stat-${t.label.toLowerCase().replace(/\s+/g, "-")}`}
            className="flex-1 min-w-[140px] px-4 py-3 flex flex-col gap-1.5 border-l border-border/40 first:border-l-0"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">{t.label}</span>
              <t.icon className="h-3 w-3" style={{ color: t.color }} />
            </div>
            <span className="font-display text-xl font-bold tabular-nums leading-none" style={{ color: t.color }}>
              {t.value}
            </span>
            <span className="font-mono text-[9px] text-muted-foreground">{t.sub}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
