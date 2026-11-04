import crypto from 'node:crypto';
export function canonicalize(value){if(Array.isArray(value))return `[${value.map(canonicalize).join(',')}]`;if(value&&typeof value==='object')return `{${Object.keys(value).sort().map(k=>JSON.stringify(k)+':'+canonicalize(value[k])).join(',')}}`;return JSON.stringify(value);}
export function verifyManifestAssetHash(manifest,assetBuffer){if(!manifest?.asset?.sha256||!assetBuffer)return false;const actual=crypto.createHash('sha256').update(assetBuffer).digest('hex');return actual===manifest.asset.sha256;}
