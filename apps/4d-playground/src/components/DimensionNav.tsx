import { Activity, BriefcaseBusiness, Clock3, ShieldCheck } from 'lucide-react';
import type { DimensionMode } from '../types';
import { usePlaygroundStore } from '../store/usePlaygroundStore';

const DIMENSIONS: Array<{
  id: DimensionMode;
  label: string;
  description: string;
  icon: typeof ShieldCheck;
}> = [
  {
    id: 'evidence',
    label: 'Evidence',
    description: 'Sources, claims, and provenance',
    icon: ShieldCheck,
  },
  {
    id: 'work',
    label: 'Work',
    description: 'Projects, tasks, and workflows',
    icon: BriefcaseBusiness,
  },
  {
    id: 'memory',
    label: 'Memory',
    description: 'Objects, snapshots, and lineage',
    icon: Activity,
  },
  {
    id: 'time',
    label: 'Time',
    description: 'Freshness, audits, and state change',
    icon: Clock3,
  },
];

export function DimensionNav() {
  const dimension = usePlaygroundStore((s) => s.dimension);
  const setDimension = usePlaygroundStore((s) => s.setDimension);

  return (
    <nav className="dimension-nav" aria-label="Repository dimensions">
      {DIMENSIONS.map(({ id, label, description, icon: Icon }) => (
        <button
          type="button"
          key={id}
          className={dimension === id ? 'dimension-nav__item is-active' : 'dimension-nav__item'}
          onClick={() => setDimension(id)}
        >
          <Icon size={18} />
          <span>
            <strong>{label}</strong>
            <small>{description}</small>
          </span>
        </button>
      ))}
    </nav>
  );
}
