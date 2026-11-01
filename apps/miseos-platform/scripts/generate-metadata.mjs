import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const count = Number(process.env.MISEOS_TOKEN_COUNT || 112);
const imageBase = process.env.MISEOS_IMAGE_BASE_URI || 'https://example.invalid/cards';
const externalBase = process.env.MISEOS_EXTERNAL_URL || 'https://miseosbrigade.github.io/MiseOS';
const output = resolve('cards/metadata');

await mkdir(output, { recursive: true });

for (let tokenId = 1; tokenId <= count; tokenId += 1) {
  const padded = String(tokenId).padStart(3, '0');
  const metadata = {
    name: `MiseOS Brigade #${padded}`,
    description: 'A MiseOS Brigade collectible representing trustworthy, composable repository operations.',
    image: `${imageBase}/${padded}.png`,
    external_url: `${externalBase}/mint.html?token=${tokenId}`,
    attributes: [
      { trait_type: 'Collection', value: 'MiseOS Brigade' },
      { trait_type: 'Token ID', value: tokenId },
      { trait_type: 'Status', value: 'Genesis' }
    ]
  };
  await writeFile(resolve(output, `${tokenId}.json`), `${JSON.stringify(metadata, null, 2)}\n`);
}

console.log(`Generated ${count} metadata files in ${output}`);
