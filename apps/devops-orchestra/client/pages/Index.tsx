import { ArrowRight, ChefHat, Flame, Lock, RefreshCw, Shield, Workflow, Code2, Database, Zap, Eye, Users, Layers, TestTube, LogOut } from 'lucide-react';

const MiseIndex = () => {
  const chefs = [
    {
      name: 'Sous Chef',
      role: 'orchestrator',
      description: 'Master conductor orchestrating all mise components in perfect harmony',
      icon: Workflow,
      color: 'from-red-500 to-red-600'
    },
    {
      name: 'Garde Manger',
      role: 'pr-guardian',
      description: 'Safeguards pull requests with intelligent review policies and merge gates',
      icon: Shield,
      color: 'from-blue-500 to-blue-600'
    },
    {
      name: 'Saucier',
      role: 'build-master',
      description: 'Crafts perfect builds with CI/CD templates and test orchestration',
      icon: Flame,
      color: 'from-orange-500 to-orange-600'
    },
    {
      name: 'Sommelier',
      role: 'trace-curator',
      description: 'Pairs observability signals with performance metrics and feedback loops',
      icon: Eye,
      color: 'from-purple-500 to-purple-600'
    },
    {
      name: 'Boulangers',
      role: 'configuration-baker',
      description: 'Bakes mise.yaml configuration with intelligent defaults and validation',
      icon: Code2,
      color: 'from-amber-500 to-amber-600'
    },
    {
      name: 'Pastry Chef',
      role: 'policy-architect',
      description: 'Designs governance frameworks with advisory and enforced modes',
      icon: Layers,
      color: 'from-pink-500 to-pink-600'
    },
    {
      name: 'Poissonier',
      role: 'environment-detector',
      description: 'Intelligently detects git environments: GitHub, GitLab, Bitbucket, or local',
      icon: RefreshCw,
      color: 'from-cyan-500 to-cyan-600'
    },
    {
      name: 'Rôtisseur',
      role: 'profile-analyzer',
      description: 'Profiles repositories as service, library, infra, data, or docs',
      icon: Database,
      color: 'from-green-500 to-green-600'
    },
    {
      name: 'Entremétier',
      role: 'pr-policy-enforcer',
      description: 'Enforces smart PR policies on file changes, lines, and risky paths',
      icon: Zap,
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      name: 'Plongeur',
      role: 'cleanup-maestro',
      description: 'Manages branch lifecycle with stale detection and automatic cleanup',
      icon: Lock,
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      name: 'Commis',
      role: 'module-director',
      description: 'Activates specialized modules: PR, Brigade, Salt Shakers, Locker, GPU',
      icon: Layers,
      color: 'from-violet-500 to-violet-600'
    },
    {
      name: 'Kitchen Porter',
      role: 'security-custodian',
      description: 'Enforces signed commits, blocks force pushes, guards default branches',
      icon: Shield,
      color: 'from-rose-500 to-rose-600'
    },
    {
      name: 'Expeditor',
      role: 'stewardship-guardian',
      description: 'Ensures code stewardship with reviewer requirements and branch management',
      icon: Users,
      color: 'from-teal-500 to-teal-600'
    },
    {
      name: 'Salt Shaker',
      role: 'spice-master',
      description: 'Adds specialized tooling with smart defaults and runtime optimizations',
      icon: TestTube,
      color: 'from-lime-500 to-lime-600'
    },
    {
      name: 'Maître d\'',
      role: 'service-director',
      description: 'Directs the complete service flow ensuring seamless integration across all stations',
      icon: LogOut,
      color: 'from-slate-700 to-slate-800'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 text-slate-900 dark:text-slate-100">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ChefHat className="w-8 h-8 text-red-600 dark:text-red-500" />
            <span className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-500 dark:from-red-500 dark:to-orange-400 bg-clip-text text-transparent">
              Mise
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#chefs" className="text-sm font-medium hover:text-red-600 dark:hover:text-red-500 transition">
              Our Kitchen
            </a>
            <a href="#how-it-works" className="text-sm font-medium hover:text-red-600 dark:hover:text-red-500 transition">
              How It Works
            </a>
            <a href="#features" className="text-sm font-medium hover:text-red-600 dark:hover:text-red-500 transition">
              Features
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-6 px-4 py-2 bg-red-100 dark:bg-red-950 rounded-full">
            <span className="text-sm font-semibold text-red-700 dark:text-red-300">🚀 The DevOps Kitchen</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            <span className="bg-gradient-to-r from-red-600 via-orange-500 to-red-600 dark:from-red-500 dark:via-orange-400 dark:to-red-500 bg-clip-text text-transparent">
              Open Your DevOps Kitchen
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed max-w-3xl mx-auto">
            15 specialized chefs working in perfect harmony. Each with their own identity. All seamlessly orchestrated as one powerful ecosystem.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 dark:from-red-500 dark:to-orange-400 dark:hover:from-red-600 dark:hover:to-orange-500 text-white font-bold rounded-lg transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
              Get Started <ArrowRight className="w-5 h-5" />
            </button>
            <button className="px-8 py-4 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-red-600 dark:hover:border-red-500 text-slate-900 dark:text-white font-bold rounded-lg transition">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* The Kitchen - 15 Chefs */}
      <section id="chefs" className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">Your Kitchen Crew</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              15 specialized chefs, each mastering their station. Together, they orchestrate the most efficient DevOps service.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chefs.map((chef, idx) => {
              const Icon = chef.icon;
              return (
                <div
                  key={idx}
                  className="group relative bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-red-300 dark:hover:border-red-600"
                >
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br ${chef.color} text-white mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-1">{chef.name}</h3>
                  <p className="text-sm font-semibold text-red-600 dark:text-red-400 mb-3 uppercase tracking-wide">{chef.role}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {chef.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">Seamless Service Flow</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              How our 15 chefs work together in perfect harmony
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-12">
            {[
              { num: '1', title: 'Initialize', desc: 'Mise detects your environment and repo profile' },
              { num: '2', title: 'Configure', desc: 'mise.yaml is generated with smart defaults' },
              { num: '3', title: 'Orchestrate', desc: '15 chefs activate their specialized roles' },
              { num: '4', title: 'Harmonize', desc: 'All systems work together seamlessly' }
            ].map((step, idx) => (
              <div key={idx} className="relative">
                <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-red-600 to-orange-500 dark:from-red-500 dark:to-orange-400 text-white font-bold mb-4">
                    {step.num}
                  </div>
                  <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{step.desc}</p>
                </div>
                {idx < 3 && (
                  <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-full w-6 h-1 bg-gradient-to-r from-red-600 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">Built for Modern DevOps</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Everything you need for a production-grade DevOps ecosystem
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: 'Advisory & Enforced Modes',
                description: 'Start with advisory policies that guide your team, then enforce them when ready for full governance.'
              },
              {
                title: 'Multi-Forge Support',
                description: 'Works seamlessly with GitHub, GitLab, Bitbucket, or local repositories. True platform agnosticity.'
              },
              {
                title: 'Intelligent Repo Profiling',
                description: 'Automatically detects if your repo is a service, library, infrastructure, data pipeline, or docs.'
              },
              {
                title: 'Smart PR Management',
                description: 'Enforce policies on changed files, line counts, test requirements, and risky path protections.'
              },
              {
                title: 'Branch Lifecycle Management',
                description: 'Detect stale branches, auto-cleanup, require reviewers, and maintain repository health.'
              },
              {
                title: 'Specialized Modules',
                description: 'Enable just what you need: PR policies, CI/CD, secret management, GPU tasks, and more.'
              }
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-8 hover:shadow-lg transition-all"
              >
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Orchestra - How They Work Together */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">The DevOps Orchestra</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Each chef specialized. All working together. One seamless ecosystem.
            </p>
          </div>

          <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-12">
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="md:w-1/3">
                  <h3 className="text-2xl font-bold mb-3">The Harmony</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    From repository initialization to continuous governance, each chef handles their station perfectly while the Sous Chef orchestrates the complete service.
                  </p>
                </div>
                <div className="md:w-2/3 bg-white dark:bg-slate-950 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
                  <code className="text-sm text-slate-600 dark:text-slate-400 font-mono leading-relaxed block whitespace-pre-wrap">
{`mise:
  version: 1
  mode: advisory          # Start advisory
  environment: github     # Auto-detected
  repo_profile: service   # Intelligently profiled
  
  policies:               # Governed by our chefs
    pr:
      enabled: true
      max_changed_files: 50
      risky_paths: [secrets/*, .github/workflows/*]
    
    stewardship:
      enabled: true
      require_reviewers: 2
    
    security:
      enabled: true
      require_signed_commits: false
  
  modules:
    pr: true              # PR Guardian active
    brigade: true         # Build orchestration
    salt_shakers: true    # Specialized tools
    locker: true          # Secret management
    gpu: false            # Optional heavy lifts`}
                  </code>
                </div>
              </div>

              <div className="border-t border-slate-300 dark:border-slate-700 pt-8">
                <h3 className="text-2xl font-bold mb-6">Each Chef's Station</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  {[
                    { name: 'Sous Chef', task: 'Master orchestration of all modules' },
                    { name: 'Garde Manger', task: 'PR review policies & merge gates' },
                    { name: 'Saucier', task: 'CI/CD pipeline & test automation' },
                    { name: 'Sommelier', task: 'Observability & performance tracing' },
                    { name: 'Boulangers', task: 'Configuration baking & defaults' },
                    { name: 'Pastry Chef', task: 'Governance framework design' },
                    { name: 'Poissonier', task: 'Environment detection' },
                    { name: 'Rôtisseur', task: 'Repository profile analysis' },
                    { name: 'Entremétier', task: 'PR enforcement rules' },
                    { name: 'Plongeur', task: 'Branch cleanup & maintenance' },
                    { name: 'Commis', task: 'Module activation & routing' },
                    { name: 'Kitchen Porter', task: 'Security & signing' },
                    { name: 'Expeditor', task: 'Stewardship requirements' },
                    { name: 'Salt Shaker', task: 'Specialized tooling' },
                    { name: 'Maître d\'', task: 'Service flow direction' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-3 items-start py-2">
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-red-600 to-orange-500 dark:from-red-500 dark:to-orange-400 mt-2 flex-shrink-0" />
                      <div>
                        <span className="font-bold">{item.name}</span>
                        <p className="text-slate-600 dark:text-slate-400">{item.task}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-red-600 to-orange-500 dark:from-red-700 dark:to-orange-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6">Ready to Open Your Kitchen?</h2>
          <p className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of developers using Mise to orchestrate their DevOps workflow with precision and harmony.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-red-600 hover:bg-slate-100 font-bold rounded-lg transition shadow-lg hover:shadow-xl">
              Start Free
            </button>
            <button className="px-8 py-4 bg-white/20 hover:bg-white/30 border border-white text-white font-bold rounded-lg transition">
              View Docs
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center text-slate-600 dark:text-slate-400">
          <p className="mb-2 font-semibold text-slate-900 dark:text-white flex items-center justify-center gap-2">
            <ChefHat className="w-5 h-5" />
            Mise DevOps Orchestra
          </p>
          <p className="text-sm">Orchestrating the future of DevOps, one repository at a time.</p>
        </div>
      </footer>
    </div>
  );
};

export default MiseIndex;
