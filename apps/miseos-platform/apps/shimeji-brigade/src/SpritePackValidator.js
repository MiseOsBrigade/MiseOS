const PNG_SIGNATURE = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);
const FRAME_NAME = /^frame_\d{3}\.png$/;

function pngHeader(bytes) {
  if (!(bytes instanceof Uint8Array) || bytes.length < 33) return null;
  if (!PNG_SIGNATURE.every((value, index) => bytes[index] === value)) return null;
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  if (view.getUint32(12) !== 0x49484452) return null;
  return {
    width: view.getUint32(16),
    height: view.getUint32(20),
    bitDepth: bytes[24],
    colorType: bytes[25],
    hasAlpha: bytes[25] === 4 || bytes[25] === 6
  };
}

async function defaultRead(path) {
  if (typeof fetch !== "function") throw new Error(`No sprite reader available for ${path}`);
  const response = await fetch(path);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return new Uint8Array(await response.arrayBuffer());
}

export async function validateSpritePack(manifest, options = {}) {
  const errors = [];
  const warnings = [];
  const read = options.read ?? defaultRead;
  const root = options.root ?? "";
  const expectedSize = manifest?.frameSize ?? { width: 128, height: 128 };
  if (!manifest || typeof manifest !== "object") errors.push("manifest is missing or invalid");
  if (!manifest?.states || typeof manifest.states !== "object") errors.push("manifest.states is missing");
  const states = manifest?.states ?? {};
  for (const [state, expectedCount] of Object.entries(states)) {
    const files = Array.from({ length: Number(expectedCount) }, (_, index) => `frame_${String(index + 1).padStart(3, "0")}.png`);
    if (options.list) {
      try {
        const actual = (await options.list(`${root}/${state}`)).filter((filename) => FRAME_NAME.test(filename));
        if (actual.length !== Number(expectedCount)) errors.push(`${state} declares ${expectedCount} frames but contains ${actual.length}`);
      } catch {
        warnings.push(`${state} directory unavailable; procedural fallback selected`);
      }
    }
    for (const filename of files) {
      if (!FRAME_NAME.test(filename)) errors.push(`${state}/${filename} has an invalid frame filename`);
      try {
        const header = pngHeader(await read(`${root}/${state}/${filename}`));
        if (!header) {
          errors.push(`${state}/${filename} is not a readable PNG`);
          continue;
        }
        if (header.width !== expectedSize.width || header.height !== expectedSize.height) errors.push(`${state}/${filename} must be ${expectedSize.width}x${expectedSize.height}`);
        if (header.bitDepth !== 8 || !header.hasAlpha) errors.push(`${state}/${filename} must be an 8-bit transparent PNG`);
      } catch {
        warnings.push(`${state}/${filename} unavailable; procedural fallback selected`);
      }
    }
    if (Number(expectedCount) < 1) errors.push(`${state} must declare at least one frame`);
  }
  return { ok: errors.length === 0, errors, warnings, fallback: warnings.length > 0 };
}

export function safeSpriteState(manifest, state, frames = []) {
  const expected = Number(manifest?.states?.[state] ?? 0);
  return Array.isArray(frames) && frames.length === expected ? frames : [];
}

export { pngHeader };
