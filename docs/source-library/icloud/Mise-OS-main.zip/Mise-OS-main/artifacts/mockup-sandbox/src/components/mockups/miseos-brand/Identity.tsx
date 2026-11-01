import './_group.css';

export function Identity() {
  return (
    <div className="miseos w-full min-h-[2000px] bg-[var(--umami-black)] text-[var(--ink)] overflow-x-hidden flex flex-col">
      <div className="max-w-[1280px] w-full mx-auto p-16 md:p-24 flex-1 flex flex-col gap-32">
        {/* MASTHEAD */}
        <section className="relative flex flex-col items-start gap-8 pt-12 border-t border-[var(--hairline-strong)]">
          <div className="absolute top-0 right-0 opacity-20 pointer-events-none">
            <svg width="600" height="600" viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="300" cy="300" r="299.5" stroke="var(--hairline)" />
              <circle cx="300" cy="300" r="200" stroke="var(--hairline)" strokeDasharray="4 4" />
              <circle cx="300" cy="300" r="100" stroke="var(--hairline)" />
            </svg>
          </div>
          
          <div className="flex justify-between items-end w-full relative z-10">
            <div className="flex flex-col gap-6 max-w-2xl">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 flex items-center justify-center border border-[var(--hairline-strong)] rounded-full">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="16" cy="16" r="14" stroke="var(--gold-ladle)" strokeWidth="1.5" />
                    <circle cx="16" cy="16" r="8" stroke="var(--flame-orange)" strokeWidth="1.5" strokeDasharray="2 2" />
                    <circle cx="16" cy="16" r="3" fill="var(--broth-cream)" />
                  </svg>
                </div>
                <h1 className="text-7xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
                  MiseOS
                </h1>
              </div>
              <h2 className="text-3xl text-[var(--ink-dim)] leading-snug" style={{ fontFamily: 'var(--font-display)' }}>
                The agent control plane for software kitchens.
              </h2>
              <p className="text-sm tracking-[0.2em] uppercase text-[var(--flame-orange)] mt-4" style={{ fontFamily: 'var(--font-mono)' }}>
                75 specialized agents. 7 brigades. One orchestra.
              </p>
            </div>
            <div className="relative w-64 h-64 flex-shrink-0">
              <img src="/__mockup/images/mascots/01_executive_chefs/Orchestra-Core.png" alt="Orchestra Core Mascot" className="w-full h-full object-contain filter drop-shadow-2xl" />
              <div className="absolute -bottom-4 right-0 text-[10px] tracking-widest text-[var(--ink-faint)] uppercase" style={{ fontFamily: 'var(--font-mono)' }}>
                Fig 1. Orchestra-Core
              </div>
            </div>
          </div>
        </section>

        {/* LOGO LOCKUPS */}
        <section className="flex flex-col gap-12">
          <header className="flex flex-col gap-2 border-b border-[var(--hairline)] pb-6">
            <span className="text-xs tracking-[0.2em] uppercase text-[var(--ink-faint)]" style={{ fontFamily: 'var(--font-mono)' }}>01. Visual Identity</span>
            <h3 className="text-2xl font-semibold" style={{ fontFamily: 'var(--font-display)' }}>Logo & Clear Space</h3>
          </header>
          
          <div className="grid grid-cols-2 gap-8">
            <div className="bg-[var(--surface-1)] border border-[var(--hairline)] h-64 flex flex-col items-center justify-center relative group p-8">
              <div className="absolute top-4 left-4 text-[10px] tracking-wider text-[var(--ink-dim)] uppercase" style={{ fontFamily: 'var(--font-mono)' }}>Primary Lockup</div>
              <div className="flex items-center gap-4">
                <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="14" stroke="var(--gold-ladle)" strokeWidth="1.5" />
                  <circle cx="16" cy="16" r="8" stroke="var(--flame-orange)" strokeWidth="1.5" strokeDasharray="2 2" />
                  <circle cx="16" cy="16" r="3" fill="var(--broth-cream)" />
                </svg>
                <span className="text-3xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>MiseOS</span>
              </div>
              <div className="absolute inset-8 border border-[var(--hairline-strong)] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>

            <div className="bg-[var(--broth-cream)] text-[var(--umami-black)] h-64 flex flex-col items-center justify-center relative p-8">
              <div className="absolute top-4 left-4 text-[10px] tracking-wider opacity-60 uppercase" style={{ fontFamily: 'var(--font-mono)' }}>Inverted</div>
              <div className="flex items-center gap-4">
                <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="14" stroke="var(--umami-black)" strokeWidth="1.5" />
                  <circle cx="16" cy="16" r="8" stroke="var(--umami-black)" strokeWidth="1.5" strokeDasharray="2 2" />
                  <circle cx="16" cy="16" r="3" fill="var(--umami-black)" />
                </svg>
                <span className="text-3xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>MiseOS</span>
              </div>
            </div>

            <div className="bg-[var(--surface-1)] border border-[var(--hairline)] h-64 flex flex-col items-center justify-center relative p-8">
              <div className="absolute top-4 left-4 text-[10px] tracking-wider text-[var(--ink-dim)] uppercase" style={{ fontFamily: 'var(--font-mono)' }}>Mark Alone</div>
              <svg width="64" height="64" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="14" stroke="var(--gold-ladle)" strokeWidth="1.5" />
                <circle cx="16" cy="16" r="8" stroke="var(--flame-orange)" strokeWidth="1.5" strokeDasharray="2 2" />
                <circle cx="16" cy="16" r="3" fill="var(--broth-cream)" />
              </svg>
            </div>

            <div className="bg-[var(--surface-1)] border border-[var(--hairline)] h-64 flex flex-col items-center justify-center relative p-8 grayscale">
              <div className="absolute top-4 left-4 text-[10px] tracking-wider text-[var(--ink-dim)] uppercase" style={{ fontFamily: 'var(--font-mono)' }}>Monochrome</div>
              <div className="flex items-center gap-4">
                <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="14" stroke="var(--broth-cream)" strokeWidth="1.5" />
                  <circle cx="16" cy="16" r="8" stroke="var(--broth-cream)" strokeWidth="1.5" strokeDasharray="2 2" />
                  <circle cx="16" cy="16" r="3" fill="var(--broth-cream)" />
                </svg>
                <span className="text-3xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>MiseOS</span>
              </div>
            </div>
          </div>
          <p className="text-sm text-[var(--ink-dim)] max-w-2xl">
            Always maintain a clear space around the lockup equal to the height of the circular mark. Minimum size for print is 0.5" height, and 24px height for digital applications.
          </p>
        </section>

        {/* COLOR PALETTE */}
        <section className="flex flex-col gap-12">
          <header className="flex flex-col gap-2 border-b border-[var(--hairline)] pb-6">
            <span className="text-xs tracking-[0.2em] uppercase text-[var(--ink-faint)]" style={{ fontFamily: 'var(--font-mono)' }}>02. Color System</span>
            <h3 className="text-2xl font-semibold" style={{ fontFamily: 'var(--font-display)' }}>Core & Accents</h3>
          </header>

          <div className="grid grid-cols-2 gap-12">
            <div className="flex flex-col gap-6">
              <h4 className="text-sm tracking-[0.1em] uppercase text-[var(--ink-dim)]" style={{ fontFamily: 'var(--font-mono)' }}>Core Colors</h4>
              <div className="flex flex-col gap-4">
                <ColorSwatch name="Umami Black" hex="#0E0F10" varName="--umami-black" usage="Primary background & deep ink" />
                <ColorSwatch name="Broth Cream" hex="#F6F1E7" varName="--broth-cream" usage="Primary text on dark; light surfaces" />
              </div>
            </div>
            
            <div className="flex flex-col gap-6">
              <h4 className="text-sm tracking-[0.1em] uppercase text-[var(--ink-dim)]" style={{ fontFamily: 'var(--font-mono)' }}>Accent Colors</h4>
              <div className="flex flex-col gap-4">
                <ColorSwatch name="Flame Orange" hex="#E97B22" varName="--flame-orange" usage="Primary accent: energy, CTAs, highlights" />
                <ColorSwatch name="Gold Ladle" hex="#D4AF37" varName="--gold-ladle" usage="Premium accent: executive/leadership, prestige" />
                <ColorSwatch name="Matcha Green" hex="#2E8B4E" varName="--matcha-green" usage="Success / verified / engineering" />
                <ColorSwatch name="Ink Blue" hex="#182A41" varName="--ink-blue" usage="Deep secondary surface, data, calm" />
              </div>
            </div>
          </div>
        </section>

        {/* TYPOGRAPHY */}
        <section className="flex flex-col gap-12">
          <header className="flex flex-col gap-2 border-b border-[var(--hairline)] pb-6">
            <span className="text-xs tracking-[0.2em] uppercase text-[var(--ink-faint)]" style={{ fontFamily: 'var(--font-mono)' }}>03. Typography</span>
            <h3 className="text-2xl font-semibold" style={{ fontFamily: 'var(--font-display)' }}>Typeface & Hierarchy</h3>
          </header>

          <div className="grid grid-cols-12 gap-12">
            <div className="col-span-5 flex flex-col gap-8 pr-8 border-r border-[var(--hairline)]">
              <div className="flex flex-col gap-4">
                <h4 className="text-sm tracking-[0.1em] uppercase text-[var(--flame-orange)]" style={{ fontFamily: 'var(--font-mono)' }}>Display / Syne</h4>
                <div className="text-6xl font-bold tracking-tighter leading-none" style={{ fontFamily: 'var(--font-display)' }}>
                  Aa Bb Cc
                </div>
                <div className="flex gap-4 text-lg mt-2 opacity-80" style={{ fontFamily: 'var(--font-display)' }}>
                  <span className="font-normal">Regular</span>
                  <span className="font-semibold">SemiBold</span>
                  <span className="font-bold">Bold</span>
                  <span className="font-extrabold">ExtraBold</span>
                </div>
              </div>
              
              <div className="flex flex-col gap-4 mt-8">
                <h4 className="text-sm tracking-[0.1em] uppercase text-[var(--gold-ladle)]" style={{ fontFamily: 'var(--font-mono)' }}>Sans / Inter</h4>
                <div className="text-4xl font-medium tracking-tight leading-none" style={{ fontFamily: 'var(--font-sans)' }}>
                  Aa Bb Cc
                </div>
                <div className="flex gap-4 text-base mt-2 opacity-80" style={{ fontFamily: 'var(--font-sans)' }}>
                  <span className="font-normal">Regular</span>
                  <span className="font-medium">Medium</span>
                  <span className="font-semibold">SemiBold</span>
                </div>
              </div>

              <div className="flex flex-col gap-4 mt-8">
                <h4 className="text-sm tracking-[0.1em] uppercase text-[var(--matcha-green)]" style={{ fontFamily: 'var(--font-mono)' }}>Mono / Space Mono</h4>
                <div className="text-3xl tracking-wide leading-none" style={{ fontFamily: 'var(--font-mono)' }}>
                  Aa Bb Cc
                </div>
              </div>
            </div>

            <div className="col-span-7 flex flex-col gap-10">
              <div>
                <div className="text-xs tracking-[0.2em] uppercase text-[var(--ink-dim)] mb-3" style={{ fontFamily: 'var(--font-mono)' }}>Display Heading</div>
                <h1 className="text-5xl font-bold tracking-tight leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
                  Orchestrating the modern software kitchen.
                </h1>
              </div>
              
              <div>
                <div className="text-xs tracking-[0.2em] uppercase text-[var(--ink-dim)] mb-3" style={{ fontFamily: 'var(--font-mono)' }}>Body Paragraph</div>
                <p className="text-lg leading-relaxed text-[var(--ink-dim)]" style={{ fontFamily: 'var(--font-sans)' }}>
                  MiseOS is an agent control plane designed for the rigorous demands of professional software development. By modeling our AI agents after a classic kitchen brigade, we bring order, hierarchy, and relentless execution to complex deployments. Precision is required; chaos is unacceptable.
                </p>
              </div>

              <div>
                <div className="text-xs tracking-[0.2em] uppercase text-[var(--ink-dim)] mb-3" style={{ fontFamily: 'var(--font-mono)' }}>Eyebrow / Meta</div>
                <div className="text-sm tracking-[0.15em] uppercase text-[var(--flame-orange)]" style={{ fontFamily: 'var(--font-mono)' }}>
                  System Status: Fully Operational / 75 Agents Active
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BRAND PRINCIPLES / VOICE */}
        <section className="flex flex-col gap-12 pb-24">
          <header className="flex flex-col gap-2 border-b border-[var(--hairline)] pb-6">
            <span className="text-xs tracking-[0.2em] uppercase text-[var(--ink-faint)]" style={{ fontFamily: 'var(--font-mono)' }}>04. Voice & Ethos</span>
            <h3 className="text-2xl font-semibold" style={{ fontFamily: 'var(--font-display)' }}>Brand Principles</h3>
          </header>

          <div className="grid grid-cols-2 gap-8">
            <PrincipleCard 
              num="01" 
              title="Precision over noise." 
              desc="We communicate with extreme clarity. No fluff, no marketing jargon. Only actionable data." 
            />
            <PrincipleCard 
              num="02" 
              title="Calm under load." 
              desc="The kitchen is chaotic; the interface is serene. Dark surfaces and restrained color use reduce cognitive fatigue." 
            />
            <PrincipleCard 
              num="03" 
              title="Craft at scale." 
              desc="Every component feels considered. We scale automation without losing the artisan's touch." 
            />
            <PrincipleCard 
              num="04" 
              title="Mise en place." 
              desc="Everything in its place. The layout is structured, predictable, and optimized for speed of execution." 
            />
          </div>
        </section>
      </div>
    </div>
  );
}

