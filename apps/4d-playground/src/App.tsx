import { useMemo } from 'react';
import { Box, Cpu, Sparkles } from 'lucide-react';
import { ASSETS } from './data/assets';
import { usePlaygroundStore } from './store/usePlaygroundStore';
import { AssetCard } from './components/AssetCard';
import { AssetDetail } from './components/AssetDetail';
import { DimensionNav } from './components/DimensionNav';
import { SearchBar } from './components/SearchBar';
import { TelemetryRail } from './components/TelemetryRail';

export function App() {
  const dimension = usePlaygroundStore((s) => s.dimension);
  const query = usePlaygroundStore((s) => s.query);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return ASSETS.filter((asset) => {
      const matchesDimension = asset.dimension === dimension;
      if (!matchesDimension) return false;
      if (!normalized) return true;

      return [
        asset.id,
        asset.title,
        asset.author,
        asset.summary,
        asset.status,
        asset.confidence,
        asset.tags.join(' '),
      ].some((value) => value.toLowerCase().includes(normalized));
    });
  }, [dimension, query]);

  return (
    <div className="app-shell">
      <header className="topbar">
        <a href="#main" className="brand" aria-label="Mise 4D Playground home">
          <span className="brand__mark"><Box size={21} /></span>
          <span>
            <strong>Mise 4D</strong>
            <small>Repository Playground</small>
          </span>
        </a>

        <SearchBar />

        <div className="topbar__status">
          <Cpu size={17} />
          <span>WebGL adaptive</span>
        </div>
      </header>

      <DimensionNav />

      <main id="main" className="workspace">
        <section className="workspace__main">
          <header className="workspace__header">
            <div>
              <h1>{dimension[0].toUpperCase() + dimension.slice(1)} dimension</h1>
              <p>
                Rotate the same repository through structured evidence, work,
                memory, and time coordinates.
              </p>
            </div>
            <div className="workspace__mode">
              <Sparkles size={16} />
              <span>Hover to activate one live canvas</span>
            </div>
          </header>

          {filtered.length ? (
            <div className="asset-grid">
              {filtered.map((asset) => <AssetCard key={asset.id} asset={asset} />)}
            </div>
          ) : (
            <div className="empty-state">
              <Box size={28} />
              <h2>No records in this coordinate</h2>
              <p>Change the query or rotate to another dimension.</p>
            </div>
          )}
        </section>

        <TelemetryRail assets={filtered} />
      </main>

      <AssetDetail />
    </div>
  );
}
