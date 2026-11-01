import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useLocation } from "wouter";
import { useGetDashboardStats } from "@workspace/api-client-react";
import { ArrowRight, Play, Pause, Volume2, VolumeX, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const DEPARTMENTS = [
  {
    id: "pipeline", name: "Pipeline Station", tagline: "Build. Test. Deploy. Repeat.",
    color: "#3B82F6", icon: "◈", agents: 15,
    roles: ["Commit Intake", "PR Review", "Test Matrix", "Security Scan", "Artifact Build", "Release"],
  },
  {
    id: "platform", name: "Platform Station", tagline: "The stage where services live.",
    color: "#14B8A6", icon: "◉", agents: 15,
    roles: ["GitOps", "Helm Ops", "Config Audit", "Event Routing", "Infra Provision"],
  },
  {
    id: "reliability", name: "Reliability Station", tagline: "Observe. Measure. Improve.",
    color: "#F59E0B", icon: "◎", agents: 15,
    roles: ["Chaos Engineering", "SLO Monitoring", "Canary Analysis", "Incident Response"],
  },
  {
    id: "security", name: "Security Station", tagline: "Protect the kitchen.",
    color: "#EF4444", icon: "◆", agents: 15,
    roles: ["Merge Guard", "Vault Management", "Threat Intel", "Compliance Scan"],
  },
  {
    id: "data", name: "Data & Insight Station", tagline: "Insight is power.",
    color: "#8B5CF6", icon: "◇", agents: 15,
    roles: ["Trace Analysis", "Metrics Rollup", "Data Archive", "Anomaly Detection"],
  },
];

const SCROLLING_NAMES = [
  "Alko Commit Chef", "Merge Sentinel", "Resilience Ryu", "Vault Keeper", "Hugo Matrix",
  "Argo Drifter", "Seira Scan", "Lila Branchkeeper", "Quorum Oracle", "Nina Promoter",
  "Bruno Blast-Radius", "Hera Helmsman", "Tempo Watcher", "Canary Watcher", "Release Conductor",
  "Iron Hashi", "Cipher Ghost", "Felix Rollback", "Yume Builder", "Drift Warden",
  "Obsidian Relay", "Loki Tracer", "Athena Archiver", "Sigma Aggregator", "Omar Reviewer",
  "Prometheus Flame", "Quorum Oracle", "Kurogami Senpai", "Echo Parser", "Nova Deployer",
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
};
const item = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0 },
};
const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.8 } },
};

function AnimatedStat({ label, value }: { label: string; value: string | number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center gap-1"
    >
      <span className="font-display text-4xl font-extrabold text-primary tabular-nums">{value}</span>
      <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">{label}</span>
    </motion.div>
  );
}

function ThemePlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  const src = `${import.meta.env.BASE_URL}theme.mp3`;

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onTime = () => setProgress((el.currentTime / el.duration) * 100 || 0);
    const onEnd = () => setPlaying(false);
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("ended", onEnd);
    return () => { el.removeEventListener("timeupdate", onTime); el.removeEventListener("ended", onEnd); };
  }, []);

  function toggle() {
    const el = audioRef.current;
    if (!el) return;
    if (playing) { el.pause(); setPlaying(false); }
    else { el.play(); setPlaying(true); }
  }

  function toggleMute() {
    const el = audioRef.current;
    if (!el) return;
    el.muted = !muted;
    setMuted(!muted);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.6 }}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-sm border border-border/60 bg-card/90 backdrop-blur-md px-4 py-2.5 shadow-xl"
      style={{ borderLeftColor: "#e87930", borderLeftWidth: 2 }}
    >
      <audio ref={audioRef} src={src} preload="metadata" />

      <button
        onClick={toggle}
        className="flex h-7 w-7 items-center justify-center rounded-sm bg-primary/15 text-primary hover:bg-primary/25 transition-colors"
      >
        {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
      </button>

      <div className="flex flex-col gap-1 min-w-[120px]">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[9px] uppercase tracking-widest text-primary/80">
            {playing ? "♪ Theme Playing" : "Theme Song"}
          </span>
          <button onClick={toggleMute} className="text-muted-foreground/60 hover:text-foreground transition-colors ml-2">
            {muted ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
          </button>
        </div>
        <div className="h-0.5 w-full rounded-full bg-border/50 overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="font-mono text-[8px] text-muted-foreground/50">MiseOS — Official Theme</span>
      </div>
    </motion.div>
  );
}

