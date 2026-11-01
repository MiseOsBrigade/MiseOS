import './_group.css';
import React from 'react';
import { CheckCircle2, XCircle, ChevronRight, Sparkles } from 'lucide-react';

const brigades = [
  {
    id: "01_executive_chefs",
    name: "Executive Chefs",
    count: 10,
    color: "var(--g-executive)",
    mandate: "leadership & orchestration",
    mascots: ["Orchestra-Core", "Kurogami", "Kuro-Guard", "Seira", "Conductor", "Steward-Prime", "Root-Chef", "Policy-Monk", "Audit-Sensei", "Human-Liaison"]
  },
  {
    id: "02_kitchen_operations",
    name: "Kitchen Operations",
    count: 10,
    color: "var(--g-kitchen)",
    mandate: "build, run, schedule, scale",
    mascots: ["Build-Kun", "Dispatcher", "Gatekeeper", "Kaji", "Mizu", "PrepBot", "Scale-Oni", "Scheduler", "Swarmar", "Tensho"]
  },
  {
    id: "03_service_layer",
    name: "Service Layer",
    count: 10,
    color: "var(--g-service)",
    mandate: "APIs, traffic, caching, messaging",
    mascots: ["Cache-Cat", "Flash-Riku", "Iron-Hashi", "Null-Chan", "Patch-Panda", "Relay-Fox", "Streama", "Ticket-Tengu", "Umami-Code", "Yume"]
  },
  {
    id: "04_engineering",
    name: "Engineering",
    count: 10,
    color: "var(--g-engineering)",
    mandate: "code, test, review, docs",
    mascots: ["Architect", "Coder", "Debugger", "DevRel", "Doc-Writer", "Perf-Chef", "Reviewer", "SRE-Chef", "Tester", "UX-Chef"]
  },
  {
    id: "05_security",
    name: "Security",
    count: 10,
    color: "var(--g-security)",
    mandate: "guard, audit, encrypt, scan",
    mascots: ["Compliance", "Encryptor", "Firewall", "Pen-Tester", "Quality-Guard", "Risk-Oracle", "Scanner", "Security-Auditor", "Token-Monk", "Vault-Link"]
  },
  {
    id: "06_platform_infra",
    name: "Platform & Infra",
    count: 12,
    color: "var(--g-platform)",
    mandate: "cloud, storage, observability",
    mascots: ["Alarmer", "Automator", "Cloud-Chef", "Cost-Guard", "Database", "DR-Builder", "Load-Balancer", "Logger", "Networker", "Observatory", "Pipeline", "Storage"]
  },
  {
    id: "07_ecosystem",
    name: "Ecosystem",
    count: 13,
    color: "var(--g-ecosystem)",
    mandate: "integrations, community, tooling",
    mascots: ["API-Gateway", "Argo-Chef", "Community-Rep", "Datadog", "Docker", "GitHub-Chef", "GitLab-Chef", "Jenkins-Chef", "Kubernetes", "Prometheus", "Slack-Bot", "Teacher", "Terraformer"]
  }
];

