import { CalendarClock, Database, Link2, X } from 'lucide-react';
import { useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { usePlaygroundStore } from '../store/usePlaygroundStore';
import { AssetViewer } from './AssetViewer';

export function AssetDetail() {
  const asset = usePlaygroundStore((s) => s.selectedAsset);
  const selectAsset = usePlaygroundStore((s) => s.selectAsset);
  const activateViewer = usePlaygroundStore((s) => s.activateViewer);

  useEffect(() => {
    if (!asset) return undefined;

    activateViewer(null);
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') selectAsset(null);
    };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [asset, activateViewer, selectAsset]);

  if (!asset) return null;

  function close() {
    if (asset?.modelUrl) {
      // Explicitly release cached GLTF data when leaving a heavy detail session.
      useGLTF.clear(asset.modelUrl);
    }
    selectAsset(null);
  }

  return (
    <div className="detail-backdrop" role="presentation" onMouseDown={close}>
      <section
        className="asset-detail"
        role="dialog"
        aria-modal="true"
        aria-labelledby="asset-detail-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="detail-close" type="button" onClick={close} aria-label="Close">
          <X size={20} />
        </button>

        <div className="asset-detail__viewer">
          <AssetViewer asset={asset} mode="detail" />
        </div>

        <div className="asset-detail__content">
          <span className={`dimension-label dimension-label--${asset.dimension}`}>
            {asset.dimension}
          </span>
          <h2 id="asset-detail-title">{asset.title}</h2>
          <p className="asset-detail__author">{asset.author}</p>
          <p>{asset.summary}</p>

          <dl>
            <div>
              <dt><Database size={16} /> Vector storage</dt>
              <dd>
                {(asset.memoryBytes / 1024).toFixed(2)} KB raw →{' '}
                {(asset.quantizedBytes / 1024).toFixed(2)} KB stacked
              </dd>
            </div>
            <div>
              <dt><CalendarClock size={16} /> Last verified</dt>
              <dd>{asset.lastVerified}</dd>
            </div>
            <div>
              <dt><Link2 size={16} /> Evidence link</dt>
              <dd>{asset.sourceId ?? asset.projectId ?? 'Internal object'}</dd>
            </div>
          </dl>

          <div className="tag-list">
            {asset.tags.map((tag) => <span key={tag}>{tag}</span>)}
          </div>
        </div>
      </section>
    </div>
  );
}
