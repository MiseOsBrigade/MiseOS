export function verifyAsset(asset) {
  const checks = {
    hasGlb: Boolean(asset.files?.glb),
    licensePresent: Boolean(asset.license?.id),
    triangleBudget: Number.isFinite(asset.triangleCount) && asset.triangleCount <= (asset.budget?.maxTriangles ?? 50000),
    fileSizeBudget: Number.isFinite(asset.fileSizeMB) && asset.fileSizeMB <= (asset.budget?.maxFileSizeMB ?? 10),
    orientationChecked: asset.validation?.orientation === 'Y_UP',
    scaleChecked: asset.validation?.scale === 'REAL_WORLD',
    checksumPresent: Boolean(asset.checksum?.sha256)
  };
  const passed = Object.values(checks).every(Boolean);
  return { passed, checks };
}
