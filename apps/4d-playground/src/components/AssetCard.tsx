import { Maximize2 } from 'lucide-react';
import type { RepositoryAsset } from '../types';
import { usePlaygroundStore } from '../store/usePlaygroundStore';
import { AssetThumbnail } from './AssetThumbnail';
import { AssetViewer } from './AssetViewer';

export function AssetCard({ asset }: { asset: RepositoryAsset }) {
  const hoveredAssetId = usePlaygroundStore((s) => s.hoveredAssetId);
  const activeViewerId = usePlaygroundStore((s) => s.activeViewerId);
  const hoverAsset = usePlaygroundStore((s) => s.hoverAsset);
  const activateViewer = usePlaygroundStore((s) => s.activateViewer);
  const selectAsset = usePlaygroundStore((s) => s.selectAsset);

  const isHovered = hoveredAssetId === asset.id;
  const isActive = activeViewerId === asset.id;

  function handleEnter() {
    hoverAsset(asset.id);
    window.setTimeout(() => {
      const current = usePlaygroundStore.getState().hoveredAssetId;
      if (current === asset.id) activateViewer(asset.id);
    }, 220);
  }

  function handleLeave() {
    hoverAsset(null);
    if (isActive) activateViewer(null);
  }

  return (
    <article
      className={`asset-card ${isHovered ? 'asset-card--hovered' : ''}`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <button
        type="button"
        className="asset-card__visual"
        onClick={() => selectAsset(asset)}
        aria-label={`Open ${asset.title}`}
      >
        {isActive ? <AssetViewer asset={asset} /> : <AssetThumbnail asset={asset} />}
        <span className="asset-card__expand" aria-hidden="true">
          <Maximize2 size={16} />
        </span>
      </button>

      <div className="asset-card__body">
        <div className="asset-card__heading">
          <div>
            <h3>{asset.title}</h3>
            <p>{asset.author}</p>
          </div>
          <span className={`status status--${asset.status.toLowerCase().replace(' ', '-')}`}>
            {asset.status}
          </span>
        </div>

        <p className="asset-card__summary">{asset.summary}</p>

        <div className="asset-card__meta">
          <span>{asset.id}</span>
          <span>{(asset.quantizedBytes / 1024).toFixed(2)} KB vector</span>
        </div>
      </div>
    </article>
  );
}