export function Mascots() {
  return (
    <div className="miseos w-full min-h-[2000px] flex flex-col items-center bg-[var(--umami-black)] text-[var(--ink)] overflow-hidden">
      
      {/* HEADER / NAV (Optional styling) */}
      <header className="w-full px-12 py-8 flex justify-between items-center border-b border-[var(--hairline)]">
        <div className="flex flex-col">
          <span style={{ fontFamily: 'var(--font-mono)' }} className="text-[11px] tracking-widest uppercase text-[var(--ink-faint)]">MiseOS Brand Guidelines</span>
          <h1 style={{ fontFamily: 'var(--font-display)' }} className="text-xl font-bold tracking-tight">CHARACTER SYSTEM</h1>
        </div>
        <div style={{ fontFamily: 'var(--font-mono)' }} className="text-xs text-[var(--gold-ladle)] flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          <span>V1.0</span>
        </div>
      </header>

      {/* 1. HERO SECTION */}
      <section className="w-full max-w-7xl px-12 py-24 flex flex-col md:flex-row items-center gap-16 relative">
        <div className="absolute inset-0 pointer-events-none flex justify-center items-center opacity-20 blur-3xl">
          <div className="w-[600px] h-[600px] rounded-full bg-[var(--gold-ladle)] mix-blend-screen" />
        </div>
        
        <div className="flex-1 flex flex-col z-10">
          <span style={{ fontFamily: 'var(--font-mono)' }} className="text-sm tracking-[0.2em] text-[var(--gold-ladle)] mb-6 uppercase flex items-center gap-2">
            <ChevronRight className="w-4 h-4" /> Flagship Mascot
          </span>
          <h2 style={{ fontFamily: 'var(--font-display)' }} className="text-6xl md:text-8xl font-bold tracking-tighter mb-4 leading-none">
            Orchestra<br />Core
          </h2>
          <p style={{ fontFamily: 'var(--font-sans)' }} className="text-2xl text-[var(--ink-dim)] mb-8 font-light max-w-lg">
            Conductor of the brigade.
          </p>
          <div className="p-6 border border-[var(--hairline-strong)] bg-[var(--surface-1)]/50 backdrop-blur-sm rounded-lg max-w-md">
            <p style={{ fontFamily: 'var(--font-mono)' }} className="text-sm leading-relaxed text-[var(--ink-dim)]">
              The living embodiment of the MiseOS control plane. A masterful conductor orchestrating 75 specialized AI agents into a seamless symphony of software delivery.
            </p>
          </div>
        </div>
        
        <div className="flex-1 flex justify-center z-10 relative group">
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--gold-ladle)]/0 to-[var(--gold-ladle)]/10 rounded-full blur-2xl transition-all duration-700 group-hover:to-[var(--gold-ladle)]/20" />
          <img 
            src="/__mockup/images/mascots/01_executive_chefs/Orchestra-Core.png" 
            alt="Orchestra Core" 
            className="w-full max-w-[500px] drop-shadow-2xl relative z-10 transition-transform duration-700 hover:scale-105"
          />
        </div>
      </section>

      {/* 2. STYLE RULES */}
      <section className="w-full max-w-7xl px-12 py-24 border-t border-[var(--hairline)]">
        <div className="flex flex-col md:flex-row gap-16">
          <div className="flex-1">
            <h3 style={{ fontFamily: 'var(--font-display)' }} className="text-4xl font-bold tracking-tight mb-8">
              Construction Rules
            </h3>
            <ul className="space-y-8">
              {[
                { title: "Chibi Anime Style", desc: "Expressive, accessible, and highly stylized proportions." },
                { title: "Full-Body 1:1 Square", desc: "All mascots are framed in a perfect square for consistent UI usage." },
                { title: "Transparent PNG", desc: "Always transparent backgrounds to sit seamlessly on our dark surfaces." },
                { title: "Brand Palette Derived", desc: "Colors drawn directly from the MiseOS design system." }
              ].map((rule, idx) => (
                <li key={idx} className="flex gap-4">
                  <span style={{ fontFamily: 'var(--font-mono)' }} className="text-[var(--gold-ladle)] mt-1">0{idx + 1}</span>
                  <div>
                    <h4 style={{ fontFamily: 'var(--font-sans)' }} className="text-lg font-bold mb-1">{rule.title}</h4>
                    <p style={{ fontFamily: 'var(--font-sans)' }} className="text-[var(--ink-dim)] text-sm">{rule.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex-1 flex flex-col gap-6">
            <div className="p-8 rounded-xl bg-[var(--surface-1)] border border-[var(--hairline)] flex-1">
              <div className="flex items-center gap-3 mb-4 text-[var(--matcha-green)]">
                <CheckCircle2 className="w-6 h-6" />
                <h4 style={{ fontFamily: 'var(--font-display)' }} className="text-xl font-bold tracking-tight text-[var(--ink)]">Do</h4>
              </div>
              <ul style={{ fontFamily: 'var(--font-mono)' }} className="space-y-3 text-sm text-[var(--ink-dim)]">
                <li className="flex items-start gap-2"><span>•</span> Keep transparent background</li>
                <li className="flex items-start gap-2"><span>•</span> Maintain consistent scale and padding</li>
                <li className="flex items-start gap-2"><span>•</span> Utilize the official brand palette</li>
              </ul>
            </div>
            
            <div className="p-8 rounded-xl bg-[var(--surface-1)] border border-[var(--hairline)] flex-1">
              <div className="flex items-center gap-3 mb-4 text-[#C7423B]">
                <XCircle className="w-6 h-6" />
                <h4 style={{ fontFamily: 'var(--font-display)' }} className="text-xl font-bold tracking-tight text-[var(--ink)]">Don't</h4>
              </div>
              <ul style={{ fontFamily: 'var(--font-mono)' }} className="space-y-3 text-sm text-[var(--ink-dim)]">
                <li className="flex items-start gap-2"><span>•</span> Recolor arbitrarily or use off-brand hues</li>
                <li className="flex items-start gap-2"><span>•</span> Stretch or distort aspect ratios</li>
                <li className="flex items-start gap-2"><span>•</span> Add heavy outlines or drop shadows</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3. THE SEVEN BRIGADES */}
      <section className="w-full max-w-7xl px-12 py-24 border-t border-[var(--hairline)] flex flex-col gap-24">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span style={{ fontFamily: 'var(--font-mono)' }} className="text-sm tracking-[0.2em] text-[var(--flame-orange)] mb-4 block uppercase">
            The Roster
          </span>
          <h3 style={{ fontFamily: 'var(--font-display)' }} className="text-5xl font-bold tracking-tight mb-6">
            The Seven Brigades
          </h3>
          <p style={{ fontFamily: 'var(--font-sans)' }} className="text-[var(--ink-dim)] text-lg">
            75 specialized agents organized by discipline. Each brigade acts as a cohesive unit within the broader MiseOS orchestra.
          </p>
        </div>

        {brigades.map((brigade) => (
          <div key={brigade.id} className="flex flex-col gap-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[var(--hairline-strong)]" style={{ borderColor: brigade.color }}>
              <div>
                <span style={{ fontFamily: 'var(--font-mono)', color: brigade.color }} className="text-xs tracking-widest uppercase opacity-80">
                  Brigade — {brigade.count} Agents
                </span>
                <h4 style={{ fontFamily: 'var(--font-display)' }} className="text-3xl font-bold tracking-tight mt-2 text-[var(--ink)]">
                  {brigade.name}
                </h4>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)' }} className="text-sm text-[var(--ink-dim)] bg-[var(--surface-1)] px-4 py-2 rounded-full border border-[var(--hairline)]">
                Mandate: {brigade.mandate}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-12">
              {brigade.mascots.map((mascotName) => (
                <div key={mascotName} className="flex flex-col items-center text-center group cursor-default">
                  <div className="w-[120px] h-[120px] mb-4 relative flex items-center justify-center bg-[var(--surface-1)] rounded-2xl border border-[var(--hairline)] transition-all duration-300 group-hover:border-opacity-50 group-hover:-translate-y-2 group-hover:shadow-2xl overflow-hidden">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500" style={{ backgroundColor: brigade.color }} />
                    <img 
                      src={`/__mockup/images/mascots/${brigade.id}/${mascotName}.png`}
                      alt={mascotName}
                      className="w-[96px] h-[96px] object-contain relative z-10 drop-shadow-lg transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)' }} className="text-xs text-[var(--ink-dim)] tracking-wide group-hover:text-[var(--ink)] transition-colors duration-300">
                    {mascotName}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* FOOTER */}
      <footer className="w-full px-12 py-12 mt-auto border-t border-[var(--hairline)] flex justify-between items-center text-[var(--ink-faint)]">
        <span style={{ fontFamily: 'var(--font-mono)' }} className="text-xs tracking-widest uppercase">MiseOS / Orchestration Layer</span>
        <span style={{ fontFamily: 'var(--font-mono)' }} className="text-xs">CONFIDENTIAL & PROPRIETARY</span>
      </footer>

    </div>
  );
}