export default function Landing() {
  const [, navigate] = useLocation();
  const { data: stats } = useGetDashboardStats();
  const [hovered, setHovered] = useState<string | null>(null);

  const trailerUrl = `${import.meta.env.BASE_URL?.replace(/\/dashboard\/?$/, "")}/mise-orchestra/`;

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">

      {/* ── Dot-grid background ── */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,120,50,0.12) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      {/* ── Radial glow behind hero title ── */}
      <div
        aria-hidden
        className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] z-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(235,100,30,0.15) 0%, transparent 70%)",
        }}
      />

      {/* ────────────────── HERO ────────────────── */}
      <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center gap-6 max-w-4xl mx-auto"
        >
          {/* Eyebrow */}
          <motion.div variants={item} className="flex items-center gap-2">
            <span className="h-px w-12 bg-primary/60" />
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-primary/80">
              Brigade Systems · MiseOS
            </span>
            <span className="h-px w-12 bg-primary/60" />
          </motion.div>

          {/* Main title */}
          <motion.h1
            variants={item}
            className="font-display font-extrabold leading-none tracking-tight"
            style={{ fontSize: "clamp(3rem, 10vw, 7.5rem)" }}
          >
            <span
              style={{
                background: "linear-gradient(135deg, #f5f0ea 0%, #d4722a 50%, #f5f0ea 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                textShadow: "none",
              }}
            >
              MISE
            </span>
            <span
              style={{
                background: "linear-gradient(135deg, #c0bbae 0%, #e87930 45%, #c0bbae 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              OS
            </span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            variants={item}
            className="font-mono text-base text-muted-foreground max-w-xl leading-relaxed"
          >
            75 AI Agents. 5 Stations.{" "}
            <span className="text-primary">One Expeditor.</span>
          </motion.p>

          {/* CTA buttons */}
          <motion.div variants={item} className="flex flex-wrap items-center justify-center gap-4 mt-2">
            <button
              onClick={() => navigate("/overview")}
              className="group flex items-center gap-2 rounded-sm px-6 py-3 bg-primary text-primary-foreground font-mono text-sm font-bold hover:bg-primary/90 transition-colors"
            >
              Enter The Kitchen Table
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href={trailerUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-sm px-6 py-3 border border-border/70 bg-card/60 text-foreground/80 font-mono text-sm hover:border-primary/50 hover:text-foreground transition-colors backdrop-blur-sm"
            >
              <Play className="h-3.5 w-3.5 text-primary" />
              Watch Trailer
            </a>
          </motion.div>

          {/* Scroll cue */}
          <motion.div
            variants={fadeIn}
            className="mt-12 flex flex-col items-center gap-1 text-muted-foreground/40"
          >
            <ChevronDown className="h-5 w-5 animate-bounce" />
          </motion.div>
        </motion.div>
      </section>

      {/* ────────────────── LIVE STATS ────────────────── */}
      <section className="relative z-10 py-16 border-y border-border/40 bg-card/30 backdrop-blur-sm">
        <div className="mx-auto max-w-3xl grid grid-cols-2 gap-8 px-8 sm:grid-cols-4">
          <AnimatedStat label="AI Agents" value={stats?.totalCharacters ?? 75} />
          <AnimatedStat label="Stations" value={stats?.totalDepartments ?? 5} />
          <AnimatedStat label="Active Jobs" value={stats?.activeJobs ?? "–"} />
          <AnimatedStat label="Pending Approvals" value={stats?.pendingApprovals ?? "–"} />
        </div>
      </section>

      {/* ────────────────── DEPARTMENTS ────────────────── */}
      <section className="relative z-10 py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-primary/70">
              The Five Stations
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold">Station Architecture</h2>
            <p className="mt-2 font-mono text-sm text-muted-foreground">
              Each station is a specialized cluster of AI agents with a distinct mission.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {DEPARTMENTS.map((dept, i) => (
              <motion.div
                key={dept.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                onHoverStart={() => setHovered(dept.id)}
                onHoverEnd={() => setHovered(null)}
                onClick={() => navigate("/departments")}
                className="group relative flex flex-col rounded border bg-card/60 p-5 cursor-pointer transition-all duration-300 hover:bg-card overflow-hidden"
                style={{
                  borderColor: hovered === dept.id ? dept.color + "80" : "rgba(255,255,255,0.08)",
                  borderLeftColor: dept.color,
                  borderLeftWidth: 3,
                  boxShadow: hovered === dept.id ? `0 0 24px ${dept.color}18, inset 0 0 24px ${dept.color}06` : "none",
                }}
              >
                {/* Glow top-right */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute -top-8 -right-8 w-24 h-24 rounded-full transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(circle, ${dept.color}22 0%, transparent 70%)`,
                    opacity: hovered === dept.id ? 1 : 0,
                  }}
                />

                <span className="text-2xl mb-3" style={{ color: dept.color }}>{dept.icon}</span>
                <span className="font-display text-sm font-bold leading-tight mb-1">{dept.name}</span>
                <span className="font-mono text-[10px] text-muted-foreground mb-4 leading-relaxed">{dept.tagline}</span>

                <div className="mt-auto space-y-1">
                  {dept.roles.slice(0, 3).map(r => (
                    <div key={r} className="flex items-center gap-1.5">
                      <span className="h-1 w-1 rounded-full" style={{ backgroundColor: dept.color + "99" }} />
                      <span className="font-mono text-[9px] text-muted-foreground">{r}</span>
                    </div>
                  ))}
                  {dept.roles.length > 3 && (
                    <span className="font-mono text-[9px] text-muted-foreground/50">+{dept.roles.length - 3} more</span>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between">
                  <span className="font-mono text-[10px] text-muted-foreground">{dept.agents} agents</span>
                  <span
                    className="font-mono text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: dept.color }}
                  >
                    Explore →
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────── HOW IT WORKS ────────────────── */}
      <section className="relative z-10 py-24 px-6 border-t border-border/40 bg-card/20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-primary/70">Platform</span>
            <h2 className="mt-3 font-display text-3xl font-bold">How MiseOS Works</h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              {
                step: "01",
                title: "Event Triggers",
                body: "A git push, PR open, security alert, or monitor alarm fires an orchestration event into the system.",
                color: "#3B82F6",
              },
              {
                step: "02",
                title: "Agent Dispatch",
                body: "The Expeditor routes the event to the correct Station. Specialist agents pick up tasks and coordinate via the Kitchen Comms channel.",
                color: "#F59E0B",
              },
              {
                step: "03",
                title: "HITL Gate",
                body: "High-risk actions pause for human review. Approve or deny in The Kitchen Table before agents proceed.",
                color: "#EF4444",
              },
            ].map((card, i) => (
              <motion.div
                key={card.step}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="rounded border border-border/50 bg-card/60 p-6 space-y-3"
                style={{ borderTopColor: card.color, borderTopWidth: 2 }}
              >
                <span className="font-mono text-[11px] tracking-widest" style={{ color: card.color }}>
                  STEP {card.step}
                </span>
                <h3 className="font-display text-lg font-bold">{card.title}</h3>
                <p className="font-mono text-xs text-muted-foreground leading-relaxed">{card.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────── SCROLLING TICKER ────────────────── */}
      <section className="relative z-10 py-6 border-y border-border/40 overflow-hidden bg-background/50">
        <div
          className="flex gap-8 whitespace-nowrap"
          style={{
            animation: "ticker 30s linear infinite",
            width: "max-content",
          }}
        >
          {[...SCROLLING_NAMES, ...SCROLLING_NAMES].map((name, i) => (
            <span key={i} className="font-mono text-xs text-muted-foreground/50 shrink-0">
              <span className="text-primary/40 mr-2">◆</span>
              {name}
            </span>
          ))}
        </div>
        <style>{`
          @keyframes ticker {
            0%   { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </section>

      {/* ────────────────── FINAL CTA ────────────────── */}
      <section className="relative z-10 py-32 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-xl space-y-6"
        >
          <h2 className="font-display text-4xl font-extrabold">
            Ready to orchestrate?
          </h2>
          <p className="font-mono text-sm text-muted-foreground leading-relaxed">
            The Kitchen Table gives you real-time telemetry, agent coordination, and human-in-the-loop approval — all in one place.
          </p>
          <button
            onClick={() => navigate("/overview")}
            className="group inline-flex items-center gap-3 rounded-sm px-8 py-4 bg-primary text-primary-foreground font-mono text-sm font-bold hover:bg-primary/90 transition-colors"
          >
            Enter The Kitchen Table
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </section>

      {/* ────────────────── FOOTER ────────────────── */}
      <footer className="relative z-10 border-t border-border/40 py-8 px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="h-6 w-6 rounded-sm flex items-center justify-center font-mono text-[10px] font-bold"
            style={{ background: "rgba(235,100,30,0.15)", color: "#e87930", border: "1px solid rgba(235,100,30,0.3)" }}
          >
            BS
          </div>
          <span className="font-display text-sm font-bold text-foreground/60">Brigade Systems</span>
        </div>
        <span className="font-mono text-[10px] text-muted-foreground/40 uppercase tracking-widest">
          MiseOS · 75 Agents · 5 Stations
        </span>
        <a
          href={trailerUrl}
          target="_blank"
          rel="noreferrer"
          className="font-mono text-[11px] text-primary/60 hover:text-primary transition-colors"
        >
          Watch Trailer →
        </a>
      </footer>

      {/* Floating theme player */}
      <ThemePlayer />
    </div>
  );
}