function ColorSwatch({ name, hex, varName, usage }: { name: string, hex: string, varName: string, usage: string }) {
  const isLight = hex.toUpperCase() === '#F6F1E7';
  return (
    <div className="flex h-24 border border-[var(--hairline)] bg-[var(--surface-1)] overflow-hidden">
      <div className="w-24 h-full shrink-0" style={{ backgroundColor: `var(${varName})` }} />
      <div className="p-4 flex flex-col justify-center gap-1 flex-1">
        <div className="flex justify-between items-baseline">
          <span className="font-semibold text-lg" style={{ fontFamily: 'var(--font-display)' }}>{name}</span>
          <span className="text-xs tracking-wider" style={{ fontFamily: 'var(--font-mono)', color: `var(${varName})` }}>{hex}</span>
        </div>
        <p className="text-sm text-[var(--ink-dim)] line-clamp-2">{usage}</p>
      </div>
    </div>
  );
}

function PrincipleCard({ num, title, desc }: { num: string, title: string, desc: string }) {
  return (
    <div className="p-8 border border-[var(--hairline)] bg-[var(--surface-1)] flex flex-col gap-6 relative overflow-hidden group hover:border-[var(--hairline-strong)] transition-colors">
      <div className="absolute -right-4 -top-8 text-9xl font-bold opacity-5 pointer-events-none" style={{ fontFamily: 'var(--font-display)' }}>
        {num}
      </div>
      <div className="text-xs tracking-[0.2em] uppercase text-[var(--flame-orange)]" style={{ fontFamily: 'var(--font-mono)' }}>Principle {num}</div>
      <div>
        <h4 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-display)' }}>{title}</h4>
        <p className="text-[var(--ink-dim)] leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
