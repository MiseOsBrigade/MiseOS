import { useListDepartments } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { ChevronRight } from "lucide-react";
import { cn, stationName } from "@/lib/utils";

const DEPT_ICONS: Record<string, string> = {
  pipeline:    "◈",
  platform:    "◉",
  reliability: "◎",
  security:    "◆",
  data:        "◇",
};

export default function DepartmentsList() {
  const { data: departments, isLoading } = useListDepartments();

  return (
    <div className="space-y-8" data-testid="departments-page">
      <div>
        <h1 className="text-2xl font-display font-bold tracking-tight">The Stations</h1>
        <p className="text-sm text-muted-foreground font-mono mt-1">5 specialized agent units</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-32 rounded" />)}
        </div>
      ) : departments && departments.length > 0 ? (
        <div className="space-y-4">
          {departments.map(dept => (
            <Link key={dept.id} href={`/departments/${dept.id}`} className="block">
              <div
                data-testid={`card-department-${dept.id}`}
                className="rounded border border-border/60 bg-card p-6 hover:border-border transition-all group cursor-pointer"
                style={{ borderLeftColor: dept.color, borderLeftWidth: 3 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl" style={{ color: dept.color }}>{DEPT_ICONS[dept.id] ?? "◈"}</span>
                    <div>
                      <div className="text-lg font-display font-semibold">{stationName(dept.name)}</div>
                      <div className="text-sm text-muted-foreground font-mono">{dept.tagline}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-2xl font-display font-bold tabular-nums" style={{ color: dept.color }}>
                        {dept.characters.length}
                      </div>
                      <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">agents</div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>
                </div>

                {/* Rarity breakdown mini bar */}
                <div className="mt-4 flex gap-1 h-1.5">
                  {["genesis", "legendary", "epic", "rare", "common"].map(rarity => {
                    const count = dept.characters.filter(c => c.rarity === rarity).length;
                    if (!count) return null;
                    const rColors: Record<string, string> = {
                      genesis:   "#F97316",
                      legendary: "#EAB308",
                      epic:      "#A855F7",
                      rare:      "#3B82F6",
                      common:    "#64748B",
                    };
                    return (
                      <div
                        key={rarity}
                        className="rounded-full h-full"
                        title={`${rarity}: ${count}`}
                        style={{
                          flex: count,
                          backgroundColor: rColors[rarity] ?? "#888",
                          opacity: 0.7,
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
