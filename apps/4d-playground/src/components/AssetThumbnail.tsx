import type { RepositoryAsset } from '../types';

export function AssetThumbnail({ asset }: { asset: RepositoryAsset }) {
  return (
    <div className={`asset-thumbnail asset-thumbnail--${asset.dimension}`}>
      <div className="asset-thumbnail__grid" />
      <div className={`asset-thumbnail__shape asset-thumbnail__shape--${asset.geometry}`} />
      <div className="asset-thumbnail__id">{asset.id}</div>
    </div>
  );
}
