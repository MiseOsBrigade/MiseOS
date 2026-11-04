import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  Activity,
  Box,
  ChefHat,
  Cpu,
  Home,
  LayoutDashboard,
  LayoutGrid,
  Network,
  ShieldAlert,
  Sparkles,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Overview",    href: "/overview",    icon: LayoutDashboard },
  { name: "Kitchen",     href: "/kitchen",      icon: ChefHat },
  { name: "Ecosystem",   href: "/ecosystem",    icon: Network },
  { name: "Jobs",        href: "/jobs",         icon: Activity },
  { name: "Approvals",   href: "/approvals",    icon: ShieldAlert },
  { name: "Stations",    href: "/departments",  icon: Box },
  { name: "Characters",  href: "/characters",   icon: Users },
  { name: "Brigade",     href: "/brigade",      icon: LayoutGrid },
  { name: "Cards",       href: "/cards",        icon: Sparkles },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [time, setTime] = useState(
    new Date().toLocaleTimeString("en-US", { hour12: false })
  );

  useEffect(() => {
    const timer = setInterval(
      () => setTime(new Date().toLocaleTimeString("en-US", { hour12: false })),
      1000
    );
    return () => clearInterval(timer);
  }, []);

  const breadcrumb = location.replace(/^\//, "").replace(/\//g, " / ") || "overview";

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground selection:bg-primary/30">
      {/* Sidebar */}
      <aside className="w-64 flex flex-col border-r border-border/50 bg-sidebar/50 backdrop-blur-xl">
        {/* Branding */}
        <div className="flex h-16 items-center gap-3 border-b border-border/50 px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-gold/15 text-gold ring-1 ring-gold/30">
            <Cpu className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold leading-tight tracking-wide text-foreground">
              Mise<span className="text-gold">OS</span>
            </span>
            <span className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
              Control Plane
            </span>
          </div>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {/* Back to Home */}
          <Link href="/" className="block mb-3">
            <div className="group flex items-center gap-3 rounded-sm px-3 py-2 text-sm font-medium transition-colors text-muted-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground border-l-2 border-transparent">
              <Home className="h-4 w-4 shrink-0 text-muted-foreground/40 group-hover:text-foreground transition-colors" />
              Home
            </div>
          </Link>

          <div className="mb-2 px-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground/60 border-t border-border/30 pt-3">
            Navigation
          </div>

          {navigation.map((item) => {
            const isActive =
              location === item.href ||
              (item.href !== "/" && location.startsWith(item.href));
            return (
              <Link key={item.name} href={item.href} className="block">
                <div
                  className={cn(
                    "group flex items-center gap-3 rounded-sm px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary border-l-2 border-primary"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground border-l-2 border-transparent"
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-4 w-4 shrink-0 transition-colors",
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground group-hover:text-foreground"
                    )}
                  />
                  {item.name}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* System status footer */}
        <div className="p-4 border-t border-border/50 mt-auto">
          <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            <span>System Time</span>
            <span className="text-primary/80">{time}</span>
          </div>
          <div className="mt-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            <span>Status</span>
            <span className="flex items-center gap-1.5 text-emerald-500">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              Online
            </span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
        <header className="h-16 flex items-center justify-between px-8 border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
              {breadcrumb}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded bg-muted/50 flex items-center justify-center border border-border">
              <span className="font-mono text-xs font-bold text-muted-foreground">OP</span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-8 relative">{children}</div>
      </main>
    </div>
  );
}
