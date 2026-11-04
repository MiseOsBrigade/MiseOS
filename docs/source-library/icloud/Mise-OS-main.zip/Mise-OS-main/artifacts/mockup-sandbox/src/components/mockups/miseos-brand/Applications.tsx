import React from 'react';
import './_group.css';
import { Play, ArrowRight, Share2, Heart, MessageSquare, Terminal, Activity, CheckCircle2 } from 'lucide-react';

export function Applications() {
  return (
    <div className="miseos w-full min-h-[2000px] bg-[var(--umami-black)] text-[var(--ink)] p-12 flex flex-col gap-24 font-sans selection:bg-[var(--flame-orange)] selection:text-[#0E0F10]">
      {/* Panel Header */}
      <header className="flex flex-col gap-4 border-b border-[var(--hairline)] pb-8">
        <div className="font-mono text-sm tracking-widest text-[var(--flame-orange)] uppercase">
          04 — Brand in Application
        </div>
        <h1 className="font-display text-5xl font-bold tracking-tight text-[var(--ink)]">
          Real-world usage
        </h1>
        <p className="text-[var(--ink-dim)] max-w-2xl text-lg">
          How the MiseOS identity translates across digital touchpoints, from marketing surfaces to product interfaces.
        </p>
      </header>

      {/* 1. Website Hero */}
      <section className="flex flex-col gap-8">
        <div className="font-mono text-xs tracking-widest text-[var(--ink-dim)] uppercase border-b border-[var(--hairline)] pb-4">
          Marketing / Landing Page
        </div>
        
        <div className="w-full rounded-xl border border-[var(--hairline)] bg-[var(--surface-1)] overflow-hidden shadow-2xl flex flex-col">
          {/* Browser Chrome */}
          <div className="h-10 bg-[var(--surface-2)] border-b border-[var(--hairline)] flex items-center px-4 gap-2">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
              <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
            </div>
            <div className="mx-auto bg-[var(--surface-0)] h-6 rounded-md w-1/3 border border-[var(--hairline)] flex items-center justify-center font-mono text-[10px] text-[var(--ink-faint)]">
              miseos.dev
            </div>
          </div>
          
          {/* Page Content */}
          <div className="flex-1 bg-[var(--umami-black)] relative overflow-hidden flex flex-col">
            {/* Top Nav */}
            <nav className="flex items-center justify-between px-8 py-6 z-10">
              <div className="font-display text-2xl font-bold tracking-tighter">MiseOS</div>
              <div className="flex items-center gap-8 font-mono text-xs uppercase tracking-wider text-[var(--ink-dim)]">
                <span className="hover:text-[var(--ink)] cursor-pointer transition-colors">Platform</span>
                <span className="hover:text-[var(--ink)] cursor-pointer transition-colors">Brigades</span>
                <span className="hover:text-[var(--ink)] cursor-pointer transition-colors">Docs</span>
                <span className="hover:text-[var(--ink)] cursor-pointer transition-colors">Pricing</span>
              </div>
              <button className="bg-[var(--flame-orange)] text-[#0E0F10] font-sans font-medium px-5 py-2.5 rounded-sm hover:opacity-90 transition-opacity">
                Get Started
              </button>
            </nav>

            {/* Hero Section */}
            <div className="flex-1 px-12 py-24 flex flex-col items-center justify-center text-center relative z-10">
              <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--flame-orange)] mb-6 px-3 py-1 rounded-full border border-[var(--flame-orange)]/30 bg-[var(--flame-orange)]/10">
                MiseOS Early Access
              </div>
              <h2 className="font-display text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl leading-[1.1] mb-6">
                Run your software like a <br/>
                <span className="text-[var(--gold-ladle)] italic pr-2">Michelin-star</span> kitchen.
              </h2>
              <p className="text-[var(--ink-dim)] text-xl max-w-2xl mb-12">
                An orchestration layer powered by 75 specialized AI agents working together to build, deploy, and observe your infrastructure.
              </p>
              
              <div className="flex items-center gap-4">
                <button className="bg-[var(--flame-orange)] text-[#0E0F10] font-sans font-medium px-8 py-4 rounded-sm hover:opacity-90 transition-opacity text-lg flex items-center gap-2">
                  Start your shift <ArrowRight size={18} />
                </button>
                <button className="bg-[var(--surface-1)] border border-[var(--hairline-strong)] text-[var(--ink)] font-sans font-medium px-8 py-4 rounded-sm hover:bg-[var(--surface-2)] transition-colors text-lg flex items-center gap-2">
                  <Play size={18} className="text-[var(--ink-dim)]" /> Watch demo
                </button>
              </div>
            </div>

            {/* Hero Artwork - Mascots overlapping */}
            <div className="relative h-64 w-full flex justify-center items-end mt-auto z-0 overflow-hidden opacity-90 border-t border-[var(--hairline)] bg-[var(--surface-1)]">
               {/* Grid background effect */}
               <div className="absolute inset-0 z-0" style={{ backgroundImage: 'radial-gradient(var(--hairline) 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
               <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-[var(--surface-1)] to-transparent z-10"></div>
               
               <img src="/__mockup/images/mascots/04_engineering/Architect.png" className="absolute bottom-0 left-[20%] h-56 object-contain drop-shadow-2xl z-0" alt="Architect" />
               <img src="/__mockup/images/mascots/02_kitchen_operations/Dispatcher.png" className="absolute bottom-0 right-[20%] h-56 object-contain drop-shadow-2xl z-0" alt="Dispatcher" />
               <img src="/__mockup/images/mascots/01_executive_chefs/Orchestra-Core.png" className="absolute -bottom-4 h-72 object-contain drop-shadow-2xl z-10" alt="Orchestra Core" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Social Posts */}
      <section className="flex flex-col gap-8">
        <div className="font-mono text-xs tracking-widest text-[var(--ink-dim)] uppercase border-b border-[var(--hairline)] pb-4 flex justify-between">
          <span>Social Media</span>
          <span>1080 × 1080</span>
        </div>
        
        <div className="grid grid-cols-3 gap-8">
          {/* Post 1 */}
          <div className="aspect-square bg-[var(--surface-1)] rounded-xl border border-[var(--hairline)] flex flex-col overflow-hidden group relative">
            <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity bg-[radial-gradient(circle_at_center,_var(--flame-orange)_0%,_transparent_70%)] mix-blend-screen pointer-events-none"></div>
            <div className="flex-1 p-8 flex flex-col items-center justify-center text-center relative z-10">
              <div className="font-display text-4xl font-bold mb-4 tracking-tight">Meet MiseOS</div>
              <p className="text-[var(--ink-dim)] font-mono text-sm uppercase tracking-widest">The Kitchen is Open</p>
              <img src="/__mockup/images/mascots/01_executive_chefs/Orchestra-Core.png" className="h-48 mt-8 object-contain drop-shadow-xl" alt="Mascot" />
            </div>
            <div className="h-16 border-t border-[var(--hairline)] bg-[var(--surface-2)] flex items-center justify-between px-6 z-10">
              <span className="font-display font-bold text-lg">MiseOS</span>
              <span className="font-mono text-xs text-[var(--ink-dim)]">@mise_os</span>
            </div>
          </div>

          {/* Post 2 */}
          <div className="aspect-square bg-[var(--ink-blue)] rounded-xl border border-[#2A3F5A] flex flex-col overflow-hidden relative">
            <div className="flex-1 p-8 flex flex-col relative z-10 justify-between">
              <div className="font-mono text-xs text-[var(--g-service)] uppercase tracking-widest">Feature Highlight</div>
              <h3 className="font-display text-3xl font-bold tracking-tight leading-snug mt-4 mb-auto">
                "Stop wrestling with YAML.<br/>Let the brigade handle it."
              </h3>
              
              <div className="flex items-end justify-between mt-8">
                <div className="flex flex-col">
                   <span className="font-mono text-sm text-[var(--ink)]">Kurogami</span>
                   <span className="font-mono text-[10px] text-[var(--ink-dim)] uppercase">Executive Chef</span>
                </div>
                <img src="/__mockup/images/mascots/01_executive_chefs/Kurogami.png" className="h-32 object-contain drop-shadow-xl translate-y-4 translate-x-4" alt="Kurogami" />
              </div>
            </div>
          </div>

          {/* Post 3 */}
          <div className="aspect-square bg-[var(--surface-1)] rounded-xl border border-[var(--hairline)] flex flex-col overflow-hidden relative p-8 justify-between">
            <div className="w-full flex justify-between items-center border-b border-[var(--hairline)] pb-4">
              <span className="font-mono text-xs tracking-widest text-[var(--matcha-green)] uppercase">System Status</span>
              <Activity size={16} className="text-[var(--matcha-green)]" />
            </div>
            
            <div className="py-8">
              <div className="font-mono text-xs text-[var(--ink-dim)] mb-2">DEPLOYMENT SUCCESS</div>
              <div className="font-display text-5xl font-bold text-[var(--ink)]">100%</div>
              <div className="font-sans text-sm text-[var(--ink-dim)] mt-4">All 75 agents operating at nominal capacity. Kitchen is fully prepped.</div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                <img src="/__mockup/images/mascots/04_engineering/Coder.png" className="w-8 h-8 rounded-full border-2 border-[var(--surface-1)] bg-[var(--umami-black)]" />
                <img src="/__mockup/images/mascots/05_security/Firewall.png" className="w-8 h-8 rounded-full border-2 border-[var(--surface-1)] bg-[var(--umami-black)]" />
                <img src="/__mockup/images/mascots/06_platform_infra/Database.png" className="w-8 h-8 rounded-full border-2 border-[var(--surface-1)] bg-[var(--umami-black)]" />
              </div>
              <span className="font-mono text-[10px] text-[var(--ink-dim)]">+ 72 agents active</span>
            </div>
          </div>
        </div>
      </section>

      {/* Grid for Bottom Two Sections */}
      <div className="grid grid-cols-2 gap-16 mt-8">
        
        {/* 3. App Icon / Avatar */}
        <section className="flex flex-col gap-8">
          <div className="font-mono text-xs tracking-widest text-[var(--ink-dim)] uppercase border-b border-[var(--hairline)] pb-4">
            App Icon / Avatar
          </div>
          
          <div className="flex gap-8 items-end">
            <div className="flex flex-col items-center gap-4">
              <div className="w-32 h-32 bg-[var(--flame-orange)] rounded-[2rem] shadow-2xl flex items-center justify-center border border-white/10 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                <span className="font-display text-6xl font-bold text-[#0E0F10] tracking-tighter drop-shadow-sm">M</span>
              </div>
              <span className="font-mono text-[10px] text-[var(--ink-dim)]">PRIMARY (1024px)</span>
            </div>
            
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 bg-[var(--surface-1)] rounded-2xl shadow-xl flex items-center justify-center border border-[var(--hairline)]">
                <span className="font-display text-4xl font-bold text-[var(--flame-orange)] tracking-tighter">M</span>
              </div>
              <span className="font-mono text-[10px] text-[var(--ink-dim)]">DARK (512px)</span>
            </div>
            
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 bg-[var(--ink)] rounded-xl shadow-md flex items-center justify-center border border-[var(--hairline)]">
                <span className="font-display text-2xl font-bold text-[#0E0F10] tracking-tighter">M</span>
              </div>
              <span className="font-mono text-[10px] text-[var(--ink-dim)]">LIGHT (256px)</span>
            </div>
          </div>
        </section>

        {/* 4. Product UI Snippet */}
        <section className="flex flex-col gap-8">
          <div className="font-mono text-xs tracking-widest text-[var(--ink-dim)] uppercase border-b border-[var(--hairline)] pb-4">
            Product Dashboard Extract
          </div>
          
          <div className="bg-[var(--surface-1)] border border-[var(--hairline)] rounded-xl p-6 shadow-2xl relative">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h4 className="font-display text-xl font-bold tracking-tight">Deployment Pipeline</h4>
                <div className="font-mono text-xs text-[var(--ink-dim)] mt-1">PRD-9942 • main</div>
              </div>
              <div className="flex items-center gap-2 bg-[var(--matcha-green)]/10 text-[var(--matcha-green)] px-2.5 py-1 rounded border border-[var(--matcha-green)]/20">
                <CheckCircle2 size={14} />
                <span className="font-mono text-[10px] uppercase tracking-wider font-bold">Verified</span>
              </div>
            </div>
            
            {/* Agent Row */}
            <div className="bg-[var(--surface-2)] border border-[var(--hairline-strong)] rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[var(--umami-black)] border border-[var(--hairline)] overflow-hidden flex items-center justify-center flex-shrink-0">
                  <img src="/__mockup/images/mascots/04_engineering/Architect.png" className="h-10 object-contain translate-y-1" alt="Architect" />
                </div>
                <div>
                  <div className="font-sans font-medium text-sm">Architect</div>
                  <div className="font-mono text-[10px] text-[var(--g-engineering)] uppercase tracking-wider mt-0.5">Engineering</div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="font-mono text-xs text-[var(--ink)]">0ms latency</div>
                <div className="font-mono text-[10px] text-[var(--ink-dim)] mt-0.5">Idle</div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-[var(--hairline)] flex items-center justify-between">
              <div className="flex items-center gap-2 text-[var(--ink-dim)]">
                <Terminal size={14} />
                <span className="font-mono text-xs">Waiting for command...</span>
              </div>
              <button className="text-[var(--flame-orange)] font-mono text-[10px] uppercase tracking-wider hover:opacity-80 transition-opacity">
                Execute /&gt;
              </button>
            </div>
          </div>
        </section>
      </div>

    </div>
  );
}
