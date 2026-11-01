import { Database, Gauge, Layers3, MemoryStick } from 'lucide-react';
import type { RepositoryAsset } from '../types';

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

export function TelemetryRail({ assets }: { assets: RepositoryAsset[] }) {
  const raw = assets.reduce((sum, item) => sum + item.memoryBytes, 0);
  const quantized = assets.reduce((sum, item) => sum + item.quantizedBytes, 0);
  const savings = raw ? Math.round((1 - quantized / raw) * 100) : 0;

  const rows = [
    { label: 'Visible records', value: assets.length, icon: Layers3 },
    { label: 'Raw vectors', value: formatBytes(raw), icon: Database },
    { label: 'Quantized', value: formatBytes(quantized), icon: MemoryStick },
    { label: 'Estimated savings', value: `${savings}%`, icon: Gauge },
  ];

  return (
    <aside className="telemetry-rail" aria-label="Memory telemetry">
      <h2>Stack telemetry</h2>
      {rows.map(({ label, value, icon: Icon }) => (
        <div className="telemetry-row" key={label}>
          <Icon size={17} />
          <span>{label}</span>
          <strong>{value}</strong>
        </div>
      ))}
      <p>
        Only one card canvas is activated at a time. Detail mode becomes the sole
        high-quality WebGL context.
      </p>
    </aside>
  );
}
