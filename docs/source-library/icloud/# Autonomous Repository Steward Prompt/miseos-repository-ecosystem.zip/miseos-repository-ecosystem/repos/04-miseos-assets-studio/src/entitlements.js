export function canExportAsset(asset, entitlement) {
  if (asset.tier === 'free') return true;
  if (asset.tier === 'premium' && entitlement?.ownedPacks?.includes(asset.packId)) return true;
  return false;
}
